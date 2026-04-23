using LibraryCafe.Api.DTOs;
using LibraryCafe.Core.Entities;
using LibraryCafe.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LibraryCafe.Api.Services;
using System.Security.Cryptography;

namespace LibraryCafe.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly LibraryCafeDbContext _context;
        private const decimal FinePerDay = 50m;

        public UsersController(LibraryCafeDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
        {
            var users = await _context.Users
                .Select(u => new UserDto { Id = u.Id, Fullname = u.Fullname, Email = u.Email, Role = u.Role })
                .ToListAsync();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound(new { message = "User not found" });
            return Ok(new UserDto { Id = user.Id, Fullname = user.Fullname, Email = user.Email, Role = user.Role });
        }

        // Step 1: validate email, send code
        [HttpPost("register/send-code")]
        public async Task<IActionResult> SendCode(
            [FromBody] RegisterDto dto,
            [FromServices] EmailService emailSvc,
            [FromServices] PendingVerificationStore store)
        {// Check email domain actually exists
            var domainExists = await emailSvc.DomainHasMailServerAsync(dto.Email);
            if (!domainExists)
                return BadRequest(new { message = "This email domain does not exist. Please use a real email address." });
            if (string.IsNullOrWhiteSpace(dto.Email) || !dto.Email.Contains("@"))
                return BadRequest(new { message = "Invalid email address." });

            // One account per Gmail — block if already registered
            var exists = await _context.Users.AnyAsync(u => u.Email == dto.Email.ToLower());
            if (exists)
                return BadRequest(new { message = "An account with this email already exists." });

            // Cryptographically secure 6-digit code
            var code = RandomNumberGenerator.GetInt32(100000, 999999).ToString();
            store.Save(dto.Email, code, dto.Fullname, dto.Password, dto.Role ?? "Student");

            try
            {
                await emailSvc.SendVerificationCodeAsync(dto.Email, code);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }

            return Ok(new { message = "Verification code sent." });
        }

        // Step 2: verify code, create account
        [HttpPost("register/verify")]
        public async Task<IActionResult> VerifyAndRegister(
            [FromBody] VerifyCodeDto dto,
            [FromServices] PendingVerificationStore store)
        {
            if (!store.Verify(dto.Email, dto.Code, out var fullname, out var password, out var role))
                return BadRequest(new { message = "Invalid or expired code. Max 5 attempts allowed." });

            // Double-check email not registered in the time between send and verify
            var exists = await _context.Users.AnyAsync(u => u.Email == dto.Email.ToLower());
            if (exists)
                return BadRequest(new { message = "An account with this email already exists." });

            var user = new User
            {
                Fullname = fullname,
                Email = dto.Email.ToLower(),
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
                Role = role
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { id = user.Id, fullname = user.Fullname, email = user.Email, role = user.Role });
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(UserLoginDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                return Unauthorized(new { message = "Invalid email or password" });

            return Ok(new UserDto { Id = user.Id, Fullname = user.Fullname, Email = user.Email, Role = user.Role });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserUpdateDto dto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound(new { message = "User not found" });

            if (dto.Fullname != null) user.Fullname = dto.Fullname;
            if (dto.Email != null)
            {
                if (await _context.Users.AnyAsync(u => u.Email == dto.Email && u.Id != id))
                    return BadRequest(new { message = "Email already in use" });
                user.Email = dto.Email;
            }
            if (dto.Password != null)
            {
                if (dto.Password.Length < 6)
                    return BadRequest(new { message = "Password must be at least 6 characters" });
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound(new { message = "User not found" });

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("{id}/borrowings")]
        public async Task<ActionResult<IEnumerable<BorrowingDto>>> GetUserBorrowings(int id)
        {
            var now = DateTime.UtcNow;
            var borrowings = await _context.Borrowings
                .Include(b => b.Book)
                .Include(b => b.User)
                .Where(b => b.UserId == id)
                .OrderByDescending(b => b.BorrowDate)
                .ToListAsync();

            var result = borrowings.Select(b =>
            {
                var overdueDays = b.DueDate.HasValue && b.ReturnDate == null && b.DueDate < now
                    ? (int)(now - b.DueDate.Value).TotalDays : 0;
                return new BorrowingDto
                {
                    Id = b.Id,
                    UserId = b.UserId,
                    UserFullname = b.User?.Fullname ?? "",
                    BookId = b.BookId,
                    BookTitle = b.Book?.Title ?? "",
                    BorrowDate = b.BorrowDate,
                    ReturnDate = b.ReturnDate,
                    DueDate = b.DueDate,
                    IsOverdue = overdueDays > 0,
                    OverdueFine = overdueDays * FinePerDay
                };
            });

            return Ok(result);
        }

        [HttpGet("{id}/orders")]
        public async Task<ActionResult<IEnumerable<CafeOrderDto>>> GetUserOrders(int id)
        {
            var orders = await _context.CafeOrders
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.MenuItem)
                .Where(o => o.UserId == id)
                .OrderByDescending(o => o.OrderDate)
                .Select(o => new CafeOrderDto
                {
                    Id = o.Id,
                    UserId = o.UserId,
                    UserFullname = o.User.Fullname,
                    OrderDate = o.OrderDate,
                    TotalAmount = o.TotalAmount,
                    OrderType = o.OrderType,
                    Status = o.Status,
                    Items = o.OrderItems.Select(oi => new CafeOrderItemDto
                    {
                        Id = oi.Id,
                        ItemId = oi.ItemId,
                        ItemName = oi.MenuItem.ItemName,
                        Quantity = oi.Quantity,
                        Price = oi.MenuItem.Price,
                        Subtotal = oi.MenuItem.Price * oi.Quantity
                    }).ToList()
                })
                .ToListAsync();

            return Ok(orders);
        }

        [HttpGet("{id}/fines")]
        public async Task<ActionResult<object>> GetUserFines(int id)
        {
            var now = DateTime.UtcNow;
            var active = await _context.Borrowings
                .Include(b => b.Book)
                .Where(b => b.UserId == id && b.ReturnDate == null && b.DueDate < now)
                .ToListAsync();

            var items = active.Select(b => new
            {
                BorrowingId = b.Id,
                BookTitle = b.Book?.Title,
                DueDate = b.DueDate,
                OverdueDays = (int)(now - b.DueDate!.Value).TotalDays,
                Fine = (int)(now - b.DueDate!.Value).TotalDays * FinePerDay
            });

            return Ok(new
            {
                TotalFineAmd = items.Sum(i => i.Fine),
                Items = items
            });
        }

        [HttpPost("{id}/change-password")]
        public async Task<IActionResult> ChangePassword(int id, [FromBody] ChangePasswordDto dto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound(new { message = "User not found" });

            if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.PasswordHash))
                return BadRequest(new { message = "Current password is incorrect" });

            if (string.IsNullOrWhiteSpace(dto.NewPassword) || dto.NewPassword.Length < 8)
                return BadRequest(new { message = "New password must be at least 8 characters" });

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Password updated successfully" });
        }
    }

    public class ChangePasswordDto
    {
        public string CurrentPassword { get; set; } = "";
        public string NewPassword { get; set; } = "";
    }
}
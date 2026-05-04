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
                .Select(u => new UserDto { Id = u.Id, Fullname = u.Fullname, Email = u.Email, Role = u.Role, Phone = u.PhoneNumber })
                .ToListAsync();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound(new { message = "User not found" });
            return Ok(new UserDto { Id = user.Id, Fullname = user.Fullname, Email = user.Email, Role = user.Role, Phone = user.PhoneNumber });
        }

        [HttpPost("register/send-code")]
        public async Task<IActionResult> SendCode(
            [FromBody] RegisterDto dto,
            [FromServices] EmailService emailSvc,
            [FromServices] PendingVerificationStore store)
        {
            if (string.IsNullOrWhiteSpace(dto.Email) || !dto.Email.Contains("@"))
                return BadRequest(new { message = "Invalid email address." });

            var domainExists = await emailSvc.DomainHasMailServerAsync(dto.Email);
            if (!domainExists)
                return BadRequest(new { message = "This email domain does not exist. Please use a real email address." });

            var emailExists = await emailSvc.EmailExistsAsync(dto.Email);
            if (!emailExists)
                return BadRequest(new { message = "This email address doesn't exist or can't receive mail. Please use a real email." });

            var exists = await _context.Users.AnyAsync(u => u.Email == dto.Email.ToLower());
            if (exists)
                return BadRequest(new { message = "An account with this email already exists." });

            var code = RandomNumberGenerator.GetInt32(100000, 999999).ToString();
            store.Save(dto.Email, code, dto.Fullname, dto.Password, dto.Role ?? "Student", dto.Phone ?? "");

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

        [HttpPost("register/verify")]
        public async Task<IActionResult> VerifyAndRegister(
            [FromBody] VerifyCodeDto dto,
            [FromServices] PendingVerificationStore store)
        {
            if (!store.Verify(dto.Email, dto.Code, out var fullname, out var password, out var role, out var phone))
                return BadRequest(new { message = "Invalid or expired code. Max 5 attempts allowed." });

            var exists = await _context.Users.AnyAsync(u => u.Email == dto.Email.ToLower());
            if (exists)
                return BadRequest(new { message = "An account with this email already exists." });

            var user = new User
            {
                Fullname = fullname,
                Email = dto.Email.ToLower(),
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
                Role = role,
                PhoneNumber = phone,
                IsApproved = role == "Student"
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            if (role == "Student")
                return Ok(new { id = user.Id, fullname = user.Fullname, email = user.Email, role = user.Role });
            else
                return Ok(new { id = user.Id, fullname = user.Fullname, email = user.Email, role = user.Role, pendingApproval = true });
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(UserLoginDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                return Unauthorized(new { message = "Invalid email or password" });

            if (!user.IsApproved)
                return Unauthorized(new { message = "Your account is pending admin approval." });

            return Ok(new UserDto { Id = user.Id, Fullname = user.Fullname, Email = user.Email, Role = user.Role, Phone = user.PhoneNumber });
        }

        [HttpGet("pending")]
        public async Task<IActionResult> GetPendingUsers()
        {
            var pending = await _context.Users
                .Where(u => !u.IsApproved)
                .Select(u => new {
                    userId = u.Id,
                    fullname = u.Fullname,
                    email = u.Email,
                    phoneNumber = u.PhoneNumber,
                    role = u.Role
                })
                .ToListAsync();
            return Ok(pending);
        }
        [HttpPut("{id}/approve")]
        public async Task<IActionResult> ApproveUser(int id, [FromServices] EmailService emailSvc)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();
            user.IsApproved = true;
            await _context.SaveChangesAsync();

            try { await emailSvc.SendApprovalEmailAsync(user.Email, user.Fullname, user.Role); }
            catch { /* don't block approval if email fails */ }

            return Ok(new { message = "User approved" });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserUpdateDto dto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound(new { message = "User not found" });
            if (dto.Phone != null) user.PhoneNumber = dto.Phone;
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
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                    return NotFound(new { message = "User not found" });

                var activeBorrowings = await _context.Borrowings
                    .AnyAsync(b => b.UserId == id && b.ReturnDate == null);

                if (activeBorrowings)
                    return BadRequest(new { message = "Cannot delete user with unreturned books. Please collect all books first." });

                await _context.SeatReservations.Where(s => s.UserId == id).ExecuteDeleteAsync();
                await _context.BorrowRequests.Where(r => r.UserId == id).ExecuteDeleteAsync();
                await _context.BookReviews.Where(r => r.UserId == id).ExecuteDeleteAsync();
                await _context.CafeReviews.Where(r => r.UserId == id).ExecuteDeleteAsync();

                var orderIds = await _context.CafeOrders
                    .Where(o => o.UserId == id)
                    .Select(o => o.Id)
                    .ToListAsync();

                if (orderIds.Any())
                {
                    await _context.CafeOrderItems.Where(oi => orderIds.Contains(oi.OrderId)).ExecuteDeleteAsync();
                    await _context.CafeOrders.Where(o => orderIds.Contains(o.Id)).ExecuteDeleteAsync();
                }

                await _context.Borrowings.Where(b => b.UserId == id).ExecuteDeleteAsync();
                _context.Users.Remove(user);
                await _context.SaveChangesAsync();

                return Ok(new { message = "User deleted successfully" });
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, new { message = $"Database error: {ex.InnerException?.Message ?? ex.Message}" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error: {ex.Message}" });
            }
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
    }  // ← end of UsersController class

    public class ChangePasswordDto
    {
        public string CurrentPassword { get; set; } = "";
        public string NewPassword { get; set; } = "";
    }
}  // ← end of namespace
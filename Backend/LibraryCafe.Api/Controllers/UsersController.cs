using LibraryCafe.Api.DTOs;
using LibraryCafe.Core.Entities;
using LibraryCafe.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

        // GET: api/users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
        {
            var users = await _context.Users
                .Select(u => new UserDto { Id = u.Id, Fullname = u.Fullname, Email = u.Email, Role = u.Role })
                .ToListAsync();
            return Ok(users);
        }

        // GET: api/users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound(new { message = "User not found" });
            return Ok(new UserDto { Id = user.Id, Fullname = user.Fullname, Email = user.Email, Role = user.Role });
        }

        // POST: api/users/register
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(UserRegisterDto dto)
        {
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                return BadRequest(new { message = "Email already registered" });

            // Basic password validation
            if (string.IsNullOrWhiteSpace(dto.Password) || dto.Password.Length < 6)
                return BadRequest(new { message = "Password must be at least 6 characters" });

            var user = new User
            {
                Fullname = dto.Fullname,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = dto.Role
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUser), new { id = user.Id },
                new UserDto { Id = user.Id, Fullname = user.Fullname, Email = user.Email, Role = user.Role });
        }

        // POST: api/users/login
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(UserLoginDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                return Unauthorized(new { message = "Invalid email or password" });

            return Ok(new UserDto { Id = user.Id, Fullname = user.Fullname, Email = user.Email, Role = user.Role });
        }

        // PUT: api/users/5
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

        // DELETE: api/users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound(new { message = "User not found" });

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // GET: api/users/5/borrowings
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

        // GET: api/users/5/orders
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

        // GET: api/users/5/fines  - total overdue fines for a user
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
    }
}
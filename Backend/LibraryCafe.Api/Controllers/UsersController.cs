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

        public UsersController(LibraryCafeDbContext context)
        {
            _context = context;
        }

        // GET: api/users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
        {
            var users = await _context.Users
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    Fullname = u.Fullname,
                    Email = u.Email,
                    Role = u.Role
                })
                .ToListAsync();

            return Ok(users);
        }

        // GET: api/users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            var userDto = new UserDto
            {
                Id = user.Id,
                Fullname = user.Fullname,
                Email = user.Email,
                Role = user.Role
            };

            return Ok(userDto);
        }

        // POST: api/users/register
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(UserRegisterDto registerDto)
        {
            // Check if email already exists
            if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email))
            {
                return BadRequest(new { message = "Email already registered" });
            }

            // Hash password (in production, use BCrypt or similar)
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

            var user = new User
            {
                Fullname = registerDto.Fullname,
                Email = registerDto.Email,
                PasswordHash = passwordHash,
                Role = registerDto.Role
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var userDto = new UserDto
            {
                Id = user.Id,
                Fullname = user.Fullname,
                Email = user.Email,
                Role = user.Role
            };

            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, userDto);
        }

        // POST: api/users/login
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(UserLoginDto loginDto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == loginDto.Email);

            if (user == null)
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

            // Verify password (in production, use BCrypt or similar)
            bool isValidPassword = BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash);

            if (!isValidPassword)
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

            var userDto = new UserDto
            {
                Id = user.Id,
                Fullname = user.Fullname,
                Email = user.Email,
                Role = user.Role
            };

            return Ok(userDto);
        }

        // PUT: api/users/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserUpdateDto updateDto)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            if (updateDto.Fullname != null) user.Fullname = updateDto.Fullname;
            if (updateDto.Email != null)
            {
                // Check if new email already exists
                if (await _context.Users.AnyAsync(u => u.Email == updateDto.Email && u.Id != id))
                {
                    return BadRequest(new { message = "Email already in use" });
                }
                user.Email = updateDto.Email;
            }
            if (updateDto.Password != null)
            {
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(updateDto.Password);
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/users/5/borrowings
        [HttpGet("{id}/borrowings")]
        public async Task<ActionResult<IEnumerable<BorrowingDto>>> GetUserBorrowings(int id)
        {
            var borrowings = await _context.Borrowings
                .Include(b => b.Book)
                .Include(b => b.User)
                .Where(b => b.UserId == id)
                .OrderByDescending(b => b.BorrowDate)
                .Select(b => new BorrowingDto
                {
                    Id = b.Id,
                    UserId = b.UserId,
                    UserFullname = b.User.Fullname,
                    BookId = b.BookId,
                    BookTitle = b.Book.Title,
                    BorrowDate = b.BorrowDate,
                    ReturnDate = b.ReturnDate,
                    DueDate = b.DueDate,
                    IsOverdue = b.DueDate.HasValue && b.ReturnDate == null && b.DueDate < DateTime.Now
                })
                .ToListAsync();

            return Ok(borrowings);
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
    }
}
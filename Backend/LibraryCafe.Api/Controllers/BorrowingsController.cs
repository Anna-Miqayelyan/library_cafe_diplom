using LibraryCafe.Api.DTOs;
using LibraryCafe.Core.Entities;
using LibraryCafe.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryCafe.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BorrowingsController : ControllerBase
    {
        private readonly LibraryCafeDbContext _context;

        public BorrowingsController(LibraryCafeDbContext context)
        {
            _context = context;
        }

        // GET: api/borrowings
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BorrowingDto>>> GetBorrowings(
            [FromQuery] bool? active = null)
        {
            var query = _context.Borrowings
                .Include(b => b.User)
                .Include(b => b.Book)
                .AsQueryable();

            if (active.HasValue)
            {
                if (active.Value)
                {
                    query = query.Where(b => b.ReturnDate == null);
                }
                else
                {
                    query = query.Where(b => b.ReturnDate != null);
                }
            }

            var borrowings = await query
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

        // GET: api/borrowings/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BorrowingDto>> GetBorrowing(int id)
        {
            var borrowing = await _context.Borrowings
                .Include(b => b.User)
                .Include(b => b.Book)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (borrowing == null)
            {
                return NotFound(new { message = "Borrowing not found" });
            }

            var borrowingDto = new BorrowingDto
            {
                Id = borrowing.Id,
                UserId = borrowing.UserId,
                UserFullname = borrowing.User.Fullname,
                BookId = borrowing.BookId,
                BookTitle = borrowing.Book.Title,
                BorrowDate = borrowing.BorrowDate,
                ReturnDate = borrowing.ReturnDate,
                DueDate = borrowing.DueDate,
                IsOverdue = borrowing.DueDate.HasValue && borrowing.ReturnDate == null && borrowing.DueDate < DateTime.Now
            };

            return Ok(borrowingDto);
        }

        // POST: api/borrowings
        [HttpPost]
        public async Task<ActionResult<BorrowingDto>> CreateBorrowing(BorrowingCreateDto borrowingDto)
        {
            // Check if user exists
            var user = await _context.Users.FindAsync(borrowingDto.UserId);
            if (user == null)
            {
                return BadRequest(new { message = "User not found" });
            }

            // Check if book exists
            var book = await _context.Books.FindAsync(borrowingDto.BookId);
            if (book == null)
            {
                return BadRequest(new { message = "Book not found" });
            }

            // Check if book is available
            var isBookBorrowed = await _context.Borrowings
                .AnyAsync(b => b.BookId == borrowingDto.BookId && b.ReturnDate == null);

            if (isBookBorrowed)
            {
                return BadRequest(new { message = "Book is currently borrowed" });
            }

            var borrowing = new Borrowing
            {
                UserId = borrowingDto.UserId,
                BookId = borrowingDto.BookId,
                BorrowDate = DateTime.Now,
                DueDate = borrowingDto.DueDate ?? DateTime.Now.AddDays(14) // Default 14 days
            };

            _context.Borrowings.Add(borrowing);
            await _context.SaveChangesAsync();

            // Reload with navigation properties
            await _context.Entry(borrowing).Reference(b => b.User).LoadAsync();
            await _context.Entry(borrowing).Reference(b => b.Book).LoadAsync();

            var resultDto = new BorrowingDto
            {
                Id = borrowing.Id,
                UserId = borrowing.UserId,
                UserFullname = borrowing.User.Fullname,
                BookId = borrowing.BookId,
                BookTitle = borrowing.Book.Title,
                BorrowDate = borrowing.BorrowDate,
                ReturnDate = borrowing.ReturnDate,
                DueDate = borrowing.DueDate,
                IsOverdue = false
            };

            return CreatedAtAction(nameof(GetBorrowing), new { id = borrowing.Id }, resultDto);
        }

        // PUT: api/borrowings/5/return
        [HttpPut("{id}/return")]
        public async Task<IActionResult> ReturnBook(int id, BorrowingReturnDto returnDto)
        {
            var borrowing = await _context.Borrowings.FindAsync(id);

            if (borrowing == null)
            {
                return NotFound(new { message = "Borrowing not found" });
            }

            if (borrowing.ReturnDate != null)
            {
                return BadRequest(new { message = "Book already returned" });
            }

            borrowing.ReturnDate = returnDto.ReturnDate;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/borrowings/overdue
        [HttpGet("overdue")]
        public async Task<ActionResult<IEnumerable<BorrowingDto>>> GetOverdueBorrowings()
        {
            var borrowings = await _context.Borrowings
                .Include(b => b.User)
                .Include(b => b.Book)
                .Where(b => b.ReturnDate == null && b.DueDate < DateTime.Now)
                .OrderBy(b => b.DueDate)
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
                    IsOverdue = true
                })
                .ToListAsync();

            return Ok(borrowings);
        }

        // DELETE: api/borrowings/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBorrowing(int id)
        {
            var borrowing = await _context.Borrowings.FindAsync(id);

            if (borrowing == null)
            {
                return NotFound(new { message = "Borrowing not found" });
            }

            _context.Borrowings.Remove(borrowing);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
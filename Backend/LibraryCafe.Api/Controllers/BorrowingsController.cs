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
        private const decimal FinePerDay = 50m; // 50 AMD per overdue day

        public BorrowingsController(LibraryCafeDbContext context)
        {
            _context = context;
        }

        private static decimal CalculateFine(DateTime? dueDate, DateTime? returnDate)
        {
            if (dueDate == null) return 0;
            var compareDate = returnDate ?? DateTime.UtcNow;
            var overdueDays = (int)(compareDate - dueDate.Value).TotalDays;
            return overdueDays > 0 ? overdueDays * FinePerDay : 0;
        }

        private static BorrowingDto MapBorrowing(Borrowing b)
        {
            var now = DateTime.UtcNow;
            var fine = CalculateFine(b.DueDate, b.ReturnDate);
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
                IsOverdue = b.DueDate.HasValue && b.ReturnDate == null && b.DueDate < now,
                OverdueFine = fine
            };
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BorrowingDto>>> GetBorrowings(
            [FromQuery] bool? active = null)
        {
            var query = _context.Borrowings
                .Include(b => b.User)
                .Include(b => b.Book)
                .AsQueryable();

            if (active.HasValue)
                query = active.Value
                    ? query.Where(b => b.ReturnDate == null)
                    : query.Where(b => b.ReturnDate != null);

            var data = await query.OrderByDescending(b => b.BorrowDate).ToListAsync();
            return Ok(data.Select(MapBorrowing));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BorrowingDto>> GetBorrowing(int id)
        {
            var b = await _context.Borrowings
                .Include(b => b.User)
                .Include(b => b.Book)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (b == null) return NotFound(new { message = "Borrowing not found" });
            return Ok(MapBorrowing(b));
        }

        [HttpPost]
        public async Task<ActionResult<BorrowingDto>> CreateBorrowing(BorrowingCreateDto dto)
        {
            var user = await _context.Users.FindAsync(dto.UserId);
            if (user == null) return BadRequest(new { message = "User not found" });

            var book = await _context.Books
                .Include(b => b.Borrowings)
                .FirstOrDefaultAsync(b => b.Id == dto.BookId);
            if (book == null) return BadRequest(new { message = "Book not found" });

            var activeBorrowings = book.Borrowings.Count(br => br.ReturnDate == null);
            var totalCopies = book.TotalCount > 0 ? book.TotalCount : 1;
            if (activeBorrowings >= totalCopies)
                return BadRequest(new { message = "No copies available. Please join the queue." });

            DateTime dueDate;
            if (dto.DueDate.HasValue)
                dueDate = dto.DueDate.Value;
            else if (dto.DurationDays.HasValue && dto.DurationDays.Value > 0)
                dueDate = DateTime.UtcNow.AddDays(dto.DurationDays.Value);
            else
                dueDate = DateTime.UtcNow.AddDays(14);

            var borrowing = new Borrowing
            {
                UserId = dto.UserId,
                BookId = dto.BookId,
                BorrowDate = DateTime.UtcNow,
                DueDate = dueDate
            };

            _context.Borrowings.Add(borrowing);
            await _context.SaveChangesAsync();

            await _context.Entry(borrowing).Reference(b => b.User).LoadAsync();
            await _context.Entry(borrowing).Reference(b => b.Book).LoadAsync();

            return CreatedAtAction(nameof(GetBorrowing), new { id = borrowing.Id }, MapBorrowing(borrowing));
        }

        [HttpPut("{id}/return")]
        public async Task<ActionResult<BorrowingDto>> ReturnBook(int id, BorrowingReturnDto returnDto)
        {
            var borrowing = await _context.Borrowings
                .Include(b => b.User)
                .Include(b => b.Book)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (borrowing == null) return NotFound(new { message = "Borrowing not found" });
            if (borrowing.ReturnDate != null) return BadRequest(new { message = "Book already returned" });

            borrowing.ReturnDate = returnDto.ReturnDate;
            await _context.SaveChangesAsync();

            return Ok(MapBorrowing(borrowing));
        }

        [HttpGet("overdue")]
        public async Task<ActionResult<IEnumerable<BorrowingDto>>> GetOverdueBorrowings()
        {
            var now = DateTime.UtcNow;
            var all = await _context.Borrowings
                .Include(b => b.User)
                .Include(b => b.Book)
                .Where(b => b.ReturnDate == null && b.DueDate != null)
                .OrderBy(b => b.DueDate)
                .ToListAsync();

            var overdue = all.Where(b => b.DueDate!.Value < now).Select(MapBorrowing);
            return Ok(overdue);
        }

        [HttpGet("fines")]
        public async Task<ActionResult<object>> GetFinesSummary()
        {
            var now = DateTime.UtcNow;
            var overdues = await _context.Borrowings
                .Include(b => b.User)
                .Include(b => b.Book)
                .Where(b => b.ReturnDate == null && b.DueDate != null && b.DueDate < now)
                .ToListAsync();

            var result = overdues.Select(b => new
            {
                BorrowingId = b.Id,
                UserId = b.UserId,
                UserFullname = b.User?.Fullname,
                BookTitle = b.Book?.Title,
                DueDate = b.DueDate,
                OverdueDays = (int)(now - b.DueDate!.Value).TotalDays,
                Fine = CalculateFine(b.DueDate, null)
            });

            return Ok(new
            {
                TotalFineAmd = result.Sum(r => r.Fine),
                Items = result
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBorrowing(int id)
        {
            var borrowing = await _context.Borrowings.FindAsync(id);
            if (borrowing == null) return NotFound(new { message = "Borrowing not found" });

            _context.Borrowings.Remove(borrowing);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
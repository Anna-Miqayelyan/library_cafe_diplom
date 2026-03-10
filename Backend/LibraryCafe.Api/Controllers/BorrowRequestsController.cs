using LibraryCafe.Core.Entities;
using LibraryCafe.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryCafe.Api.Controllers
{
    // ── DTOs (inline for simplicity) ─────────────────────────────────────
    public class BorrowRequestCreateDto
    {
        public int UserId    { get; set; }
        public int BookId    { get; set; }
        public int DurationDays { get; set; } = 14;
    }

    public class BorrowRequestDto
    {
        public int    Id           { get; set; }
        public int    UserId       { get; set; }
        public string UserFullname { get; set; } = "";
        public int    BookId       { get; set; }
        public string BookTitle    { get; set; } = "";
        public string BookAuthor   { get; set; } = "";
        public DateTime RequestDate { get; set; }
        public string Status       { get; set; } = "Pending";
        public int    DurationDays { get; set; }
        public string? Notes       { get; set; }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class BorrowRequestsController : ControllerBase
    {
        private readonly LibraryCafeDbContext _ctx;
        public BorrowRequestsController(LibraryCafeDbContext ctx) => _ctx = ctx;

        private BorrowRequestDto Map(BorrowRequest r) => new()
        {
            Id           = r.Id,
            UserId       = r.UserId,
            UserFullname = r.User?.Fullname ?? "",
            BookId       = r.BookId,
            BookTitle    = r.Book?.Title    ?? "",
            BookAuthor   = r.Book?.Author   ?? "",
            RequestDate  = r.RequestDate,
            Status       = r.Status,
            DurationDays = r.DurationDays,
            Notes        = r.Notes
        };

        // GET all (librarian) — optionally filter by status
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? status = null)
        {
            var q = _ctx.BorrowRequests
                .Include(r => r.User).Include(r => r.Book).AsQueryable();
            if (!string.IsNullOrEmpty(status))
                q = q.Where(r => r.Status == status);
            var list = await q.OrderByDescending(r => r.RequestDate).ToListAsync();
            return Ok(list.Select(Map));
        }

        // GET requests for a specific user (student polls this)
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetForUser(int userId)
        {
            var list = await _ctx.BorrowRequests
                .Include(r => r.Book)
                .Where(r => r.UserId == userId)
                .OrderByDescending(r => r.RequestDate)
                .ToListAsync();
            return Ok(list.Select(Map));
        }

        // POST — student submits a borrow request
        [HttpPost]
        public async Task<IActionResult> Create(BorrowRequestCreateDto dto)
        {
            var user = await _ctx.Users.FindAsync(dto.UserId);
            if (user == null) return BadRequest(new { message = "User not found" });

            var book = await _ctx.Books.Include(b => b.Borrowings)
                .FirstOrDefaultAsync(b => b.Id == dto.BookId);
            if (book == null) return BadRequest(new { message = "Book not found" });

            // Check if user already has a pending/approved request for this book
            var existing = await _ctx.BorrowRequests.FirstOrDefaultAsync(r =>
                r.UserId == dto.UserId && r.BookId == dto.BookId &&
                (r.Status == "Pending" || r.Status == "Approved"));
            if (existing != null)
                return BadRequest(new { message = "You already have an active request for this book." });

            // Check availability
            var activeBorrowings = book.Borrowings.Count(b => b.ReturnDate == null);
            if (activeBorrowings >= (book.TotalCount > 0 ? book.TotalCount : 1))
                return BadRequest(new { message = "No copies available right now. Try joining the queue." });

            var req = new BorrowRequest
            {
                UserId      = dto.UserId,
                BookId      = dto.BookId,
                DurationDays = dto.DurationDays > 0 ? dto.DurationDays : 14,
                RequestDate = DateTime.UtcNow,
                Status      = "Pending"
            };
            _ctx.BorrowRequests.Add(req);
            await _ctx.SaveChangesAsync();

            await _ctx.Entry(req).Reference(r => r.User).LoadAsync();
            await _ctx.Entry(req).Reference(r => r.Book).LoadAsync();
            return Ok(Map(req));
        }

        // PUT /{id}/approve — librarian approves
        [HttpPut("{id}/approve")]
        public async Task<IActionResult> Approve(int id)
        {
            var req = await _ctx.BorrowRequests.Include(r => r.User).Include(r => r.Book)
                .FirstOrDefaultAsync(r => r.Id == id);
            if (req == null) return NotFound(new { message = "Request not found" });
            if (req.Status != "Pending") return BadRequest(new { message = "Request is not pending" });

            req.Status = "Approved";
            await _ctx.SaveChangesAsync();
            return Ok(Map(req));
        }

        // PUT /{id}/reject — librarian rejects
        [HttpPut("{id}/reject")]
        public async Task<IActionResult> Reject(int id, [FromBody] string? reason = null)
        {
            var req = await _ctx.BorrowRequests.Include(r => r.User).Include(r => r.Book)
                .FirstOrDefaultAsync(r => r.Id == id);
            if (req == null) return NotFound(new { message = "Request not found" });
            if (req.Status != "Pending") return BadRequest(new { message = "Request is not pending" });

            req.Status = "Rejected";
            req.Notes  = reason;
            await _ctx.SaveChangesAsync();
            return Ok(Map(req));
        }

        // PUT /{id}/taken — librarian physically hands book to student
        // This creates the actual Borrowing record and marks request as Taken
        [HttpPut("{id}/taken")]
        public async Task<IActionResult> MarkTaken(int id)
        {
            var req = await _ctx.BorrowRequests.Include(r => r.Book).ThenInclude(b => b.Borrowings)
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.Id == id);
            if (req == null) return NotFound(new { message = "Request not found" });
            if (req.Status != "Approved") return BadRequest(new { message = "Request must be Approved before marking as taken" });

            // Create the real borrowing record
            var borrowing = new Borrowing
            {
                UserId     = req.UserId,
                BookId     = req.BookId,
                BorrowDate = DateTime.UtcNow,
                DueDate    = DateTime.UtcNow.AddDays(req.DurationDays)
            };
            _ctx.Borrowings.Add(borrowing);

            req.Status = "Taken";
            await _ctx.SaveChangesAsync();

            return Ok(new { message = "Book marked as borrowed", borrowingId = borrowing.Id });
        }

        // DELETE — cancel/remove a request (student or librarian)
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var req = await _ctx.BorrowRequests.FindAsync(id);
            if (req == null) return NotFound();
            _ctx.BorrowRequests.Remove(req);
            await _ctx.SaveChangesAsync();
            return NoContent();
        }
    }
}

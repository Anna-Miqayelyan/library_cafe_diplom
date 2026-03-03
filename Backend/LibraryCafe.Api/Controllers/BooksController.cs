using LibraryCafe.Api.DTOs;
using LibraryCafe.Core.Entities;
using LibraryCafe.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryCafe.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BooksController : ControllerBase
    {
        private readonly LibraryCafeDbContext _context;

        public BooksController(LibraryCafeDbContext context)
        {
            _context = context;
        }

        // ?? helpers ????????????????????????????????????????????
        private static BookDto MapBook(Book b)
        {
            var activeBorrowings = b.Borrowings?.Count(br => br.ReturnDate == null) ?? 0;
            var total = b.TotalCount > 0 ? b.TotalCount : 1;
            var available = Math.Max(0, total - activeBorrowings);
            return new BookDto
            {
                Id = b.Id,
                Title = b.Title,
                Author = b.Author,
                Category = b.Category,
                ISBN = b.ISBN,
                Bookshelf = b.Bookshelf,
                IsAvailable = available > 0,
                TotalCount = total,
                BorrowedCount = activeBorrowings,
                AvailableCount = available,
                ImagePath = b.ImagePath,
                PdfUrl = b.PdfUrl,
                AverageRating = b.Reviews != null && b.Reviews.Any()
                    ? b.Reviews.Average(r => (double)r.Rating)
                    : null,
                ReviewCount = b.Reviews?.Count ?? 0
            };
        }

        // GET: api/books
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookDto>>> GetBooks(
            [FromQuery] string? category = null,
            [FromQuery] string? search = null)
        {
            var query = _context.Books
                .Include(b => b.Borrowings)
                .Include(b => b.Reviews)
                .AsQueryable();

            if (!string.IsNullOrEmpty(category))
                query = query.Where(b => b.Category.ToLower() == category.ToLower());

            if (!string.IsNullOrEmpty(search))
                query = query.Where(b =>
                    b.Title.Contains(search) ||
                    b.Author.Contains(search) ||
                    b.ISBN.Contains(search));

            var books = await query.ToListAsync();
            return Ok(books.Select(MapBook));
        }

        // GET: api/books/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BookDto>> GetBook(int id)
        {
            var book = await _context.Books
                .Include(b => b.Borrowings)
                .Include(b => b.Reviews)
                    .ThenInclude(r => r.User)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (book == null)
                return NotFound(new { message = "Book not found" });

            return Ok(MapBook(book));
        }

        // POST: api/books
        [HttpPost]
        public async Task<ActionResult<BookDto>> CreateBook(BookCreateDto bookDto)
        {
            if (await _context.Books.AnyAsync(b => b.ISBN == bookDto.ISBN))
                return BadRequest(new { message = "A book with this ISBN already exists" });

            var book = new Book
            {
                Title = bookDto.Title,
                Author = bookDto.Author,
                Category = bookDto.Category,
                ISBN = bookDto.ISBN,
                Bookshelf = bookDto.Bookshelf,
                TotalCount = bookDto.TotalCount > 0 ? bookDto.TotalCount : 1,
                ImagePath = bookDto.ImagePath,
                PdfUrl = bookDto.PdfUrl
            };

            _context.Books.Add(book);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBook), new { id = book.Id }, MapBook(book));
        }

        // PUT: api/books/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBook(int id, BookUpdateDto bookDto)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
                return NotFound(new { message = "Book not found" });

            if (bookDto.Title != null) book.Title = bookDto.Title;
            if (bookDto.Author != null) book.Author = bookDto.Author;
            if (bookDto.Category != null) book.Category = bookDto.Category;
            if (bookDto.ISBN != null) book.ISBN = bookDto.ISBN;
            if (bookDto.Bookshelf != null) book.Bookshelf = bookDto.Bookshelf;
            if (bookDto.TotalCount.HasValue && bookDto.TotalCount > 0)
                book.TotalCount = bookDto.TotalCount.Value;
            if (bookDto.ImagePath != null) book.ImagePath = bookDto.ImagePath;
            if (bookDto.PdfUrl != null) book.PdfUrl = bookDto.PdfUrl;

            try { await _context.SaveChangesAsync(); }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.Books.AnyAsync(b => b.Id == id)) return NotFound();
                throw;
            }

            return NoContent();
        }

        // DELETE: api/books/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
                return NotFound(new { message = "Book not found" });

            var hasActive = await _context.Borrowings
                .AnyAsync(b => b.BookId == id && b.ReturnDate == null);
            if (hasActive)
                return BadRequest(new { message = "Cannot delete book with active borrowings" });

            _context.Books.Remove(book);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // GET: api/books/categories
        [HttpGet("categories")]
        public async Task<ActionResult<IEnumerable<string>>> GetCategories()
        {
            var cats = await _context.Books
                .Select(b => b.Category)
                .Distinct()
                .OrderBy(c => c)
                .ToListAsync();
            return Ok(cats);
        }

        // GET: api/books/5/reviews  - convenience endpoint
        [HttpGet("{id}/reviews")]
        public async Task<ActionResult<IEnumerable<BookReviewDto>>> GetBookReviews(int id)
        {
            var reviews = await _context.BookReviews
                .Include(r => r.User)
                .Where(r => r.BookId == id)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new BookReviewDto
                {
                    Id = r.Id,
                    UserId = r.UserId,
                    UserFullname = r.User.Fullname,
                    BookId = r.BookId,
                    BookTitle = r.Book.Title,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    CreatedAt = r.CreatedAt
                })
                .ToListAsync();

            return Ok(reviews);
        }
    }
}
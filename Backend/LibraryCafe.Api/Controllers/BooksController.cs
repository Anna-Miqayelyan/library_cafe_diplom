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

        // GET: api/books
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookDto>>> GetBooks(
            [FromQuery] string? category = null,
            [FromQuery] string? search = null)
        {
            var query = _context.Books
                .Include(b => b.Borrowings)
                .AsQueryable();

            if (!string.IsNullOrEmpty(category))
            {
                query = query.Where(b => b.Category.ToLower() == category.ToLower());
            }

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(b =>
                    b.Title.Contains(search) ||
                    b.Author.Contains(search) ||
                    b.ISBN.Contains(search));
            }

            var books = await query
                .Select(b => new BookDto
                {
                    Id = b.Id,
                    Title = b.Title,
                    Author = b.Author,
                    Category = b.Category,
                    ISBN = b.ISBN,
                    Bookshelf = b.Bookshelf,
                    IsAvailable = !b.Borrowings.Any(br => br.ReturnDate == null)
                })
                .ToListAsync();

            return Ok(books);
        }

        // GET: api/books/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BookDto>> GetBook(int id)
        {
            var book = await _context.Books
                .Include(b => b.Borrowings)
                .Include(b => b.Reviews)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (book == null)
            {
                return NotFound(new { message = "Book not found" });
            }

            var bookDto = new BookDto
            {
                Id = book.Id,
                Title = book.Title,
                Author = book.Author,
                Category = book.Category,
                ISBN = book.ISBN,
                Bookshelf = book.Bookshelf,
                IsAvailable = !book.Borrowings.Any(br => br.ReturnDate == null)
            };

            return Ok(bookDto);
        }

        // POST: api/books
        [HttpPost]
        public async Task<ActionResult<BookDto>> CreateBook(BookCreateDto bookDto)
        {
            // Check if ISBN already exists
            if (await _context.Books.AnyAsync(b => b.ISBN == bookDto.ISBN))
            {
                return BadRequest(new { message = "A book with this ISBN already exists" });
            }

            var book = new Book
            {
                Title = bookDto.Title,
                Author = bookDto.Author,
                Category = bookDto.Category,
                ISBN = bookDto.ISBN,
                Bookshelf = bookDto.Bookshelf
            };

            _context.Books.Add(book);
            await _context.SaveChangesAsync();

            var resultDto = new BookDto
            {
                Id = book.Id,
                Title = book.Title,
                Author = book.Author,
                Category = book.Category,
                ISBN = book.ISBN,
                Bookshelf = book.Bookshelf,
                IsAvailable = true
            };

            return CreatedAtAction(nameof(GetBook), new { id = book.Id }, resultDto);
        }

        // PUT: api/books/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBook(int id, BookUpdateDto bookDto)
        {
            var book = await _context.Books.FindAsync(id);

            if (book == null)
            {
                return NotFound(new { message = "Book not found" });
            }

            if (bookDto.Title != null) book.Title = bookDto.Title;
            if (bookDto.Author != null) book.Author = bookDto.Author;
            if (bookDto.Category != null) book.Category = bookDto.Category;
            if (bookDto.ISBN != null) book.ISBN = bookDto.ISBN;
            if (bookDto.Bookshelf != null) book.Bookshelf = bookDto.Bookshelf;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.Books.AnyAsync(b => b.Id == id))
                {
                    return NotFound();
                }
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
            {
                return NotFound(new { message = "Book not found" });
            }

            // Check if book has active borrowings
            var hasActiveBorrowing = await _context.Borrowings
                .AnyAsync(b => b.BookId == id && b.ReturnDate == null);

            if (hasActiveBorrowing)
            {
                return BadRequest(new { message = "Cannot delete book with active borrowings" });
            }

            _context.Books.Remove(book);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/books/categories
        [HttpGet("categories")]
        public async Task<ActionResult<IEnumerable<string>>> GetCategories()
        {
            var categories = await _context.Books
                .Select(b => b.Category)
                .Distinct()
                .OrderBy(c => c)
                .ToListAsync();

            return Ok(categories);
        }
    }
}
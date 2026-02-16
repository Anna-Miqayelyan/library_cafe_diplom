using LibraryCafe.Api.DTOs;
using LibraryCafe.Core.Entities;
using LibraryCafe.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryCafe.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewsController : ControllerBase
    {
        private readonly LibraryCafeDbContext _context;

        public ReviewsController(LibraryCafeDbContext context)
        {
            _context = context;
        }

        // ============== BOOK REVIEWS ==============

        // GET: api/reviews/books
        [HttpGet("books")]
        public async Task<ActionResult<IEnumerable<BookReviewDto>>> GetBookReviews(
            [FromQuery] int? bookId = null)
        {
            var query = _context.BookReviews
                .Include(r => r.User)
                .Include(r => r.Book)
                .AsQueryable();

            if (bookId.HasValue)
            {
                query = query.Where(r => r.BookId == bookId.Value);
            }

            var reviews = await query
                .Select(r => new BookReviewDto
                {
                    Id = r.Id,
                    UserId = r.UserId,
                    UserFullname = r.User.Fullname,
                    BookId = r.BookId,
                    BookTitle = r.Book.Title,
                    Rating = r.Rating,
                    Comment = r.Comment
                })
                .ToListAsync();

            return Ok(reviews);
        }

        // GET: api/reviews/books/5
        [HttpGet("books/{id}")]
        public async Task<ActionResult<BookReviewDto>> GetBookReview(int id)
        {
            var review = await _context.BookReviews
                .Include(r => r.User)
                .Include(r => r.Book)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (review == null)
            {
                return NotFound(new { message = "Review not found" });
            }

            var reviewDto = new BookReviewDto
            {
                Id = review.Id,
                UserId = review.UserId,
                UserFullname = review.User.Fullname,
                BookId = review.BookId,
                BookTitle = review.Book.Title,
                Rating = review.Rating,
                Comment = review.Comment
            };

            return Ok(reviewDto);
        }

        // POST: api/reviews/books
        [HttpPost("books")]
        public async Task<ActionResult<BookReviewDto>> CreateBookReview(BookReviewCreateDto reviewDto)
        {
            // Validate user
            var user = await _context.Users.FindAsync(reviewDto.UserId);
            if (user == null)
            {
                return BadRequest(new { message = "User not found" });
            }

            // Validate book
            var book = await _context.Books.FindAsync(reviewDto.BookId);
            if (book == null)
            {
                return BadRequest(new { message = "Book not found" });
            }

            // Validate rating
            if (reviewDto.Rating < 1 || reviewDto.Rating > 5)
            {
                return BadRequest(new { message = "Rating must be between 1 and 5" });
            }

            // Check if user already reviewed this book
            var existingReview = await _context.BookReviews
                .FirstOrDefaultAsync(r => r.UserId == reviewDto.UserId && r.BookId == reviewDto.BookId);

            if (existingReview != null)
            {
                return BadRequest(new { message = "You have already reviewed this book" });
            }

            var review = new BookReview
            {
                UserId = reviewDto.UserId,
                BookId = reviewDto.BookId,
                Rating = reviewDto.Rating,
                Comment = reviewDto.Comment
            };

            _context.BookReviews.Add(review);
            await _context.SaveChangesAsync();

            // Reload with navigation properties
            await _context.Entry(review).Reference(r => r.User).LoadAsync();
            await _context.Entry(review).Reference(r => r.Book).LoadAsync();

            var resultDto = new BookReviewDto
            {
                Id = review.Id,
                UserId = review.UserId,
                UserFullname = review.User.Fullname,
                BookId = review.BookId,
                BookTitle = review.Book.Title,
                Rating = review.Rating,
                Comment = review.Comment
            };

            return CreatedAtAction(nameof(GetBookReview), new { id = review.Id }, resultDto);
        }

        // DELETE: api/reviews/books/5
        [HttpDelete("books/{id}")]
        public async Task<IActionResult> DeleteBookReview(int id)
        {
            var review = await _context.BookReviews.FindAsync(id);

            if (review == null)
            {
                return NotFound(new { message = "Review not found" });
            }

            _context.BookReviews.Remove(review);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // ============== CAFE REVIEWS ==============

        // GET: api/reviews/cafe
        [HttpGet("cafe")]
        public async Task<ActionResult<IEnumerable<CafeReviewDto>>> GetCafeReviews(
            [FromQuery] int? itemId = null)
        {
            var query = _context.CafeReviews
                .Include(r => r.User)
                .Include(r => r.MenuItem)
                .AsQueryable();

            if (itemId.HasValue)
            {
                query = query.Where(r => r.ItemId == itemId.Value);
            }

            var reviews = await query
                .Select(r => new CafeReviewDto
                {
                    Id = r.Id,
                    UserId = r.UserId,
                    UserFullname = r.User.Fullname,
                    ItemId = r.ItemId,
                    ItemName = r.MenuItem.ItemName,
                    Rating = r.Rating,
                    Comment = r.Comment
                })
                .ToListAsync();

            return Ok(reviews);
        }

        // GET: api/reviews/cafe/5
        [HttpGet("cafe/{id}")]
        public async Task<ActionResult<CafeReviewDto>> GetCafeReview(int id)
        {
            var review = await _context.CafeReviews
                .Include(r => r.User)
                .Include(r => r.MenuItem)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (review == null)
            {
                return NotFound(new { message = "Review not found" });
            }

            var reviewDto = new CafeReviewDto
            {
                Id = review.Id,
                UserId = review.UserId,
                UserFullname = review.User.Fullname,
                ItemId = review.ItemId,
                ItemName = review.MenuItem.ItemName,
                Rating = review.Rating,
                Comment = review.Comment
            };

            return Ok(reviewDto);
        }

        // POST: api/reviews/cafe
        [HttpPost("cafe")]
        public async Task<ActionResult<CafeReviewDto>> CreateCafeReview(CafeReviewCreateDto reviewDto)
        {
            // Validate user
            var user = await _context.Users.FindAsync(reviewDto.UserId);
            if (user == null)
            {
                return BadRequest(new { message = "User not found" });
            }

            // Validate menu item
            var menuItem = await _context.MenuItems.FindAsync(reviewDto.ItemId);
            if (menuItem == null)
            {
                return BadRequest(new { message = "Menu item not found" });
            }

            // Validate rating
            if (reviewDto.Rating < 1 || reviewDto.Rating > 5)
            {
                return BadRequest(new { message = "Rating must be between 1 and 5" });
            }

            // Check if user already reviewed this item
            var existingReview = await _context.CafeReviews
                .FirstOrDefaultAsync(r => r.UserId == reviewDto.UserId && r.ItemId == reviewDto.ItemId);

            if (existingReview != null)
            {
                return BadRequest(new { message = "You have already reviewed this item" });
            }

            var review = new CafeReview
            {
                UserId = reviewDto.UserId,
                ItemId = reviewDto.ItemId,
                Rating = reviewDto.Rating,
                Comment = reviewDto.Comment
            };

            _context.CafeReviews.Add(review);
            await _context.SaveChangesAsync();

            // Reload with navigation properties
            await _context.Entry(review).Reference(r => r.User).LoadAsync();
            await _context.Entry(review).Reference(r => r.MenuItem).LoadAsync();

            var resultDto = new CafeReviewDto
            {
                Id = review.Id,
                UserId = review.UserId,
                UserFullname = review.User.Fullname,
                ItemId = review.ItemId,
                ItemName = review.MenuItem.ItemName,
                Rating = review.Rating,
                Comment = review.Comment
            };

            return CreatedAtAction(nameof(GetCafeReview), new { id = review.Id }, resultDto);
        }

        // DELETE: api/reviews/cafe/5
        [HttpDelete("cafe/{id}")]
        public async Task<IActionResult> DeleteCafeReview(int id)
        {
            var review = await _context.CafeReviews.FindAsync(id);

            if (review == null)
            {
                return NotFound(new { message = "Review not found" });
            }

            _context.CafeReviews.Remove(review);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
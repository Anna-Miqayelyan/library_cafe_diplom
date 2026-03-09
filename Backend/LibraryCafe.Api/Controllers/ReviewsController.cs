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


        [HttpGet("books")]
        public async Task<ActionResult<IEnumerable<BookReviewDto>>> GetBookReviews(
            [FromQuery] int? bookId = null)
        {
            var query = _context.BookReviews
                .Include(r => r.User)
                .Include(r => r.Book)
                .AsQueryable();

            if (bookId.HasValue)
                query = query.Where(r => r.BookId == bookId.Value);

            var reviews = await query
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

        [HttpGet("books/{id}")]
        public async Task<ActionResult<BookReviewDto>> GetBookReview(int id)
        {
            var r = await _context.BookReviews
                .Include(r => r.User)
                .Include(r => r.Book)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (r == null) return NotFound(new { message = "Review not found" });

            return Ok(new BookReviewDto
            {
                Id = r.Id,
                UserId = r.UserId,
                UserFullname = r.User.Fullname,
                BookId = r.BookId,
                BookTitle = r.Book.Title,
                Rating = r.Rating,
                Comment = r.Comment,
                CreatedAt = r.CreatedAt
            });
        }

        [HttpPost("books")]
        public async Task<ActionResult<BookReviewDto>> CreateBookReview(BookReviewCreateDto dto)
        {
            var user = await _context.Users.FindAsync(dto.UserId);
            if (user == null) return BadRequest(new { message = "User not found" });

            var book = await _context.Books.FindAsync(dto.BookId);
            if (book == null) return BadRequest(new { message = "Book not found" });

            if (dto.Rating < 1 || dto.Rating > 5)
                return BadRequest(new { message = "Rating must be between 1 and 5" });

            // Upsert: update existing review if user already reviewed this book
            var existing = await _context.BookReviews
                .FirstOrDefaultAsync(r => r.UserId == dto.UserId && r.BookId == dto.BookId);

            if (existing != null)
            {
                existing.Rating = dto.Rating;
                existing.Comment = dto.Comment;
                existing.CreatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                return Ok(new BookReviewDto
                {
                    Id = existing.Id,
                    UserId = existing.UserId,
                    UserFullname = user.Fullname,
                    BookId = existing.BookId,
                    BookTitle = book.Title,
                    Rating = existing.Rating,
                    Comment = existing.Comment,
                    CreatedAt = existing.CreatedAt
                });
            }

            var review = new BookReview
            {
                UserId = dto.UserId,
                BookId = dto.BookId,
                Rating = dto.Rating,
                Comment = dto.Comment,
                CreatedAt = DateTime.UtcNow
            };

            _context.BookReviews.Add(review);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBookReview), new { id = review.Id }, new BookReviewDto
            {
                Id = review.Id,
                UserId = review.UserId,
                UserFullname = user.Fullname,
                BookId = review.BookId,
                BookTitle = book.Title,
                Rating = review.Rating,
                Comment = review.Comment,
                CreatedAt = review.CreatedAt
            });
        }

        [HttpDelete("books/{id}")]
        public async Task<IActionResult> DeleteBookReview(int id)
        {
            var review = await _context.BookReviews.FindAsync(id);
            if (review == null) return NotFound(new { message = "Review not found" });

            _context.BookReviews.Remove(review);
            await _context.SaveChangesAsync();
            return NoContent();
        }

   
        [HttpGet("cafe")]
        public async Task<ActionResult<IEnumerable<CafeReviewDto>>> GetCafeReviews(
            [FromQuery] int? itemId = null)
        {
            var query = _context.CafeReviews
                .Include(r => r.User)
                .Include(r => r.MenuItem)
                .AsQueryable();

            if (itemId.HasValue)
                query = query.Where(r => r.ItemId == itemId.Value);

            var reviews = await query
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new CafeReviewDto
                {
                    Id = r.Id,
                    UserId = r.UserId,
                    UserFullname = r.User.Fullname,
                    ItemId = r.ItemId,
                    ItemName = r.MenuItem.ItemName,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    CreatedAt = r.CreatedAt
                })
                .ToListAsync();

            return Ok(reviews);
        }

        [HttpGet("cafe/{id}")]
        public async Task<ActionResult<CafeReviewDto>> GetCafeReview(int id)
        {
            var r = await _context.CafeReviews
                .Include(r => r.User)
                .Include(r => r.MenuItem)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (r == null) return NotFound(new { message = "Review not found" });

            return Ok(new CafeReviewDto
            {
                Id = r.Id,
                UserId = r.UserId,
                UserFullname = r.User.Fullname,
                ItemId = r.ItemId,
                ItemName = r.MenuItem.ItemName,
                Rating = r.Rating,
                Comment = r.Comment,
                CreatedAt = r.CreatedAt
            });
        }

        [HttpPost("cafe")]
        public async Task<ActionResult<CafeReviewDto>> CreateCafeReview(CafeReviewCreateDto dto)
        {
            var user = await _context.Users.FindAsync(dto.UserId);
            if (user == null) return BadRequest(new { message = "User not found" });

            var menuItem = await _context.MenuItems.FindAsync(dto.ItemId);
            if (menuItem == null) return BadRequest(new { message = "Menu item not found" });

            if (dto.Rating < 1 || dto.Rating > 5)
                return BadRequest(new { message = "Rating must be between 1 and 5" });

            var existing = await _context.CafeReviews
                .FirstOrDefaultAsync(r => r.UserId == dto.UserId && r.ItemId == dto.ItemId);

            if (existing != null)
            {
                existing.Rating = dto.Rating;
                existing.Comment = dto.Comment;
                existing.CreatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                return Ok(new CafeReviewDto
                {
                    Id = existing.Id,
                    UserId = existing.UserId,
                    UserFullname = user.Fullname,
                    ItemId = existing.ItemId,
                    ItemName = menuItem.ItemName,
                    Rating = existing.Rating,
                    Comment = existing.Comment,
                    CreatedAt = existing.CreatedAt
                });
            }

            var review = new CafeReview
            {
                UserId = dto.UserId,
                ItemId = dto.ItemId,
                Rating = dto.Rating,
                Comment = dto.Comment,
                CreatedAt = DateTime.UtcNow
            };

            _context.CafeReviews.Add(review);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCafeReview), new { id = review.Id }, new CafeReviewDto
            {
                Id = review.Id,
                UserId = review.UserId,
                UserFullname = user.Fullname,
                ItemId = review.ItemId,
                ItemName = menuItem.ItemName,
                Rating = review.Rating,
                Comment = review.Comment,
                CreatedAt = review.CreatedAt
            });
        }

        [HttpDelete("cafe/{id}")]
        public async Task<IActionResult> DeleteCafeReview(int id)
        {
            var review = await _context.CafeReviews.FindAsync(id);
            if (review == null) return NotFound(new { message = "Review not found" });

            _context.CafeReviews.Remove(review);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
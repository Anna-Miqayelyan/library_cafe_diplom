using LibraryCafe.Api.DTOs;
using LibraryCafe.Api.Services;
using LibraryCafe.Core.Entities;
using LibraryCafe.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryCafe.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MenuItemsController : ControllerBase
    {
        private readonly LibraryCafeDbContext _context;
        private readonly CloudinaryService _cloudinary;

        public MenuItemsController(LibraryCafeDbContext context, CloudinaryService cloudinary)
        {
            _context = context;
            _cloudinary = cloudinary;
        }

        // GET: api/menuitems
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MenuItemDto>>> GetMenuItems(
            [FromQuery] string? category = null)
        {
            var query = _context.MenuItems.Include(m => m.Reviews).AsQueryable();
            if (!string.IsNullOrEmpty(category))
                query = query.Where(m => m.Category.ToLower() == category.ToLower());

            var items = await query.Select(m => new MenuItemDto
            {
                Id = m.Id,
                ItemName = m.ItemName,
                Category = m.Category,
                Price = m.Price,
                ImageUrl = m.ImageUrl,
                AverageRating = m.Reviews.Any() ? m.Reviews.Average(r => r.Rating) : null
            }).ToListAsync();

            return Ok(items);
        }

        // GET: api/menuitems/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MenuItemDto>> GetMenuItem(int id)
        {
            var m = await _context.MenuItems.Include(m => m.Reviews).FirstOrDefaultAsync(m => m.Id == id);
            if (m == null) return NotFound(new { message = "Menu item not found" });
            return Ok(new MenuItemDto
            {
                Id = m.Id,
                ItemName = m.ItemName,
                Category = m.Category,
                Price = m.Price,
                ImageUrl = m.ImageUrl,
                AverageRating = m.Reviews.Any() ? m.Reviews.Average(r => r.Rating) : null
            });
        }

        // ── POST: api/menuitems ───────────────────────────────────────────────────
        // Now accepts multipart/form-data with an optional ImageFile.
        // Falls back to JSON body (imageUrl string) if no file is provided.
        [HttpPost]
        [Consumes("multipart/form-data")]
        [RequestSizeLimit(10485760)] // 10 MB
        public async Task<ActionResult<MenuItemDto>> CreateMenuItem([FromForm] MenuItemUploadForm form)
        {
            string? imageUrl = null;

            // If a file was uploaded → send to Cloudinary
            if (form.ImageFile != null && form.ImageFile.Length > 0)
                imageUrl = await _cloudinary.UploadImageAsync(form.ImageFile, "cafe/images");

            var item = new MenuItem
            {
                ItemName = form.ItemName,
                Category = form.Category,
                Price = form.Price,
                ImageUrl = imageUrl
            };

            _context.MenuItems.Add(item);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMenuItem), new { id = item.Id },
                new MenuItemDto
                {
                    Id = item.Id,
                    ItemName = item.ItemName,
                    Category = item.Category,
                    Price = item.Price,
                    ImageUrl = item.ImageUrl
                });
        }

        // ── PUT: api/menuitems/5 ──────────────────────────────────────────────────
        [HttpPut("{id}")]
        [Consumes("multipart/form-data")]
        [RequestSizeLimit(10485760)]
        public async Task<IActionResult> UpdateMenuItem(int id, [FromForm] MenuItemUploadForm form)
        {
            var item = await _context.MenuItems.FindAsync(id);
            if (item == null) return NotFound(new { message = "Menu item not found" });

            if (form.ItemName != null) item.ItemName = form.ItemName;
            if (form.Category != null) item.Category = form.Category;
            if (form.Price > 0) item.Price = form.Price;

            // Only upload a new image if one was provided; otherwise keep the existing one
            if (form.ImageFile != null && form.ImageFile.Length > 0)
                item.ImageUrl = await _cloudinary.UploadImageAsync(form.ImageFile, "cafe/images");

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/menuitems/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMenuItem(int id)
        {
            var item = await _context.MenuItems.FindAsync(id);
            if (item == null) return NotFound(new { message = "Menu item not found" });

            var hasOrders = await _context.CafeOrderItems.AnyAsync(oi => oi.ItemId == id);
            if (hasOrders)
                return BadRequest(new { message = "Cannot delete: this item has existing orders. Consider renaming it instead." });

            _context.MenuItems.Remove(item);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // GET: api/menuitems/categories
        [HttpGet("categories")]
        public async Task<ActionResult<IEnumerable<string>>> GetCategories()
        {
            var cats = await _context.MenuItems.Select(m => m.Category).Distinct().OrderBy(c => c).ToListAsync();
            return Ok(cats);
        }
    }

    public class MenuItemUploadForm
    {
        public string ItemName { get; set; } = "";
        public string Category { get; set; } = "Hot Drinks";
        public decimal Price { get; set; }
        public IFormFile? ImageFile { get; set; }
    }
}
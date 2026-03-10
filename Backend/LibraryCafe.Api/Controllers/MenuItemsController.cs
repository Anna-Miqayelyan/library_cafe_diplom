using LibraryCafe.Api.DTOs;
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

        public MenuItemsController(LibraryCafeDbContext context)
        {
            _context = context;
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

        // POST: api/menuitems
        [HttpPost]
        public async Task<ActionResult<MenuItemDto>> CreateMenuItem(MenuItemCreateDto dto)
        {
            if (dto.ImageUrl != null && dto.ImageUrl.Length > 7_000_000)
                return BadRequest(new { message = "Image too large. Please use an image under 5 MB." });

            var item = new MenuItem
            {
                ItemName = dto.ItemName,
                Category = dto.Category,
                Price = dto.Price,
                ImageUrl = dto.ImageUrl
            };
            _context.MenuItems.Add(item);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMenuItem), new { id = item.Id },
                new MenuItemDto { Id = item.Id, ItemName = item.ItemName, Category = item.Category, Price = item.Price, ImageUrl = item.ImageUrl });
        }

        // PUT: api/menuitems/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMenuItem(int id, MenuItemUpdateDto dto)
        {
            var item = await _context.MenuItems.FindAsync(id);
            if (item == null) return NotFound(new { message = "Menu item not found" });

            if (dto.ImageUrl != null && dto.ImageUrl.Length > 7_000_000)
                return BadRequest(new { message = "Image too large. Please use an image under 5 MB." });

            if (dto.ItemName != null) item.ItemName = dto.ItemName;
            if (dto.Category != null) item.Category = dto.Category;
            if (dto.Price.HasValue) item.Price = dto.Price.Value;
            if (dto.ImageUrl != null) item.ImageUrl = dto.ImageUrl;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/menuitems/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMenuItem(int id)
        {
            var item = await _context.MenuItems.FindAsync(id);
            if (item == null) return NotFound(new { message = "Menu item not found" });
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
}
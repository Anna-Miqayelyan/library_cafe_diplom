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
            var query = _context.MenuItems
                .Include(m => m.Reviews)
                .AsQueryable();

            if (!string.IsNullOrEmpty(category))
            {
                query = query.Where(m => m.Category.ToLower() == category.ToLower());
            }

            var menuItems = await query
                .Select(m => new MenuItemDto
                {
                    Id = m.Id,
                    ItemName = m.ItemName,
                    Category = m.Category,
                    Price = m.Price,
                    AverageRating = m.Reviews.Any() ? m.Reviews.Average(r => r.Rating) : null
                })
                .ToListAsync();

            return Ok(menuItems);
        }

        // GET: api/menuitems/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MenuItemDto>> GetMenuItem(int id)
        {
            var menuItem = await _context.MenuItems
                .Include(m => m.Reviews)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (menuItem == null)
            {
                return NotFound(new { message = "Menu item not found" });
            }

            var menuItemDto = new MenuItemDto
            {
                Id = menuItem.Id,
                ItemName = menuItem.ItemName,
                Category = menuItem.Category,
                Price = menuItem.Price,
                AverageRating = menuItem.Reviews.Any() ? menuItem.Reviews.Average(r => r.Rating) : null
            };

            return Ok(menuItemDto);
        }

        // POST: api/menuitems
        [HttpPost]
        public async Task<ActionResult<MenuItemDto>> CreateMenuItem(MenuItemCreateDto menuItemDto)
        {
            var menuItem = new MenuItem
            {
                ItemName = menuItemDto.ItemName,
                Category = menuItemDto.Category,
                Price = menuItemDto.Price
            };

            _context.MenuItems.Add(menuItem);
            await _context.SaveChangesAsync();

            var resultDto = new MenuItemDto
            {
                Id = menuItem.Id,
                ItemName = menuItem.ItemName,
                Category = menuItem.Category,
                Price = menuItem.Price,
                AverageRating = null
            };

            return CreatedAtAction(nameof(GetMenuItem), new { id = menuItem.Id }, resultDto);
        }

        // PUT: api/menuitems/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMenuItem(int id, MenuItemUpdateDto menuItemDto)
        {
            var menuItem = await _context.MenuItems.FindAsync(id);

            if (menuItem == null)
            {
                return NotFound(new { message = "Menu item not found" });
            }

            if (menuItemDto.ItemName != null) menuItem.ItemName = menuItemDto.ItemName;
            if (menuItemDto.Category != null) menuItem.Category = menuItemDto.Category;
            if (menuItemDto.Price.HasValue) menuItem.Price = menuItemDto.Price.Value;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/menuitems/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMenuItem(int id)
        {
            var menuItem = await _context.MenuItems.FindAsync(id);

            if (menuItem == null)
            {
                return NotFound(new { message = "Menu item not found" });
            }

            _context.MenuItems.Remove(menuItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/menuitems/categories
        [HttpGet("categories")]
        public async Task<ActionResult<IEnumerable<string>>> GetCategories()
        {
            var categories = await _context.MenuItems
                .Select(m => m.Category)
                .Distinct()
                .OrderBy(c => c)
                .ToListAsync();

            return Ok(categories);
        }
    }
}
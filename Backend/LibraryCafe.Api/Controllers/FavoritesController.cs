using LibraryCafe.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LibraryCafe.Core.Entities;

namespace LibraryCafe.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FavoritesController : ControllerBase
    {
        private readonly LibraryCafeDbContext _context;
        public FavoritesController(LibraryCafeDbContext context) => _context = context;

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetFavorites(int userId)
        {
            try
            {
                var favs = await _context.Favorites
                    .Where(f => f.UserId == userId)
                    .Select(f => new { f.ItemId, f.ItemType })
                    .ToListAsync();
                return Ok(favs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> AddFavorite([FromBody] FavoriteDto dto)
        {
            var exists = await _context.Favorites
                .AnyAsync(f => f.UserId == dto.UserId && f.ItemId == dto.ItemId && f.ItemType == dto.ItemType);
            if (exists) return Ok();
            _context.Favorites.Add(new Favorite
            {
                UserId = dto.UserId,
                ItemId = dto.ItemId,
                ItemType = dto.ItemType
            });
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete]
        public async Task<IActionResult> RemoveFavorite([FromBody] FavoriteDto dto)
        {
            var fav = await _context.Favorites
                .FirstOrDefaultAsync(f => f.UserId == dto.UserId && f.ItemId == dto.ItemId && f.ItemType == dto.ItemType);
            if (fav == null) return Ok();
            _context.Favorites.Remove(fav);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }

    public class FavoriteDto
    {
        public int UserId { get; set; }
        public int ItemId { get; set; }
        public string ItemType { get; set; } = "";
    }
}
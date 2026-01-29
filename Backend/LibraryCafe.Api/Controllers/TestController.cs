using LibraryCafe.Data;
using Microsoft.AspNetCore.Mvc;

namespace LibraryCafe.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        private readonly LibraryCafeDbContext _context;

        public TestController(LibraryCafeDbContext context)
        {
            _context = context;
        }

        [HttpGet("books")]
        public IActionResult GetBooks()
        {
            try
            {
                var books = _context.Books.ToList();
                return Ok(books);
            }
            catch (Exception ex)
            {
                return BadRequest($"DB connection failed: {ex.Message}");
            }
        }

        [HttpGet("users")]
        public IActionResult GetUsers()
        {
            try
            {
                var users = _context.Users.ToList();
                return Ok(users);
            }
            catch (Exception ex)
            {
                return BadRequest($"DB connection failed: {ex.Message}");
            }
        }
    }
}

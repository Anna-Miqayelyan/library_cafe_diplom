using LibraryCafe.Api.DTOs;
using LibraryCafe.Core.Entities;
using LibraryCafe.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryCafe.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CafeOrdersController : ControllerBase
    {
        private readonly LibraryCafeDbContext _context;

        public CafeOrdersController(LibraryCafeDbContext context)
        {
            _context = context;
        }

        // GET: api/cafeorders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CafeOrderDto>>> GetCafeOrders(
            [FromQuery] string? status = null,
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null)
        {
            var query = _context.CafeOrders
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.MenuItem)
                .AsQueryable();

            if (!string.IsNullOrEmpty(status))
                query = query.Where(o => o.Status.ToLower() == status.ToLower());
            if (fromDate.HasValue)
                query = query.Where(o => o.OrderDate >= fromDate.Value);
            if (toDate.HasValue)
                query = query.Where(o => o.OrderDate <= toDate.Value);

            var orders = await query
                .OrderByDescending(o => o.OrderDate)
                .Select(o => new CafeOrderDto
                {
                    Id = o.Id,
                    UserId = o.UserId,
                    UserFullname = o.User.Fullname,
                    OrderDate = o.OrderDate,
                    TotalAmount = o.TotalAmount,
                    OrderType = o.OrderType,
                    Status = o.Status,
                    Items = o.OrderItems.Select(oi => new CafeOrderItemDto
                    {
                        Id = oi.Id,
                        ItemId = oi.ItemId,
                        ItemName = oi.MenuItem.ItemName,
                        Quantity = oi.Quantity,
                        Price = oi.MenuItem.Price,
                        Subtotal = oi.MenuItem.Price * oi.Quantity
                    }).ToList()
                })
                .ToListAsync();

            return Ok(orders);
        }

        // GET: api/cafeorders/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CafeOrderDto>> GetCafeOrder(int id)
        {
            var order = await _context.CafeOrders
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.MenuItem)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null) return NotFound(new { message = "Order not found" });

            return Ok(new CafeOrderDto
            {
                Id = order.Id,
                UserId = order.UserId,
                UserFullname = order.User.Fullname,
                OrderDate = order.OrderDate,
                TotalAmount = order.TotalAmount,
                OrderType = order.OrderType,
                Status = order.Status,
                Items = order.OrderItems.Select(oi => new CafeOrderItemDto
                {
                    Id = oi.Id,
                    ItemId = oi.ItemId,
                    ItemName = oi.MenuItem.ItemName,
                    Quantity = oi.Quantity,
                    Price = oi.MenuItem.Price,
                    Subtotal = oi.MenuItem.Price * oi.Quantity
                }).ToList()
            });
        }

        // POST: api/cafeorders - payment is always cash (no wallet deduction)
        [HttpPost]
        public async Task<ActionResult<CafeOrderDto>> CreateCafeOrder(CafeOrderCreateDto dto)
        {
            var user = await _context.Users.FindAsync(dto.UserId);
            if (user == null) return BadRequest(new { message = "User not found" });

            decimal totalAmount = 0;
            var orderItems = new List<CafeOrderItem>();

            foreach (var item in dto.Items)
            {
                var menuItem = await _context.MenuItems.FindAsync(item.ItemId);
                if (menuItem == null)
                    return BadRequest(new { message = $"Menu item with ID {item.ItemId} not found" });

                totalAmount += menuItem.Price * item.Quantity;
                orderItems.Add(new CafeOrderItem { ItemId = item.ItemId, Quantity = item.Quantity });
            }

            var order = new CafeOrder
            {
                UserId = dto.UserId,
                OrderDate = DateTime.UtcNow,
                TotalAmount = totalAmount,
                OrderType = dto.OrderType,
                Status = "Pending",           // payment collected at desk
                OrderItems = orderItems
            };

            _context.CafeOrders.Add(order);
            await _context.SaveChangesAsync();

            await _context.Entry(order).Reference(o => o.User).LoadAsync();
            await _context.Entry(order).Collection(o => o.OrderItems).LoadAsync();
            foreach (var item in order.OrderItems)
                await _context.Entry(item).Reference(oi => oi.MenuItem).LoadAsync();

            return CreatedAtAction(nameof(GetCafeOrder), new { id = order.Id }, new CafeOrderDto
            {
                Id = order.Id,
                UserId = order.UserId,
                UserFullname = order.User.Fullname,
                OrderDate = order.OrderDate,
                TotalAmount = order.TotalAmount,
                OrderType = order.OrderType,
                Status = order.Status,
                Items = order.OrderItems.Select(oi => new CafeOrderItemDto
                {
                    Id = oi.Id,
                    ItemId = oi.ItemId,
                    ItemName = oi.MenuItem.ItemName,
                    Quantity = oi.Quantity,
                    Price = oi.MenuItem.Price,
                    Subtotal = oi.MenuItem.Price * oi.Quantity
                }).ToList()
            });
        }

        // PUT: api/cafeorders/5/status
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(int id, CafeOrderUpdateStatusDto dto)
        {
            var order = await _context.CafeOrders.FindAsync(id);
            if (order == null) return NotFound(new { message = "Order not found" });

            var valid = new[] { "Pending", "Preparing", "Ready", "Completed", "Cancelled" };
            if (!valid.Contains(dto.Status))
                return BadRequest(new { message = "Invalid status" });

            order.Status = dto.Status;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/cafeorders/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCafeOrder(int id)
        {
            var order = await _context.CafeOrders.FindAsync(id);
            if (order == null) return NotFound(new { message = "Order not found" });

            if (order.Status != "Pending" && order.Status != "Cancelled")
                return BadRequest(new { message = "Cannot delete order in current status" });

            _context.CafeOrders.Remove(order);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // GET: api/cafeorders/statistics
        [HttpGet("statistics")]
        public async Task<ActionResult<object>> GetOrderStatistics()
        {
            var totalOrders = await _context.CafeOrders.CountAsync();
            var totalRevenue = await _context.CafeOrders.SumAsync(o => (decimal?)o.TotalAmount) ?? 0;
            var today = DateTime.UtcNow.Date;
            var todayOrders = await _context.CafeOrders.CountAsync(o => o.OrderDate.Date == today);
            var todayRevenue = await _context.CafeOrders
                .Where(o => o.OrderDate.Date == today)
                .SumAsync(o => (decimal?)o.TotalAmount) ?? 0;

            return Ok(new
            {
                TotalOrders = totalOrders,
                TotalRevenue = totalRevenue,
                TodayOrders = todayOrders,
                TodayRevenue = todayRevenue,
                AverageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
            });
        }

        // GET: api/cafeorders/daily?days=7  - for analytics chart
        [HttpGet("daily")]
        public async Task<ActionResult<object>> GetDailyOrders([FromQuery] int days = 7)
        {
            var from = DateTime.UtcNow.Date.AddDays(-days + 1);
            var orders = await _context.CafeOrders
                .Where(o => o.OrderDate.Date >= from)
                .ToListAsync();

            var result = Enumerable.Range(0, days).Select(i =>
            {
                var date = from.AddDays(i);
                var count = orders.Count(o => o.OrderDate.Date == date);
                var revenue = orders.Where(o => o.OrderDate.Date == date).Sum(o => o.TotalAmount);
                return new { Date = date.ToString("MMM d"), Count = count, Revenue = revenue };
            });

            return Ok(result);
        }
    }
}
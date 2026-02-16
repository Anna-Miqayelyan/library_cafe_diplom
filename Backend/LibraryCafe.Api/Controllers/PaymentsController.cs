using LibraryCafe.Api.DTOs;
using LibraryCafe.Core.Entities;
using LibraryCafe.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryCafe.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : ControllerBase
    {
        private readonly LibraryCafeDbContext _context;

        public PaymentsController(LibraryCafeDbContext context)
        {
            _context = context;
        }

        // GET: api/payments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PaymentDto>>> GetPayments(
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null)
        {
            var query = _context.Payments
                .Include(p => p.User)
                .Include(p => p.Order)
                .AsQueryable();

            if (fromDate.HasValue)
            {
                query = query.Where(p => p.PaymentDate >= fromDate.Value);
            }

            if (toDate.HasValue)
            {
                query = query.Where(p => p.PaymentDate <= toDate.Value);
            }

            var payments = await query
                .OrderByDescending(p => p.PaymentDate)
                .Select(p => new PaymentDto
                {
                    Id = p.Id,
                    OrderId = p.OrderId,
                    UserId = p.UserId,
                    UserFullname = p.User.Fullname,
                    Amount = p.Amount,
                    PaymentMethod = p.PaymentMethod,
                    PaymentDate = p.PaymentDate
                })
                .ToListAsync();

            return Ok(payments);
        }

        // GET: api/payments/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PaymentDto>> GetPayment(int id)
        {
            var payment = await _context.Payments
                .Include(p => p.User)
                .Include(p => p.Order)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (payment == null)
            {
                return NotFound(new { message = "Payment not found" });
            }

            var paymentDto = new PaymentDto
            {
                Id = payment.Id,
                OrderId = payment.OrderId,
                UserId = payment.UserId,
                UserFullname = payment.User.Fullname,
                Amount = payment.Amount,
                PaymentMethod = payment.PaymentMethod,
                PaymentDate = payment.PaymentDate
            };

            return Ok(paymentDto);
        }

        // POST: api/payments
        [HttpPost]
        public async Task<ActionResult<PaymentDto>> CreatePayment(PaymentCreateDto paymentDto)
        {
            // Validate user
            var user = await _context.Users.FindAsync(paymentDto.UserId);
            if (user == null)
            {
                return BadRequest(new { message = "User not found" });
            }

            // Validate order
            var order = await _context.CafeOrders.FindAsync(paymentDto.OrderId);
            if (order == null)
            {
                return BadRequest(new { message = "Order not found" });
            }

            // Validate payment amount
            if (paymentDto.Amount <= 0)
            {
                return BadRequest(new { message = "Payment amount must be positive" });
            }

            // Check if order is already paid
            var existingPayment = await _context.Payments
                .FirstOrDefaultAsync(p => p.OrderId == paymentDto.OrderId);

            if (existingPayment != null)
            {
                return BadRequest(new { message = "Order already has a payment record" });
            }

            var payment = new Payment
            {
                OrderId = paymentDto.OrderId,
                UserId = paymentDto.UserId,
                Amount = paymentDto.Amount,
                PaymentMethod = paymentDto.PaymentMethod,
                PaymentDate = DateTime.Now
            };

            _context.Payments.Add(payment);

            // Update order status to Completed
            order.Status = "Completed";

            await _context.SaveChangesAsync();

            // Reload with navigation properties
            await _context.Entry(payment).Reference(p => p.User).LoadAsync();
            await _context.Entry(payment).Reference(p => p.Order).LoadAsync();

            var resultDto = new PaymentDto
            {
                Id = payment.Id,
                OrderId = payment.OrderId,
                UserId = payment.UserId,
                UserFullname = payment.User.Fullname,
                Amount = payment.Amount,
                PaymentMethod = payment.PaymentMethod,
                PaymentDate = payment.PaymentDate
            };

            return CreatedAtAction(nameof(GetPayment), new { id = payment.Id }, resultDto);
        }

        // DELETE: api/payments/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePayment(int id)
        {
            var payment = await _context.Payments.FindAsync(id);

            if (payment == null)
            {
                return NotFound(new { message = "Payment not found" });
            }

            _context.Payments.Remove(payment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/payments/order/5
        [HttpGet("order/{orderId}")]
        public async Task<ActionResult<PaymentDto>> GetPaymentByOrder(int orderId)
        {
            var payment = await _context.Payments
                .Include(p => p.User)
                .Include(p => p.Order)
                .FirstOrDefaultAsync(p => p.OrderId == orderId);

            if (payment == null)
            {
                return NotFound(new { message = "No payment found for this order" });
            }

            var paymentDto = new PaymentDto
            {
                Id = payment.Id,
                OrderId = payment.OrderId,
                UserId = payment.UserId,
                UserFullname = payment.User.Fullname,
                Amount = payment.Amount,
                PaymentMethod = payment.PaymentMethod,
                PaymentDate = payment.PaymentDate
            };

            return Ok(paymentDto);
        }
    }
}
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
        private const decimal FinePerDay = 50m;

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

            if (fromDate.HasValue) query = query.Where(p => p.PaymentDate >= fromDate.Value);
            if (toDate.HasValue) query = query.Where(p => p.PaymentDate <= toDate.Value);

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
            var p = await _context.Payments
                .Include(p => p.User)
                .Include(p => p.Order)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (p == null) return NotFound(new { message = "Payment not found" });

            return Ok(new PaymentDto
            {
                Id = p.Id,
                OrderId = p.OrderId,
                UserId = p.UserId,
                UserFullname = p.User.Fullname,
                Amount = p.Amount,
                PaymentMethod = p.PaymentMethod,
                PaymentDate = p.PaymentDate
            });
        }

        // POST: api/payments  - cash only, marks order Completed
        [HttpPost]
        public async Task<ActionResult<PaymentDto>> CreatePayment(PaymentCreateDto dto)
        {
            var user = await _context.Users.FindAsync(dto.UserId);
            if (user == null) return BadRequest(new { message = "User not found" });

            var order = await _context.CafeOrders.FindAsync(dto.OrderId);
            if (order == null) return BadRequest(new { message = "Order not found" });

            if (dto.Amount <= 0) return BadRequest(new { message = "Payment amount must be positive" });

            var exists = await _context.Payments.AnyAsync(p => p.OrderId == dto.OrderId);
            if (exists) return BadRequest(new { message = "Order already has a payment record" });

            // Always record as Cash
            var payment = new Payment
            {
                OrderId = dto.OrderId,
                UserId = dto.UserId,
                Amount = dto.Amount,
                PaymentMethod = "Cash",
                PaymentDate = DateTime.UtcNow
            };

            _context.Payments.Add(payment);
            order.Status = "Completed";
            await _context.SaveChangesAsync();

            await _context.Entry(payment).Reference(p => p.User).LoadAsync();
            await _context.Entry(payment).Reference(p => p.Order).LoadAsync();

            return CreatedAtAction(nameof(GetPayment), new { id = payment.Id }, new PaymentDto
            {
                Id = payment.Id,
                OrderId = payment.OrderId,
                UserId = payment.UserId,
                UserFullname = payment.User.Fullname,
                Amount = payment.Amount,
                PaymentMethod = payment.PaymentMethod,
                PaymentDate = payment.PaymentDate
            });
        }

        // POST: api/payments/fine  - record an overdue fine payment
        [HttpPost("fine")]
        public async Task<ActionResult<object>> PayFine(FinePaymentDto dto)
        {
            var user = await _context.Users.FindAsync(dto.UserId);
            if (user == null) return BadRequest(new { message = "User not found" });

            var borrowing = await _context.Borrowings
                .Include(b => b.Book)
                .FirstOrDefaultAsync(b => b.Id == dto.BorrowingId);
            if (borrowing == null) return BadRequest(new { message = "Borrowing not found" });

            if (borrowing.ReturnDate == null)
                return BadRequest(new { message = "Book must be returned before paying the fine" });

            var overdueDays = (int)(borrowing.ReturnDate.Value - borrowing.DueDate!.Value).TotalDays;
            var expectedFine = overdueDays > 0 ? overdueDays * FinePerDay : 0;

            if (dto.Amount < expectedFine)
                return BadRequest(new { message = $"Fine amount should be at least {expectedFine} AMD ({overdueDays} days × 50 AMD)" });

            // Could persist to a FinePayments table - for now return confirmation
            return Ok(new
            {
                Message = "Fine payment recorded",
                BorrowingId = borrowing.Id,
                BookTitle = borrowing.Book?.Title,
                OverdueDays = overdueDays,
                FineAmount = expectedFine,
                AmountPaid = dto.Amount,
                PaymentMethod = "Cash",
                PaidAt = DateTime.UtcNow
            });
        }

        // GET: api/payments/order/5
        [HttpGet("order/{orderId}")]
        public async Task<ActionResult<PaymentDto>> GetPaymentByOrder(int orderId)
        {
            var p = await _context.Payments
                .Include(p => p.User)
                .Include(p => p.Order)
                .FirstOrDefaultAsync(p => p.OrderId == orderId);

            if (p == null) return NotFound(new { message = "No payment found for this order" });

            return Ok(new PaymentDto
            {
                Id = p.Id,
                OrderId = p.OrderId,
                UserId = p.UserId,
                UserFullname = p.User.Fullname,
                Amount = p.Amount,
                PaymentMethod = p.PaymentMethod,
                PaymentDate = p.PaymentDate
            });
        }

        // DELETE: api/payments/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePayment(int id)
        {
            var payment = await _context.Payments.FindAsync(id);
            if (payment == null) return NotFound(new { message = "Payment not found" });

            _context.Payments.Remove(payment);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
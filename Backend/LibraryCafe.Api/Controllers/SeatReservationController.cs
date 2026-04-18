using LibraryCafe.Core.Entities;
using LibraryCafe.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryCafe.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SeatReservationsController : ControllerBase
    {
        private readonly LibraryCafeDbContext _context;
        public SeatReservationsController(LibraryCafeDbContext context)
        {
            _context = context;
        }

        // GET api/seatreservations?date=2025-06-15&from=09:00&to=10:00
        // Returns ALL reservations for that date/slot (so frontend can mark taken seats)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetReservations(
            [FromQuery] string date,
            [FromQuery] string? from = null,
            [FromQuery] string? to = null)
        {
            var query = _context.SeatReservations.AsQueryable();
            query = query.Where(r => r.Date == date);

            var list = await query.Select(r => new
            {
                r.Id,
                r.UserId,
                r.SeatNumber,
                r.Date,
                r.From,
                r.To
            }).ToListAsync();

            return Ok(list);
        }

        // POST api/seatreservations
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] SeatReservationCreateDto dto)
        {
            // Prevent duplicate reservation (same user, same seat, overlapping slot)
            var conflict = await _context.SeatReservations.AnyAsync(r =>
                r.SeatNumber == dto.SeatNumber &&
                r.Date == dto.Date &&
                r.From == dto.From &&
                r.To == dto.To);

            if (conflict)
                return BadRequest(new { message = "This seat is already reserved for that slot." });

            var reservation = new SeatReservation
            {
                UserId = dto.UserId,
                SeatNumber = dto.SeatNumber,
                Date = dto.Date,
                From = dto.From,
                To = dto.To
            };

            _context.SeatReservations.Add(reservation);
            await _context.SaveChangesAsync();
            return Ok(new { reservation.Id, reservation.SeatNumber, reservation.Date, reservation.From, reservation.To });
        }

        // DELETE api/seatreservations?userId=1&seatNumber=3&date=2025-06-15&from=09:00&to=10:00
        [HttpDelete]
        public async Task<IActionResult> Cancel(
            [FromQuery] int userId,
            [FromQuery] int seatNumber,
            [FromQuery] string date,
            [FromQuery] string from,
            [FromQuery] string to)
        {
            var reservation = await _context.SeatReservations.FirstOrDefaultAsync(r =>
                r.UserId == userId &&
                r.SeatNumber == seatNumber &&
                r.Date == date &&
                r.From == from &&
                r.To == to);

            if (reservation == null)
                return NotFound(new { message = "Reservation not found." });

            _context.SeatReservations.Remove(reservation);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }

    public class SeatReservationCreateDto
    {
        public int UserId { get; set; }
        public int SeatNumber { get; set; }
        public string Date { get; set; } = "";
        public string From { get; set; } = "";
        public string To { get; set; } = "";
    }
}
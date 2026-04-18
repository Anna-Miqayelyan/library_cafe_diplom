namespace LibraryCafe.Core.Entities
{
    public class SeatReservation
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        public int SeatNumber { get; set; }
        public string Date { get; set; } = "";   // "2025-06-15"
        public string From { get; set; } = "";   // "09:00"
        public string To { get; set; } = "";     // "10:00"
    }
}
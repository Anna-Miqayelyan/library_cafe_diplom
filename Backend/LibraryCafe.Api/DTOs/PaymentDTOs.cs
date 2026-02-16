namespace LibraryCafe.Api.DTOs
{
    public class PaymentCreateDto
    {
        public int OrderId { get; set; }
        public int UserId { get; set; }
        public decimal Amount { get; set; }
        public string PaymentMethod { get; set; } = null!; // "Cash", "Card", "Online"
    }

    public class PaymentDto
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public int UserId { get; set; }
        public string UserFullname { get; set; } = null!;
        public decimal Amount { get; set; }
        public string PaymentMethod { get; set; } = null!;
        public DateTime PaymentDate { get; set; }
    }
}
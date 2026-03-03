namespace LibraryCafe.Api.DTOs
{
    public class PaymentCreateDto
    {
        public int OrderId { get; set; }
        public int UserId { get; set; }
        public decimal Amount { get; set; }
        // Cash only – kept for record-keeping but always "Cash"
        public string PaymentMethod { get; set; } = "Cash";
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

    // NEW: Fine payment DTO
    public class FinePaymentDto
    {
        public int BorrowingId { get; set; }
        public int UserId { get; set; }
        public decimal Amount { get; set; }
        public string PaymentMethod { get; set; } = "Cash";
    }
}
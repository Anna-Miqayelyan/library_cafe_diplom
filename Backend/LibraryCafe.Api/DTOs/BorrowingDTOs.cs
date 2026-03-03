namespace LibraryCafe.Api.DTOs
{
    public class BorrowingCreateDto
    {
        public int UserId { get; set; }
        public int BookId { get; set; }
        public DateTime? DueDate { get; set; }

        // NEW: frontend sends chosen duration in days
        public int? DurationDays { get; set; }
    }

    public class BorrowingDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string UserFullname { get; set; } = null!;
        public int BookId { get; set; }
        public string BookTitle { get; set; } = null!;
        public DateTime BorrowDate { get; set; }
        public DateTime? ReturnDate { get; set; }
        public DateTime? DueDate { get; set; }
        public bool IsOverdue { get; set; }

        // NEW: fine amount (50 AMD per overdue day)
        public decimal OverdueFine { get; set; }
    }

    public class BorrowingReturnDto
    {
        public DateTime ReturnDate { get; set; }
    }
}
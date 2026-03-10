using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryCafe.Core.Entities
{
    [Table("borrowrequests")]
    public class BorrowRequest
    {
        [Column("requestid")]
        public int Id { get; set; }

        [Column("userid")]
        public int UserId { get; set; }

        [Column("bookid")]
        public int BookId { get; set; }

        [Column("requestdate")]
        public DateTime RequestDate { get; set; } = DateTime.UtcNow;

        // Pending | Approved | Rejected | Taken
        [Column("status")]
        public string Status { get; set; } = "Pending";

        [Column("durationdays")]
        public int DurationDays { get; set; } = 14;

        [Column("notes")]
        public string? Notes { get; set; }

        public User User { get; set; } = null!;
        public Book Book { get; set; } = null!;
    }
}

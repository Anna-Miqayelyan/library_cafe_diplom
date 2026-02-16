using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryCafe.Core.Entities
{
    [Table("borrowings")]
    public class Borrowing
    {
        [Column("borrowid")]
        public int Id { get; set; }

        [Column("userid")]
        public int UserId { get; set; }

        [Column("bookid")]
        public int BookId { get; set; }

        [Column("borrowdate")]
        public DateTime BorrowDate { get; set; }

        [Column("returndate")]
        public DateTime? ReturnDate { get; set; }

        [Column("duedate")]
        public DateTime? DueDate { get; set; }

        // Navigation properties
        public User User { get; set; } = null!;
        public Book Book { get; set; } = null!;
    }
}
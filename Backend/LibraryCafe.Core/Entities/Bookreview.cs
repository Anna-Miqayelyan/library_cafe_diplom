using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryCafe.Core.Entities
{
    [Table("bookreviews")]
    public class BookReview
    {
        [Column("reviewid")]
        public int Id { get; set; }

        [Column("userid")]
        public int UserId { get; set; }

        [Column("bookid")]
        public int BookId { get; set; }

        [Column("rating")]
        public int Rating { get; set; }

        [Column("comment")]
        public string? Comment { get; set; }

        // Navigation properties
        public User User { get; set; } = null!;
        public Book Book { get; set; } = null!;
    }
}
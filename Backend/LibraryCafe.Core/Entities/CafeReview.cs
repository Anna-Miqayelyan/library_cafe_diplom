using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryCafe.Core.Entities
{
    [Table("cafereviews")]
    public class CafeReview
    {
        [Column("reviewid")]
        public int Id { get; set; }

        [Column("userid")]
        public int UserId { get; set; }

        [Column("itemid")]
        public int ItemId { get; set; }

        [Column("rating")]
        public int Rating { get; set; }

        [Column("comment")]
        public string? Comment { get; set; }

        [Column("createdat")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public User User { get; set; } = null!;
        public MenuItem MenuItem { get; set; } = null!;
    }
}
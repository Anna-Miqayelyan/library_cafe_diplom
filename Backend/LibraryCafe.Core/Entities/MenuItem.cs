using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryCafe.Core.Entities
{
    [Table("menuitems")]
    public class MenuItem
    {
        [Column("itemid")]
        public int Id { get; set; }

        [Column("itemname")]
        public string ItemName { get; set; } = null!;

        [Column("category")]
        public string Category { get; set; } = null!;

        [Column("price")]
        public decimal Price { get; set; }

        // Navigation property
        public ICollection<CafeOrderItem> OrderItems { get; set; } = new List<CafeOrderItem>();
        public ICollection<CafeReview> Reviews { get; set; } = new List<CafeReview>();
    }
}
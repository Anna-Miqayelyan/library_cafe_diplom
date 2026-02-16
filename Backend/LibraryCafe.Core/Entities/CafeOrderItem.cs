using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryCafe.Core.Entities
{
    [Table("cafeorderitems")]
    public class CafeOrderItem
    {
        [Column("orderitemid")]
        public int Id { get; set; }

        [Column("orderid")]
        public int OrderId { get; set; }

        [Column("itemid")]
        public int ItemId { get; set; }

        [Column("quantity")]
        public int Quantity { get; set; }

        // Navigation properties
        public CafeOrder Order { get; set; } = null!;
        public MenuItem MenuItem { get; set; } = null!;
    }
}
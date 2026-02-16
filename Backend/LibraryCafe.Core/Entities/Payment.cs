using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryCafe.Core.Entities
{
    [Table("payments")]
    public class Payment
    {
        [Column("paymentid")]
        public int Id { get; set; }

        [Column("orderid")]
        public int OrderId { get; set; }

        [Column("userid")]
        public int UserId { get; set; }

        [Column("amount")]
        public decimal Amount { get; set; }

        [Column("paymentmethod")]
        public string PaymentMethod { get; set; } = null!;

        [Column("paymentdate")]
        public DateTime PaymentDate { get; set; }

        // Navigation properties
        public CafeOrder Order { get; set; } = null!;
        public User User { get; set; } = null!;
    }
}
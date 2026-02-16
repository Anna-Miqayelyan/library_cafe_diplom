using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryCafe.Core.Entities
{
	[Table("cafeorders")]
	public class CafeOrder
	{
		[Column("orderid")]
		public int Id { get; set; }

		[Column("userid")]
		public int UserId { get; set; }

		[Column("orderdate")]
		public DateTime OrderDate { get; set; }

		[Column("totalamount")]
		public decimal TotalAmount { get; set; }

		[Column("ordertype")]
		public string OrderType { get; set; } = null!;

		[Column("status")]
		public string Status { get; set; } = null!;

		// Navigation properties
		public User User { get; set; } = null!;
		public ICollection<CafeOrderItem> OrderItems { get; set; } = new List<CafeOrderItem>();
		public ICollection<Payment> Payments { get; set; } = new List<Payment>();
	}
}
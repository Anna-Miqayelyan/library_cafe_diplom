using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryCafe.Core.Entities
{
    [Table("users")]
    public class User
    {
        [Column("userid")]
        public int Id { get; set; }

        [Column("fullname")]
        public string Fullname { get; set; } = null!;

        [Column("email")]
        public string Email { get; set; } = null!;

        [Column("phonenumber")]
        public string? PhoneNumber { get; set; }

        [Column("passwordhash")]
        public string PasswordHash { get; set; } = null!;

        [Column("role")]
        public string Role { get; set; } = null!;

        [Column("isapproved")]
        public bool IsApproved { get; set; } = true;

        public ICollection<Borrowing> Borrowings { get; set; } = new List<Borrowing>();
        public ICollection<BookReview> BookReviews { get; set; } = new List<BookReview>();
        public ICollection<CafeOrder> CafeOrders { get; set; } = new List<CafeOrder>();
      // public ICollection<Payment> Payments { get; set; } = new List<Payment>();
       public ICollection<CafeReview> CafeReviews { get; set; } = new List<CafeReview>();
        public ICollection<BorrowRequest> BorrowRequests { get; set; } = new List<BorrowRequest>();

    }
}
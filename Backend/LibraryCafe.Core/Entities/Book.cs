using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryCafe.Core.Entities
{
    [Table("books")] // exact table name in your DB
    public class Book
    {
        [Column("bookid")]
        public int Id { get; set; }

        [Column("title")]
        public string Title { get; set; } = null!;

        [Column("author")]
        public string Author { get; set; } = null!;

        [Column("category")]
        public string Category { get; set; } = null!;

        [Column("isbn")]
        public string ISBN { get; set; } = null!;

        [Column("bookshelf")]
        public string Bookshelf { get; set; } = null!;

        public ICollection<Borrowing> Borrowings { get; set; } = new List<Borrowing>();
        public ICollection<BookReview> Reviews { get; set; } = new List<BookReview>();
    }
}

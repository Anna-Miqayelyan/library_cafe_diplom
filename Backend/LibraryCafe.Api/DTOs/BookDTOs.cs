namespace LibraryCafe.Api.DTOs
{
    // For creating/updating books
    public class BookCreateDto
    {
        public string Title { get; set; } = null!;
        public string Author { get; set; } = null!;
        public string Category { get; set; } = null!;
        public string ISBN { get; set; } = null!;
        public string Bookshelf { get; set; } = null!;
    }

    public class BookUpdateDto
    {
        public string? Title { get; set; }
        public string? Author { get; set; }
        public string? Category { get; set; }
        public string? ISBN { get; set; }
        public string? Bookshelf { get; set; }
    }

    // For reading books
    public class BookDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string Author { get; set; } = null!;
        public string Category { get; set; } = null!;
        public string ISBN { get; set; } = null!;
        public string Bookshelf { get; set; } = null!;
        public bool IsAvailable { get; set; }
    }
}
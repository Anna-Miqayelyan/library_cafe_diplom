namespace LibraryCafe.Api.DTOs
{
    public class BookCreateDto
    {
        public string Title { get; set; } = null!;
        public string Author { get; set; } = null!;
        public string Category { get; set; } = null!;
        public string ISBN { get; set; } = null!;
        public string Bookshelf { get; set; } = null!;

        public int TotalCount { get; set; } = 1;
        public string? ImagePath { get; set; }
        public string? PdfUrl { get; set; }
    }

    public class BookUpdateDto
    {
        public string? Title { get; set; }
        public string? Author { get; set; }
        public string? Category { get; set; }
        public string? ISBN { get; set; }
        public string? Bookshelf { get; set; }
        public int? TotalCount { get; set; }
        public string? ImagePath { get; set; }
        public string? PdfUrl { get; set; }
    }

    public class BookDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string Author { get; set; } = null!;
        public string Category { get; set; } = null!;
        public string ISBN { get; set; } = null!;
        public string Bookshelf { get; set; } = null!;
        public bool IsAvailable { get; set; }

        public int TotalCount { get; set; }
        public int BorrowedCount { get; set; }
        public int AvailableCount { get; set; }
        public string? ImagePath { get; set; }
        public string? PdfUrl { get; set; }
        public double? AverageRating { get; set; }
        public int ReviewCount { get; set; }
    }
}
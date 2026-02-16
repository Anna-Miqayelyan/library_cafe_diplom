namespace LibraryCafe.Api.DTOs
{
    public class BookReviewCreateDto
    {
        public int UserId { get; set; }
        public int BookId { get; set; }
        public int Rating { get; set; } // 1-5
        public string? Comment { get; set; }
    }

    public class BookReviewDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string UserFullname { get; set; } = null!;
        public int BookId { get; set; }
        public string BookTitle { get; set; } = null!;
        public int Rating { get; set; }
        public string? Comment { get; set; }
    }

    public class CafeReviewCreateDto
    {
        public int UserId { get; set; }
        public int ItemId { get; set; }
        public int Rating { get; set; } // 1-5
        public string? Comment { get; set; }
    }

    public class CafeReviewDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string UserFullname { get; set; } = null!;
        public int ItemId { get; set; }
        public string ItemName { get; set; } = null!;
        public int Rating { get; set; }
        public string? Comment { get; set; }
    }
}
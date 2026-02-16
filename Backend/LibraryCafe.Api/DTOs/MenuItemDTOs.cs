namespace LibraryCafe.Api.DTOs
{
    public class MenuItemCreateDto
    {
        public string ItemName { get; set; } = null!;
        public string Category { get; set; } = null!;
        public decimal Price { get; set; }
    }

    public class MenuItemUpdateDto
    {
        public string? ItemName { get; set; }
        public string? Category { get; set; }
        public decimal? Price { get; set; }
    }

    public class MenuItemDto
    {
        public int Id { get; set; }
        public string ItemName { get; set; } = null!;
        public string Category { get; set; } = null!;
        public decimal Price { get; set; }
        public double? AverageRating { get; set; }
    }
}
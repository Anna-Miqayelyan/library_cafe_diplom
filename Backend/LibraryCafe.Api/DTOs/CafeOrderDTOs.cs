namespace LibraryCafe.Api.DTOs
{
    public class CafeOrderCreateDto
    {
        public int UserId { get; set; }
        public string OrderType { get; set; } = null!; // "Dine-in", "Takeout"
        public List<OrderItemDto> Items { get; set; } = new();
    }

    public class OrderItemDto
    {
        public int ItemId { get; set; }
        public int Quantity { get; set; }
    }

    public class CafeOrderDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string UserFullname { get; set; } = null!;
        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string OrderType { get; set; } = null!;
        public string Status { get; set; } = null!;
        public List<CafeOrderItemDto> Items { get; set; } = new();
    }

    public class CafeOrderItemDto
    {
        public int Id { get; set; }
        public int ItemId { get; set; }
        public string ItemName { get; set; } = null!;
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public decimal Subtotal { get; set; }
    }

    public class CafeOrderUpdateStatusDto
    {
        public string Status { get; set; } = null!; // "Pending", "Preparing", "Ready", "Completed", "Cancelled"
    }
}
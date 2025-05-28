namespace BookAPI.Models
{
    public class OrderItemDto
    {
        public Guid OrderUuid { get; set; }
        public Guid BookUuid { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }
}

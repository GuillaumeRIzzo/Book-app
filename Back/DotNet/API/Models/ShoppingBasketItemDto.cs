namespace API.Models
{
    public class ShoppingBasketItemDto
    {
        public Guid BasketUuid { get; set; }
        public Guid BookUuid { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }
}

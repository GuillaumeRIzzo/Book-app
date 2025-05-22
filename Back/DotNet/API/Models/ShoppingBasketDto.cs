namespace BookAPI.Models
{
    public class ShoppingBasketDto
    {
        public int BasketId { get; set; }
        public Guid BasketUuid { get; set; }
        public Guid UserUuid { get; set; }
        public DateTimeOffset BasketDateCreated { get; set; }
        public bool IsFinalized { get; set; }
    }
}

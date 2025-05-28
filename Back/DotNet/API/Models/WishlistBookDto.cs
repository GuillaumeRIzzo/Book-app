namespace BookAPI.Models
{
    public class WishlistBookDto
    {
        public int WishlistId { get; set; }
        public Guid WishlistUuid { get; set; }
        public Guid UserUuid { get; set; }
        public Guid BookUuid { get; set; }
        public DateTimeOffset WishlistDateAdd { get; set; }
    }
}

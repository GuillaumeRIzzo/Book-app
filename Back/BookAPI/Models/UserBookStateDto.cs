namespace BookAPI.Models
{
    public class UserBookStateDto
    {
        public Guid UserUuid { get; set; }
        public Guid BookUuid { get; set; }
        public Guid? StateStatusUuid { get; set; }
        public decimal? StateProgress { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }
    }
}

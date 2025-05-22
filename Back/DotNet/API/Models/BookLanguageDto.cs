namespace BookAPI.Models
{
    public class BookLanguageDto
    {
        public Guid BookUuid { get; set; }
        public Guid LanguageUuid { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }
    }
}

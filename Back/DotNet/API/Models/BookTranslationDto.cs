namespace API.Models
{
    public class BookTranslationDto
    {
        public int BookTranslationId { get; set; }
        public Guid BookTranslationUuid { get; set; }
        public string? Title { get; set; }
        public string? Summary { get; set; }
        public DateTimeOffset? CreatedAt { get; set; }
        public DateTimeOffset? UpdatedAt { get; set; }
        public Guid BookUuid { get; set; }
        public Guid LanguageUuid { get; set; }
    }
}

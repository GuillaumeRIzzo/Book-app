namespace API.Models
{
    public class BookTranslationDto
    {
        public int BookTranslationId { get; set; }
        public Guid BookTranslationUuid { get; set; }
        public string? BookTitle { get; set; }
        public string? BookSubtitle { get; set; }
        public string? BookDescription { get; set; }
        public DateTimeOffset? CreatedAt { get; set; }
        public DateTimeOffset? UpdatedAt { get; set; }
        public Guid BookUuid { get; set; }
        public Guid LanguageUuid { get; set; }
    }
}

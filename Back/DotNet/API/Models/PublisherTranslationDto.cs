namespace API.Models
{
    public class PublisherTranslationDto
    {
        public int PublisherTranslationId { get; set; }
        public Guid PublisherTranslationUuid { get; set; } = Guid.NewGuid();
        public Guid PublisherUuid { get; set; }
        public Guid LanguageUuid { get; set; }
        public string? TranslatedName { get; set; }
        public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
        public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
    }
}

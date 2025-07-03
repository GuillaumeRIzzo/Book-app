namespace API.Models
{
    public class CategoryTranslationDto
    {
        public int CategoryTranslationId { get; set; }
        public Guid CategoryTranslationUuid { get; set; }
        public Guid CategoryUuid { get; set; }
        public Guid LanguageUuid { get; set; }
        public string? TranslatedName { get; set; }
        public string? TranslatedDescription { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }
    }
}

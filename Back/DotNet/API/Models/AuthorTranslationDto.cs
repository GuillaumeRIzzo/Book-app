namespace API.Models
{
    public class AuthorTranslationDto
    {
        public int AuthorTranslationId { get; set; }
        public Guid AuthorTranslationUuid { get; set; }
        public Guid AuthorUuid { get; set; }
        public Guid LanguageUuid { get; set; }
        public string? AuthorBio { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }
    }
}

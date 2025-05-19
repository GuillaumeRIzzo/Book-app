namespace BookAPI.Models
{
    public class AuthorLanguageDto
    {
        public Guid AuthorUuid { get; set; }
        public Guid LanguageUuid { get; set; }
        public bool IsPrimaryLanguage { get; set; }
        public DateTimeOffset AddedAt { get; set; }
    }
}

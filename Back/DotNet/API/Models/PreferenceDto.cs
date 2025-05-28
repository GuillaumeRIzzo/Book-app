namespace BookAPI.Models
{
    public class PreferenceDto
    {
        public int PreferenceId { get; set; }
        public Guid PreferenceUuid { get; set; }
        public Guid UserUuid { get; set; }
        public Guid LanguageUuid { get; set; }
        public Guid ThemeUuid { get; set; }
        public Guid ColorUuid { get; set; }
        public string? OverrideFields { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }
    }
}

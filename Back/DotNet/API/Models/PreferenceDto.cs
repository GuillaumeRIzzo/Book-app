namespace BookAPI.Models
{
    public class PreferenceDto
    {
        public int PreferenceId { get; set; }
        public Guid PreferenceUuid { get; set; }
        public Guid UserUuid { get; set; }
        public Guid LanguageUuid { get; set; }
        public Guid ThemeUuid { get; set; }
        public Guid PrimaryColorUuid { get; set; }
        public Guid SecondaryColorUuid { get; set; }
        public Guid BackgroundColorUuid { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }
    }
}

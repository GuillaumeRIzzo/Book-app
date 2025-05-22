namespace BookAPI.Models
{
    public class ThemeDto
    {
        public int ThemeId { get; set; }
        public Guid ThemeUuid { get; set; }
        public string ThemeName { get; set; } = string.Empty;
    }
}

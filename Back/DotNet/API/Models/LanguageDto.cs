namespace API.Models
{
    public class LanguageDto
    {
        public int LanguageId { get; set; }
        public Guid LanguageUuid { get; set; }
        public string LanguageName { get; set; } = string.Empty;
        public string IsoCode { get; set; } = string.Empty;
        public bool IsDefault { get; set; }
    }
}

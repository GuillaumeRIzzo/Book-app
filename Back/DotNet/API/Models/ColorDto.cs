namespace API.Models
{
    public class ColorDto
    {
        public int ColorId { get; set; }
        public Guid ColorUuid { get; set; }
        public string ColorName { get; set; } = string.Empty;
        public string ColorHex { get; set; } = string.Empty;
    }
}

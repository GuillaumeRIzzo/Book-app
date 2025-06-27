namespace API.Models
{
    public class BookImageDto
    {
        public int ImageId { get; set; }
        public Guid ImageUuid { get; set; }
        public Guid BookUuid { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string? ImageAlt { get; set; }
        public bool IsCover { get; set; }
        public int? ImageOrder { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }
        public Guid ImageTypeUuid { get; set; }
    }
}

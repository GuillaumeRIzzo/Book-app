namespace API.Models
{
    public class CategoryDto
    {
        public int CategoryId { get; set; }
        public Guid CategoryUuid { get; set; }
        public string CategoryName { get; set; } = null!;
        public string CategoryDescription { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = null!;
        public string? ImageAlt { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }
    }
}

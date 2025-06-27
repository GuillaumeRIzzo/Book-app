namespace API.Models
{
    public class PublisherDto
    {
        public int PublisherId { get; set; }
        public Guid PublisherUuid { get; set; }
        public string PublisherName { get; set; } = null!;
        public string ImageUrl { get; set; } = string.Empty;
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }
    }
}

namespace API.Models
{
    public class AuthorDistinctionDto
    {
        public int DistinctionId { get; set; }
        public Guid DistinctionUuid { get; set; }
        public string DistinctionLabel { get; set; } = string.Empty;
        public DateTimeOffset DistinctionDate { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }
        public Guid AuthorUuid { get; set; }
    }
}

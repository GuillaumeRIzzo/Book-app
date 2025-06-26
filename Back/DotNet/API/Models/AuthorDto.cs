namespace API.Models
{
    public class AuthorDto
    {
        public int AuthorId { get; set; }
        public Guid AuthorUuid { get; set; }
        public string AuthorFullName { get; set; } = string.Empty;
        public DateOnly? AuthorBirthDate { get; set; }
        public string? AuthorBirthPlace { get; set; }
        public DateOnly? AuthorDeathDate { get; set; }
        public string? AuthorDeathPlace { get; set; }
        public string? AuthorBio { get; set; }
        public bool IsDeleted { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }
    }
}

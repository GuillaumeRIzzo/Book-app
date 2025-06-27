namespace API.Models
{
    public class UserEmailDto
    {
        public int EmailId { get; set; }
        public Guid EmailUuid { get; set; } = Guid.NewGuid();
        public Guid UserUuid { get; set; }
        public string EmailAddress { get; set; } = string.Empty;
        public bool IsPrimary { get; set; }
        public bool IsValidated { get; set; }
        public string? ValidationToken { get; set; }
        public string? NewEmailAddress { get; set; }
        public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
        public DateTimeOffset? UpdatedAt { get; set; }
        public DateTimeOffset? ValidatedAt { get; set; }
        public DateTimeOffset? LastValidationEmailSentAt { get; set; }
    }
}

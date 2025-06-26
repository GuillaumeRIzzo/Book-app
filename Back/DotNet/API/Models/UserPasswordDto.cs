namespace API.Models
{
    public class UserPasswordDto
    {
        public int PasswordId { get; set; }
        public Guid PasswordUuid { get; set; } = Guid.NewGuid();
        public Guid UserUuid { get; set; }
        public string HashedPassword { get; set; } = string.Empty;
        public bool MustChange { get; set; }
        public DateTimeOffset LastChangedAt { get; set; } = DateTimeOffset.UtcNow;
        public DateTimeOffset? LastPasswordResetRequestAt { get; set; }
        public string? ResetToken { get; set; }
        public DateTimeOffset? ResetExpiresAt { get; set; }
    }
}

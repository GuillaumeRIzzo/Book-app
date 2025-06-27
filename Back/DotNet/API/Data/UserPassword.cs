using API.Data;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Data
{
    [Table("USER_PASSWORDS")]
    public class UserPassword
    {
        [Key]
        [Column("password_id")]
        public int PasswordId { get; set; }

        [Column("password_uuid")]
        public Guid PasswordUuid { get; set; } = Guid.NewGuid();

        [Column("user_uuid")]
        public Guid UserUuid { get; set; }

        [Column("hashed_password")]
        [StringLength(200)]
        public string HashedPassword { get; set; } = string.Empty;

        [Column("must_change")]
        public bool MustChange { get; set; }

        [Column("last_changed_at")]
        public DateTimeOffset LastChangedAt { get; set; } = DateTimeOffset.UtcNow;

        [Column("last_password_reset_request_at")]
        public DateTimeOffset? LastPasswordResetRequestAt { get; set; }

        [Column("reset_token")]
        public string? ResetToken { get; set; }

        [Column("reset_expires_at")]
        public DateTimeOffset? ResetExpiresAt { get; set; }

        [ForeignKey("UserUuid")]
        [InverseProperty("UserPassword")]
        public virtual User UserUu { get; set; } = null!;
    }
}

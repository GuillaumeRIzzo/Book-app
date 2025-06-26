using API.Data;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Data
{
    [Table("USER_EMAILS")]
    public class UserEmail
    {
        [Key]
        [Column("email_id")]
        public int EmailId { get; set; }

        [Column("email_uuid")]
        public Guid EmailUuid { get; set; } = Guid.NewGuid();

        [Column("user_uuid")]
        public Guid UserUuid { get; set; }

        [Column("email_address")]
        [StringLength(100)]
        public string EmailAddress { get; set; } = string.Empty;

        [Column("is_primary")]
        public bool IsPrimary { get; set; }

        [Column("is_validated")]
        public bool IsValidated { get; set; }

        [Column("validation_token")]
        public string? ValidationToken { get; set; }

        [Column("new_email_address")]
        [StringLength(100)]
        public string? NewEmailAddress { get; set; }

        [Column("created_at")]
        public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

        [Column("updated_at")]
        public DateTimeOffset? UpdatedAt { get; set; }

        [Column("validated_at")]
        public DateTimeOffset? ValidatedAt { get; set; }

        [Column("last_validation_email_sent_at")]
        public DateTimeOffset? LastValidationEmailSentAt { get; set; }

        [ForeignKey("UserUuid")]
        [InverseProperty("UserEmailsUu")]
        public virtual User UserUu { get; set; } = null!;
    }
}

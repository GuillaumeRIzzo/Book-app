using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookAPI.Data;

[Table("NOTIFICATIONS")]
[Index("NotificationUuid", Name = "UQ__NOTIFICA__AF8FFDCC5495BDAE", IsUnique = true)]
public partial class Notification
{
    [Key]
    [Column("notification_id")]
    public int NotificationId { get; set; }

    [Column("notification_uuid")]
    public Guid NotificationUuid { get; set; } = Guid.NewGuid();

    [Column("user_uuid")]
    public Guid UserUuid { get; set; }

    [Column("notification_title")]
    [StringLength(100)]
    [Unicode(false)]
    public string? NotificationTitle { get; set; }

    [Column("notification_message", TypeName = "text")]
    public string NotificationMessage { get; set; } = string.Empty;

    [Column("is_read")]
    public bool IsRead { get; set; } = false;

    [Column("notification_date")]
    public DateTimeOffset NotificationDate { get; set; }

    [ForeignKey("UserUuid")]
    [InverseProperty("Notifications")]
    public virtual User UserUu { get; set; } = null!;
}

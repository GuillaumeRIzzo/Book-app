using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookAPI.Data;

[Table("MODERATION_LOGS")]
[Index("ModerationUuid", Name = "UQ__MODERATI__99EB959F7A9C9ACA", IsUnique = true)]
public partial class ModerationLog
{
    [Key]
    [Column("moderation_id")]
    public int ModerationId { get; set; }

    [Column("moderation_uuid")]
    public Guid ModerationUuid { get; set; } = Guid.NewGuid();

    [Column("target_type")]
    [StringLength(50)]
    [Unicode(false)]
    public string TargetType { get; set; } = string.Empty;

    [Column("target_uuid")]
    public Guid TargetUuid { get; set; }

    [Column("trigger_reason")]
    [StringLength(255)]
    [Unicode(false)]
    public string TriggerReason { get; set; } = string.Empty;

    [Column("moderation_type")]
    [StringLength(50)]
    [Unicode(false)]
    public string ModerationType { get; set; } = string.Empty;

    [Column("moderation_level")]
    [StringLength(50)]
    [Unicode(false)]
    public string ModerationLevel { get; set; } = string.Empty;

    [Column("action")]
    [StringLength(255)]
    [Unicode(false)]
    public string Action { get; set; } = string.Empty;

    [Column("moderation_status")]
    [StringLength(20)]
    [Unicode(false)]
    public string ModerationStatus { get; set; } = string.Empty;

    [Column("moderation_comment", TypeName = "text")]
    public string? ModerationComment { get; set; }

    [Column("detected_by")]
    [StringLength(50)]
    [Unicode(false)]
    public string DetectedBy { get; set; } = string.Empty;

    [Column("created_at")]
    public DateTimeOffset CreatedAt { get; set; }

    [Column("updated_at")]
    public DateTimeOffset UpdatedAt { get; set; }

    [Column("resolved")]
    public bool? Resolved { get; set; }
}

using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Data;

[Table("AUDIT_TRAIL")]
[Index("AuditUuid", Name = "UQ__AUDIT_TR__A65B6CD09E30948E", IsUnique = true)]
public partial class AuditTrail
{
    [Key]
    [Column("audit_id")]
    public int AuditId { get; set; }

    [Column("audit_uuid")]
    public Guid AuditUuid { get; set; } = Guid.NewGuid();

    [Column("entity_tablename")]
    [StringLength(100)]
    [Unicode(false)]
    public string EntityTablename { get; set; } = string.Empty;

    [Column("entity_uuid")]
    public Guid EntityUuid { get; set; }

    [Column("action_type")]
    [StringLength(20)]
    [Unicode(false)]
    public string ActionType { get; set; } = string.Empty;

    [Column("action_date")]
    public DateTimeOffset ActionDate { get; set; }

    [Column("action_user_uuid")]
    public Guid ActionUserUuid { get; set; }

    [Column("previous_data")]
    public string? PreviousData { get; set; }

    [Column("new_data")]
    public string? NewData { get; set; }

    [Column("source")]
    [StringLength(50)]
    [Unicode(false)]
    public string? Source { get; set; }

    [ForeignKey("ActionUserUuid")]
    [InverseProperty("AuditTrails")]
    public virtual User ActionUserUu { get; set; } = null!;
}

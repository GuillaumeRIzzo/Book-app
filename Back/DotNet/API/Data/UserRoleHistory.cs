using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookAPI.Data;

[Table("USER_ROLE_HISTORY")]
[Index("HistoryUuid", Name = "UQ__USER_ROL__EF0FC8D61098FA34", IsUnique = true)]
public partial class UserRoleHistory
{
    [Key]
    [Column("history_id")]
    public int HistoryId { get; set; }

    [Column("history_uuid")]
    public Guid HistoryUuid { get; set; } = Guid.NewGuid();

    [Column("target_user_uuid")]
    public Guid TargetUserUuid { get; set; }

    [Column("modified_by_uuid")]
    public Guid ModifiedByUuid { get; set; }

    [Column("previous_right_uuid")]
    public Guid PreviousRightUuid { get; set; }

    [Column("new_right_uuid")]
    public Guid NewRightUuid { get; set; }

    [Column("change_date")]
    public DateTimeOffset ChangeDate { get; set; }

    [ForeignKey("ModifiedByUuid")]
    [InverseProperty("UserRoleHistoryModifiedByUus")]
    public virtual User ModifiedByUu { get; set; } = null!;

    [ForeignKey("NewRightUuid")]
    [InverseProperty("UserRoleHistoryNewRightUus")]
    public virtual UserRight NewRightUu { get; set; } = null!;

    [ForeignKey("PreviousRightUuid")]
    [InverseProperty("UserRoleHistoryPreviousRightUus")]
    public virtual UserRight PreviousRightUu { get; set; } = null!;

    [ForeignKey("TargetUserUuid")]
    [InverseProperty("UserRoleHistoryTargetUserUus")]
    public virtual User TargetUserUu { get; set; } = null!;
}

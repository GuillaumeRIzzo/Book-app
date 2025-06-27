using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Data;

[Table("USER_RIGHTS")]
[Index("UserRightUuid", Name = "UQ__USER_RIG__45565B2CE70DC2EF", IsUnique = true)]
[Index("UserRightName", Name = "UQ__USER_RIG__54B7341DDEB6DBB7", IsUnique = true)]
public partial class UserRight
{
    [Key]
    [Column("user_right_id")]
    public int UserRightId { get; set; }

    [Column("user_right_uuid")]
    public Guid UserRightUuid { get; set; } = Guid.NewGuid();

    [Column("user_right_name")]
    [StringLength(30)]
    [Unicode(false)]
    public string UserRightName { get; set; } = string.Empty;

    [InverseProperty("NewRightUu")]
    public virtual ICollection<UserRoleHistory> UserRoleHistoryNewRightUus { get; set; } = new List<UserRoleHistory>();

    [InverseProperty("PreviousRightUu")]
    public virtual ICollection<UserRoleHistory> UserRoleHistoryPreviousRightUus { get; set; } = new List<UserRoleHistory>();

    [InverseProperty("UserRightUu")]
    public virtual ICollection<User> Users { get; set; } = new List<User>();
}

using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookAPI.Data;

[Table("USER_BOOK_ACTIVITY")]
[Index("ActivityUuid", Name = "UQ__USER_BOO__8BE4EB3DB059654E", IsUnique = true)]
public partial class UserBookActivity
{
    [Key]
    [Column("activity_id")]
    public int ActivityId { get; set; }

    [Column("activity_uuid")]
    public Guid ActivityUuid { get; set; } = Guid.NewGuid();

    [Column("user_uuid")]
    public Guid UserUuid { get; set; }

    [Column("book_uuid")]
    public Guid BookUuid { get; set; }

    [Column("activity_type_uuid")]
    public Guid ActivityTypeUuid { get; set; }

    [Column("activity_date")]
    public DateTimeOffset ActivityDate { get; set; }

    [ForeignKey("ActivityTypeUuid")]
    [InverseProperty("UserBookActivities")]
    public virtual ActivityType? ActivityTypeUu { get; set; }

    [ForeignKey("BookUuid")]
    [InverseProperty("UserBookActivities")]
    public virtual Book BookUu { get; set; } = null!;

    [ForeignKey("UserUuid")]
    [InverseProperty("UserBookActivities")]
    public virtual User UserUu { get; set; } = null!;
}

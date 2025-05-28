using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookAPI.Data;

[Table("ACTIVITY_TYPES")]
[Index("Code", Name = "UQ__ACTIVITY__357D4CF9EF63BEBB", IsUnique = true)]
[Index("ActivityTypeUuid", Name = "UQ__ACTIVITY__7EF01810A22BAA7A", IsUnique = true)]
public partial class ActivityType
{
    [Key]
    [Column("activity_type_id")]
    public int ActivityTypeId { get; set; }

    [Column("activity_type_uuid")]
    public Guid ActivityTypeUuid { get; set; } = Guid.NewGuid();

    [Column("code")]
    [StringLength(50)]
    [Unicode(false)]
    // Strarted, Finished, Abandoned, Recommended
    public string Code { get; set; } = string.Empty;

    [Column("label")]
    [StringLength(255)]
    [Unicode(false)]
    public string Label { get; set; } = string.Empty;

    [InverseProperty("ActivityTypeUu")]
    public virtual ICollection<UserBookActivity> UserBookActivities { get; set; } = new List<UserBookActivity>();
}

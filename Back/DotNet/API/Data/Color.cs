using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookAPI.Data;

[Table("COLORS")]
[Index("ColorUuid", Name = "UQ__COLORS__543625985ED772E5", IsUnique = true)]
public partial class Color
{
    [Key]
    [Column("color_id")]
    public int ColorId { get; set; }

    [Column("color_uuid")]
    public Guid ColorUuid { get; set; } = Guid.NewGuid();

    [Column("color_name")]
    [StringLength(50)]
    [Unicode(false)]
    public string ColorName { get; set; } = string.Empty;

    [Column("color_hex")]
    [StringLength(7)]
    [Unicode(false)]
    public string ColorHex { get; set; } = string.Empty;

    [InverseProperty("PrimaryColor")]
    public virtual ICollection<Preference> PreferencesAsPrimary { get; set; } = new List<Preference>();

    [InverseProperty("SecondaryColor")]
    public virtual ICollection<Preference> PreferencesAsSecondary { get; set; } = new List<Preference>();
}

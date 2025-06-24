using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookAPI.Data;

[Table("THEMES")]
[Index("ThemeUuid", Name = "UQ__THEMES__0444B772B0A708E5", IsUnique = true)]
[Index("ThemeName", Name = "UQ__THEMES__3D6866353B03D7D9", IsUnique = true)]
public partial class Theme
{
    [Key]
    [Column("theme_id")]
    public int ThemeId { get; set; }

    [Column("theme_uuid")]
    public Guid ThemeUuid { get; set; } = Guid.NewGuid();

    [Column("theme_name")]
    [StringLength(30)]
    [Unicode(false)]
    public string ThemeName { get; set; } = string.Empty;

    [Column("is_default")]
    public bool IsDefault { get; set; }

    [InverseProperty("ThemeUu")]
    public virtual ICollection<Preference> Preferences { get; set; } = new List<Preference>();
}

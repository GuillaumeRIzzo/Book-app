using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookAPI.Data;

[Table("PREFERENCES")]
[Index("PreferenceUuid", Name = "UQ__PREFEREN__026ADC377CF20FFA", IsUnique = true)]
[Index("UserUuid", Name = "UQ__PREFEREN__37BE7BB6260327AD", IsUnique = true)]
public partial class Preference
{
    [Key]
    [Column("preference_id")]
    public int PreferenceId { get; set; }

    [Column("preference_uuid")]
    public Guid PreferenceUuid { get; set; } = Guid.NewGuid();

    [Column("user_uuid")]
    public Guid UserUuid { get; set; }

    [Column("language_uuid")]
    public Guid LanguageUuid { get; set; }

    [Column("theme_uuid")]
    public Guid ThemeUuid { get; set; }

    [Column("color_uuid")]
    public Guid ColorUuid { get; set; }

    [Column("override_fields")]
    public string? OverrideFields { get; set; }

    [Column("created_at")]
    public DateTimeOffset CreatedAt { get; set; }

    [Column("updated_at")]
    public DateTimeOffset UpdatedAt { get; set; }

    [ForeignKey("ColorUuid")]
    [InverseProperty("Preferences")]
    public virtual Color ColorUu { get; set; } = null!;

    [ForeignKey("LanguageUuid")]
    [InverseProperty("Preferences")]
    public virtual Language LanguageUu { get; set; }

    [ForeignKey("ThemeUuid")]
    [InverseProperty("Preferences")]
    public virtual Theme ThemeUu { get; set; } = null!;

    [ForeignKey("UserUuid")]
    [InverseProperty("Preference")]
    public virtual User UserUu { get; set; } = null!;
}

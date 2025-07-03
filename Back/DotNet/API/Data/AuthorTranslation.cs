using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

[Table("AUTHOR_TRANSLATIONS")]
[Index(nameof(AuthorUuid), nameof(LanguageUuid), IsUnique = true, Name = "UQ_AUTHOR_TRANSLATION_AUTHOR_LANG")]
public partial class AuthorTranslation
{
    [Key]
    [Column("author_translation_id")]
    public int AuthorTranslationId { get; set; }

    [Column("author_translation_uuid")]
    public Guid AuthorTranslationUuid { get; set; } = Guid.NewGuid();

    [Column("author_uuid")]
    public Guid AuthorUuid { get; set; }

    [Column("language_uuid")]
    public Guid LanguageUuid { get; set; }

    [Column("author_bio", TypeName = "text")]
    public string? AuthorBio { get; set; }

    [Column("created_at")]
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    [Column("updated_at")]
    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;

    [ForeignKey("AuthorUuid")]
    [InverseProperty("AuthorTranslations")]
    public virtual Author AuthorUu { get; set; } = null!;

    [ForeignKey("LanguageUuid")]
    [InverseProperty("AuthorTranslations")]
    public virtual Language LanguageUu { get; set; } = null!;
}
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookAPI.Data;

[PrimaryKey("AuthorUuid", "LanguageUuid")]
[Table("AUTHOR_LANGUAGES")]
public partial class AuthorLanguage
{
    [Key]
    [Column("author_uuid")]
    public Guid AuthorUuid { get; set; }

    [Key]
    [Column("language_uuid")]
    public Guid LanguageUuid { get; set; }

    [Column("is_primary_language")]
    public bool IsPrimaryLanguage { get; set; }

    [Column("added_at")]
    public DateTimeOffset AddedAt { get; set; }

    [ForeignKey("AuthorUuid")]
    [InverseProperty("AuthorLanguages")]
    public virtual Author AuthorUu { get; set; } = null!;

    [ForeignKey("LanguageUuid")]
    [InverseProperty("AuthorLanguages")]
    public virtual Language LanguageUu { get; set; } = null!;
}

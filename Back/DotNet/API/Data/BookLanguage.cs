using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Data;

[PrimaryKey("BookUuid", "LanguageUuid")]
[Table("BOOK_LANGUAGES")]
public partial class BookLanguage
{
    [Key]
    [Column("book_uuid")]
    public Guid BookUuid { get; set; }

    [Key]
    [Column("language_uuid")]
    public Guid LanguageUuid { get; set; }

    [Column("created_at")]
    public DateTimeOffset CreatedAt { get; set; }

    [Column("updated_at")]
    public DateTimeOffset UpdatedAt { get; set; }

    [ForeignKey("BookUuid")]
    [InverseProperty("BookLanguages")]
    public virtual Book BookUu { get; set; } = null!;

    [ForeignKey("LanguageUuid")]
    [InverseProperty("BookLanguages")]
    public virtual Language LanguageUu { get; set; } = null!;
}

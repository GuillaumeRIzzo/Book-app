using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Data;

[Table("BOOK_TRANSLATIONS")]
[Index("BookTranslationUuid", Name = "UQ__BOOK_TRA__A3AFF065AADA48D6", IsUnique = true)]
[Index("BookUuid", "LanguageUuid", Name = "UQ__BOOK_TRA__BEF8F297AA807F10", IsUnique = true)]
public partial class BookTranslation
{
    [Key]
    [Column("book_translation_id")]
    public int BookTranslationId { get; set; }

    [Column("book_translation_uuid")]
    public Guid BookTranslationUuid { get; set; } = Guid.NewGuid();

    [Column("book_uuid")]
    public Guid BookUuid { get; set; }

    [Column("language_uuid")]
    public Guid LanguageUuid { get; set; }

    [Column("title")]
    [StringLength(255)]
    [Unicode(false)]
    public string? Title { get; set; }

    [Column("summary", TypeName = "text")]
    public string? Summary { get; set; }

    [Column("created_at")]
    public DateTimeOffset? CreatedAt { get; set; }

    [Column("updated_at")]
    public DateTimeOffset? UpdatedAt { get; set; }

    [ForeignKey("BookUuid")]
    [InverseProperty("BookTranslations")]
    public virtual Book BookUu { get; set; } = null!;

    [ForeignKey("LanguageUuid")]
    [InverseProperty("BookTranslations")]
    public virtual Language? LanguageUu { get; set; }
}

using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookAPI.Data;

[Table("BANNED_WORDS")]
[Index("Word", Name = "UQ__BANNED_W__839740540FFAEFDD", IsUnique = true)]
public partial class BannedWord
{
    [Key]
    [Column("banned_word_id")]
    public int BannedWordId { get; set; }

    [Column("banned_word_uuid")]
    public Guid BannedWordUuid { get; set; } = Guid.NewGuid();

    [Column("word")]
    [StringLength(100)]
    [Unicode(false)]
    public string Word { get; set; } = string.Empty;

    [Column("language_uuid")]
    public Guid LanguageUuid { get; set; }

    [Column("created_at")]
    public DateTimeOffset CreatedAt { get; set; }

    [Column("updated_at")]
    public DateTimeOffset UpdatedAt { get; set; }

    [Column("is_deleted")]
    public bool IsDeleted { get; set; }

    [ForeignKey("LanguageUuid")]
    [InverseProperty("BannedWords")]
    public virtual Language LanguageUu { get; set; } = null!;
}

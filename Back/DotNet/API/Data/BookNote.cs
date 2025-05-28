using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookAPI.Data;

[Table("BOOK_NOTES")]
[Index("NoteUuid", Name = "UQ__BOOK_NOT__E3F87F4D102891BE", IsUnique = true)]
public partial class BookNote
{
    [Key]
    [Column("note_id")]
    public int NoteId { get; set; }

    [Column("note_uuid")]
    public Guid NoteUuid { get; set; } = Guid.NewGuid();

    [Column("book_uuid")]
    public Guid BookUuid { get; set; }

    [Column("user_uuid")]
    public Guid UserUuid { get; set; }

    [Column("note_value", TypeName = "decimal(3, 2)")]
    public decimal NoteValue { get; set; }

    [Column("note_comment", TypeName = "text")]
    public string? NoteComment { get; set; }

    [Column("note_date")]
    public DateTimeOffset NoteDate { get; set; }

    [Column("is_moderated")]
    public bool? IsModerated { get; set; }

    [Column("is_deleted")]
    public bool IsDeleted { get; set; }

    [Column("created_at")]
    public DateTimeOffset CreatedAt { get; set; }

    [Column("updated_at")]
    public DateTimeOffset UpdatedAt { get; set; }

    [ForeignKey("BookUuid")]
    [InverseProperty("BookNotes")]
    public virtual Book BookUu { get; set; } = null!;

    [ForeignKey("UserUuid")]
    [InverseProperty("BookNotes")]
    public virtual User UserUu { get; set; } = null!;
}

using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookAPI.Data;

[PrimaryKey("ReadListUuid", "BookUuid")]
[Table("READ_LIST_BOOKS")]
public partial class ReadListBook
{
    [Key]
    [Column("readList_uuid")]
    public Guid ReadListUuid { get; set; }

    [Key]
    [Column("book_uuid")]
    public Guid BookUuid { get; set; }

    [Column("created_at")]
    public DateTimeOffset CreatedAt { get; set; }

    [Column("updated_at")]
    public DateTimeOffset UpdatedAt { get; set; }

    [ForeignKey("BookUuid")]
    [InverseProperty("ReadListBooks")]
    public virtual Book BookUu { get; set; } = null!;

    [ForeignKey("ReadListUuid")]
    [InverseProperty("ReadListBooks")]
    public virtual ReadList ReadListUu { get; set; } = null!;
}

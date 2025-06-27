using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

[Table("BOOK_VERSION_HISTORY")]
[Index("VersionUuid", Name = "UQ__BOOK_VER__7240DF08882DC32E", IsUnique = true)]
public partial class BookVersionHistory
{
    [Key]
    [Column("version_id")]
    public int VersionId { get; set; }

    [Column("version_uuid")]
    public Guid VersionUuid { get; set; } = Guid.NewGuid();

    [Column("book_uuid")]
    public Guid BookUuid { get; set; }

    [Column("user_uuid")]
    public Guid? UserUuid { get; set; }

    [Column("change_date")]
    public DateTimeOffset ChangeDate { get; set; }

    [Column("version_description", TypeName = "text")]
    public string? VersionDescription { get; set; }

    [ForeignKey("BookUuid")]
    [InverseProperty("BookVersionHistories")]
    public virtual Book BookUu { get; set; } = null!;

    [ForeignKey("UserUuid")]
    [InverseProperty("BookVersionHistories")]
    public virtual User? UserUu { get; set; }
}

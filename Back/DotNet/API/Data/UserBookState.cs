using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookAPI.Data;

[PrimaryKey("UserUuid", "BookUuid")]
[Table("USER_BOOK_STATE")]
public partial class UserBookState
{
    [Column("user_uuid")]
    public Guid UserUuid { get; set; }

    [Column("book_uuid")]
    public Guid BookUuid { get; set; }

    [Column("state_status_uuid")]
    public Guid? StateStatusUuid { get; set; }

    [Column("state_progress", TypeName = "decimal(5, 2)")]
    public decimal? StateProgress { get; set; }

    [Column("created_at")]
    public DateTimeOffset CreatedAt { get; set; }

    [Column("updated_at")]
    public DateTimeOffset UpdatedAt { get; set; }

    [ForeignKey("BookUuid")]
    [InverseProperty("UserBookStates")]
    public virtual Book BookUu { get; set; } = null!;

    [ForeignKey("StateStatusUuid")]
    [InverseProperty("UserBookStates")]
    public virtual StateStatus? StateStatusUu { get; set; }

    [ForeignKey("UserUuid")]
    [InverseProperty("UserBookStates")]
    public virtual User UserUu { get; set; } = null!;
}

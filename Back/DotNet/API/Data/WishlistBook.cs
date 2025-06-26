using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Data;

[Table("WISHLIST_BOOKS")]
[Index("UserUuid", "BookUuid", Name = "UQ__WISHLIST__0D1680CFCAB0AB39", IsUnique = true)]
[Index("WishlistUuid", Name = "UQ__WISHLIST__6EAF50C372F32DCC", IsUnique = true)]
public partial class WishlistBook
{
    [Key]
    [Column("wishlist_id")]
    public int WishlistId { get; set; }

    [Column("wishlist_uuid")]
    public Guid WishlistUuid { get; set; } = Guid.NewGuid();

    [Column("user_uuid")]
    public Guid UserUuid { get; set; }

    [Column("book_uuid")]
    public Guid BookUuid { get; set; }

    [Column("wishlist_date_add")]
    public DateTimeOffset WishlistDateAdd { get; set; }

    [ForeignKey("BookUuid")]
    [InverseProperty("WishlistBooks")]
    public virtual Book BookUu { get; set; } = null!;

    [ForeignKey("UserUuid")]
    [InverseProperty("WishlistBooks")]
    public virtual User UserUu { get; set; } = null!;
}

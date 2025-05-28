using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookAPI.Data;

[Table("SHOPPING_BASKETS")]
[Index("BasketUuid", Name = "UQ__SHOPPING__392DA560D261BA69", IsUnique = true)]
public partial class ShoppingBasket
{
    [Key]
    [Column("basket_id")]
    public int BasketId { get; set; }

    [Column("basket_uuid")]
    public Guid BasketUuid { get; set; } = Guid.NewGuid();

    [Column("user_uuid")]
    public Guid UserUuid { get; set; }

    [Column("basket_date_created")]
    public DateTimeOffset BasketDateCreated { get; set; }

    [Column("is_finalized")]
    public bool IsFinalized { get; set; }

    [InverseProperty("BasketUu")]
    public virtual ICollection<ShoppingBasketItem> ShoppingBasketItems { get; set; } = new List<ShoppingBasketItem>();

    [ForeignKey("UserUuid")]
    [InverseProperty("ShoppingBaskets")]
    public virtual User UserUu { get; set; } = null!;
}

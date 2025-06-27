using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Data;

[PrimaryKey("BasketUuid", "BookUuid")]
[Table("SHOPPING_BASKET_ITEMS")]
public partial class ShoppingBasketItem
{
    [Key]
    [Column("basket_uuid")]
    public Guid BasketUuid { get; set; }

    [Key]
    [Column("book_uuid")]
    public Guid BookUuid { get; set; }

    [Column("quantity")]
    public int Quantity { get; set; }

    [Column("unit_price", TypeName = "decimal(10, 2)")]
    public decimal UnitPrice { get; set; }

    [ForeignKey("BasketUuid")]
    [InverseProperty("ShoppingBasketItems")]
    public virtual ShoppingBasket BasketUu { get; set; } = null!;

    [ForeignKey("BookUuid")]
    [InverseProperty("ShoppingBasketItems")]
    public virtual Book BookUu { get; set; } = null!;
}

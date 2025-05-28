using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookAPI.Data;

[PrimaryKey("OrderUuid", "BookUuid")]
[Table("ORDER_ITEMS")]
public partial class OrderItem
{
    [Key]
    [Column("order_uuid")]
    public Guid OrderUuid { get; set; } = Guid.NewGuid();

    [Key]
    [Column("book_uuid")]
    public Guid BookUuid { get; set; }

    [Column("quantity")]
    public int Quantity { get; set; }

    [Column("unit_price", TypeName = "decimal(10, 2)")]
    public decimal UnitPrice { get; set; }

    [ForeignKey("BookUuid")]
    [InverseProperty("OrderItems")]
    public virtual Book BookUu { get; set; } = null!;

    [ForeignKey("OrderUuid")]
    [InverseProperty("OrderItems")]
    public virtual OrderHistory OrderUu { get; set; } = null!;
}

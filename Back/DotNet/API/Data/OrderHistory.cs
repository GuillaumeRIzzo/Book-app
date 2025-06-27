using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Data;

[Table("ORDER_HISTORY")]
[Index("OrderUuid", Name = "UQ__ORDER_HI__3DE398660EACEC5B", IsUnique = true)]
public partial class OrderHistory
{
    [Key]
    [Column("order_id")]
    public int OrderId { get; set; }

    [Column("order_uuid")]
    public Guid OrderUuid { get; set; } = Guid.NewGuid();

    [Column("user_uuid")]
    public Guid UserUuid { get; set; }

    [Column("order_date")]
    public DateTimeOffset OrderDate { get; set; }

    [Column("total_amount", TypeName = "decimal(10, 2)")]
    public decimal TotalAmount { get; set; }

    [InverseProperty("OrderUu")]
    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    [ForeignKey("UserUuid")]
    [InverseProperty("OrderHistories")]
    public virtual User UserUu { get; set; } = null!;
}

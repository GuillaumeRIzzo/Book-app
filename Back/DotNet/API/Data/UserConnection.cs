using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookAPI.Data;

[Table("USER_CONNECTIONS")]
[Index("ConnectionUuid", Name = "UQ__USER_CON__CEDB16623FF5D71E", IsUnique = true)]
public partial class UserConnection
{
    [Key]
    [Column("connection_id")]
    public int ConnectionId { get; set; }

    [Column("connection_uuid")]
    public Guid ConnectionUuid { get; set; } = Guid.NewGuid();

    [Column("user_uuid")]
    public Guid UserUuid { get; set; }

    [Column("connection_date")]
    public DateTimeOffset ConnectionDate { get; set; }

    [Column("connection_ip")]
    [StringLength(45)]
    [Unicode(false)]
    public string? ConnectionIp { get; set; }

    [Column("connection_device")]
    [StringLength(100)]
    [Unicode(false)]
    public string? ConnectionDevice { get; set; }

    [ForeignKey("UserUuid")]
    [InverseProperty("UserConnections")]
    public virtual User UserUu { get; set; } = null!;
}

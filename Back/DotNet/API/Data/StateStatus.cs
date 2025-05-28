using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookAPI.Data;

[Table("STATE_STATUS")]
[Index("Code", Name = "UQ__STATE_ST__357D4CF97AED6E29", IsUnique = true)]
[Index("StateStatusUuid", Name = "UQ__STATE_ST__D70F46C3114A85F7", IsUnique = true)]
public partial class StateStatus
{
    [Key]
    [Column("state_status_id")]
    public int StateStatusId { get; set; }

    [Column("state_status_uuid")]
    public Guid StateStatusUuid { get; set; } = Guid.NewGuid();

    [Column("code")]
    [StringLength(50)]
    [Unicode(false)]
    public string Code { get; set; } = string.Empty;

    [Column("label")]
    [StringLength(255)]
    [Unicode(false)]
    public string Label { get; set; } = string.Empty;

    [InverseProperty("StateStatusUu")]
    public virtual ICollection<UserBookState> UserBookStates { get; set; } = new List<UserBookState>();
}

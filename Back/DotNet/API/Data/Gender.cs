using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

[Table("GENDERS")]
[Index("GenderUuid", Name = "UQ__GENDERS__8D9124A0A24F5DCA", IsUnique = true)]
public partial class Gender
{
    [Key]
    [Column("gender_id")]
    public int GenderId { get; set; }

    [Column("gender_uuid")]
    public Guid GenderUuid { get; set; } = Guid.NewGuid();

    [Column("gender_label")]
    [StringLength(20)]
    [Unicode(false)]
    public string GenderLabel { get; set; } = string.Empty;

    [InverseProperty("GenderUu")]
    public virtual ICollection<User> Users { get; set; } = new List<User>();
}

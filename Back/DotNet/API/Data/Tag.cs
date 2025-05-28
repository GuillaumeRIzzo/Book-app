using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookAPI.Data;

[Table("TAGS")]
[Index("TagUuid", Name = "UQ__TAGS__51EE2D564F39F24E", IsUnique = true)]
public partial class Tag
{
    [Key]
    [Column("tag_id")]
    public int TagId { get; set; }

    [Column("tag_uuid")]
    public Guid TagUuid { get; set; } = Guid.NewGuid();

    [Column("tag_label")]
    [StringLength(100)]
    [Unicode(false)]
    public string TagLabel { get; set; } = string.Empty;

    [ForeignKey("TagUuid")]
    [InverseProperty("TagUus")]
    public virtual ICollection<Book> BookUus { get; set; } = new List<Book>();
}

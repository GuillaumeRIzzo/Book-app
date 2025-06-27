using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Data;

[Table("AUTHOR_DISTINCTIONS")]
public partial class AuthorDistinction
{
    [Key]
    [Column("distinction_id")]
    public int DistinctionId { get; set; }

    [Column("distinction_uuid")]
    public Guid DistinctionUuid { get; set; } = Guid.NewGuid();

    [Column("author_uuid")]
    public Guid AuthorUuid { get; set; }

    [Column("distinction_label")]
    [StringLength(255)]
    [Unicode(false)]
    public string DistinctionLabel { get; set; } = string.Empty;

    [Column("distinction_date")]
    public DateTimeOffset DistinctionDate { get; set; }

    [Column("created_at")]
    public DateTimeOffset CreatedAt { get; set; }

    [Column("updated_at")]
    public DateTimeOffset UpdatedAt { get; set; }

    [ForeignKey("AuthorUuid")]
    [InverseProperty("AuthorDistinctions")]
    public virtual Author AuthorUu { get; set; } = null!;
}

using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookAPI.Data;

[Table("CATEGORIES")]
[Index("CategoryUuid", Name = "UQ__CATEGORI__4257ADA439886032", IsUnique = true)]
[Index("CategoryName", Name = "UQ__CATEGORI__5189E255F7D33FF3", IsUnique = true)]
public partial class Category
{
    [Key]
    [Column("category_id")]
    public int CategoryId { get; set; }

    [Column("category_uuid")]
    public Guid CategoryUuid { get; set; } = Guid.NewGuid();

    [Column("category_name")]
    [StringLength(100)]
    [Unicode(false)]
    public string CategoryName { get; set; } = null!;

    [Column("category_description", TypeName = "text")]
    public string CategoryDescription { get; set; } = string.Empty;

    [Column("image_url")]
    [StringLength(500)]
    [Unicode(false)]
    public string ImageUrl { get; set; } = null!;

    [Column("image_alt")]
    [StringLength(255)]
    [Unicode(false)]
    public string? ImageAlt { get; set; }

    [Column("created_at")]
    public DateTimeOffset CreatedAt { get; set; }

    [Column("updated_at")]
    public DateTimeOffset UpdatedAt { get; set; }

    [ForeignKey("CategoryUuid")]
    [InverseProperty("CategoryUus")]
    public virtual ICollection<Book> BookUus { get; set; } = new List<Book>();
}

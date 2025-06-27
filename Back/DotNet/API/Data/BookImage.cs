using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

[Table("BOOK_IMAGES")]
[Index("ImageUuid", Name = "UQ__BOOK_IMA__85A26DE847486D89", IsUnique = true)]
public partial class BookImage
{
    [Key]
    [Column("imageID")]
    public int ImageId { get; set; }

    [Column("image_uuid")]
    public Guid ImageUuid { get; set; } = Guid.NewGuid();

    [Column("book_uuid")]
    public Guid BookUuid { get; set; }

    [Column("image_url", TypeName = "text")]
    [Unicode(false)]
    public string ImageUrl { get; set; } = string.Empty;

    [Column("image_alt")]
    [StringLength(255)]
    [Unicode(false)]
    public string? ImageAlt { get; set; }

    [Column("is_cover")]
    public bool IsCover { get; set; }

    [Column("image_order")]
    public int? ImageOrder { get; set; }

    [Column("image_type_uuid")]
    public Guid ImageTypeUuid { get; set; }

    [Column("created_at")]
    public DateTimeOffset CreatedAt { get; set; }

    [Column("updated_at")]
    public DateTimeOffset UpdatedAt { get; set; }

    [ForeignKey("BookUuid")]
    [InverseProperty("BookImages")]
    public virtual Book BookUu { get; set; } = null!;

    [ForeignKey("ImageTypeUuid")]
    [InverseProperty("BookImages")]
    public virtual BookImageType ImageTypeUu { get; set; } = null!;
}

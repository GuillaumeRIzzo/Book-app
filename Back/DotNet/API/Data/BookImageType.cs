using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Data;

[Table("BOOK_IMAGE_TYPE")]
[Index("ImageTypeUuid", Name = "UQ__BOOK_IMA__3E43434813693BE3", IsUnique = true)]
public partial class BookImageType
{
    [Key]
    [Column("image_type_id")]
    public int ImageTypeId { get; set; }

    [Column("image_type_uuid")]
    public Guid ImageTypeUuid { get; set; } = Guid.NewGuid();

    [Column("label")]
    [StringLength(100)]
    [Unicode(false)]
    public string Label { get; set; } = string.Empty;

    [Column("description")]
    [StringLength(255)]
    [Unicode(false)]
    public string Description { get; set; } = string.Empty;

    [InverseProperty("ImageTypeUu")]
    public virtual ICollection<BookImage> BookImages { get; set; } = new List<BookImage>();
}

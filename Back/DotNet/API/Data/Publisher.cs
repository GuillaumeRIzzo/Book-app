using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Data;

[Table("PUBLISHER")]
[Index("PublisherUuid", Name = "UQ__PUBLISHE__F6E28EB939B4F790", IsUnique = true)]
public partial class Publisher
{
    [Key]
    [Column("publisher_id")]
    public int PublisherId { get; set; }

    [Column("publisher_uuid")]
    public Guid PublisherUuid { get; set; } = Guid.NewGuid();

    [Column("publisher_name")]
    [StringLength(255)]
    [Unicode(false)]
    public string PublisherName { get; set; } = null!;

    [Column("image_url")]
    [StringLength(500)]
    [Unicode(false)]
    public string ImageUrl { get; set; } = string.Empty;

    [Column("created_at")]
    public DateTimeOffset CreatedAt { get; set; }

    [Column("updated_at")]
    public DateTimeOffset UpdatedAt { get; set; }

    [ForeignKey("PublisherUuid")]
    [InverseProperty("PublisherUus")]
    public virtual ICollection<Book> BookUus { get; set; } = new List<Book>();

    [InverseProperty("PublisherUu")]
    public virtual ICollection<PublisherTranslation> PublisherTranslations { get; set; } = new List<PublisherTranslation>();
}

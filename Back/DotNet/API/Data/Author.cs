using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookAPI.Data;

[Table("AUTHOR")]
[Index("AuthorFullName", "AuthorBirthDate", Name = "UQ__AUTHOR__A1F124D0EC741F33", IsUnique = true)]
[Index("AuthorUuid", Name = "UQ__AUTHOR__B5CD0316F16E7C1F", IsUnique = true)]
public partial class Author
{
    [Key]
    [Column("author_id")]
    public int AuthorId { get; set; }

    [Column("author_uuid")]
    public Guid AuthorUuid { get; set; } = Guid.NewGuid();

    [Column("author_full_name")]
    [StringLength(100)]
    [Unicode(false)]
    public string AuthorFullName { get; set; } = string.Empty;

    [Column("author_birth_date")]
    public DateOnly? AuthorBirthDate { get; set; }

    [Column("author_birth_place")]
    [StringLength(100)]
    [Unicode(false)]
    public string? AuthorBirthPlace { get; set; }

    [Column("author_death_date")]
    public DateOnly? AuthorDeathDate { get; set; }

    [Column("author_death_place")]
    [StringLength(100)]
    [Unicode(false)]
    public string? AuthorDeathPlace { get; set; }

    [Column("author_bio", TypeName = "text")]
    public string? AuthorBio { get; set; }

    [Column("is_deleted")]
    public bool IsDeleted { get; set; } = false;

    [Column("created_at")]
    public DateTimeOffset CreatedAt { get; set; }

    [Column("updated_at")]
    public DateTimeOffset UpdatedAt { get; set; }

    [InverseProperty("AuthorUu")]
    public virtual ICollection<AuthorDistinction> AuthorDistinctions { get; set; } = new List<AuthorDistinction>();

    [InverseProperty("AuthorUu")]
    public virtual ICollection<AuthorLanguage> AuthorLanguages { get; set; } = new List<AuthorLanguage>();

    [ForeignKey("AuthorUuid")]
    [InverseProperty("AuthorUus")]
    public virtual ICollection<Book> BookUus { get; set; } = new List<Book>();
}

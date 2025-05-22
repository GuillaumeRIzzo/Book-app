using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BookAPI.Data;

[Table("LANGUAGES")]
[Index("IsoCode", Name = "UQ__LANGUAGE__153DD4A6953EA234", IsUnique = true)]
[Index("LanguageUuid", Name = "UQ__LANGUAGE__477450419696987E", IsUnique = true)]
public partial class Language
{
    [Key]
    [Column("language_id")]
    public int LanguageId { get; set; }

    [Column("language_uuid")]
    public Guid LanguageUuid { get; set; } = Guid.NewGuid();

    [Column("language_name")]
    [StringLength(100)]
    [Unicode(false)]
    public string LanguageName { get; set; } = string.Empty;

    [Column("iso_code")]
    [StringLength(10)]
    [Unicode(false)]
    public string IsoCode { get; set; } = string.Empty;

    [Column("is_default")]
    public bool IsDefault { get; set; }

    [InverseProperty("LanguageUu")]
    public virtual ICollection<AuthorLanguage> AuthorLanguages { get; set; } = new List<AuthorLanguage>();

    [InverseProperty("LanguageUu")]
    public virtual ICollection<BannedWord> BannedWords { get; set; } = new List<BannedWord>();

    [InverseProperty("LanguageUu")]
    public virtual ICollection<BookLanguage> BookLanguages { get; set; } = new List<BookLanguage>();

    [InverseProperty("LanguageUu")]
    public virtual ICollection<BookTranslation> BookTranslations { get; set; } = new List<BookTranslation>();

    [InverseProperty("LanguageUu")]
    public virtual ICollection<Preference> Preferences { get; set; } = new List<Preference>();
}

using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Data
{
    [Table("PUBLISHER_TRANSLATIONS")]
    [Index(nameof(PublisherUuid), nameof(LanguageUuid), IsUnique = true, Name = "UQ_PUBLISHER_TRANSLATION_PUB_LANG")]
    public partial class PublisherTranslation
    {
        [Key]
        [Column("publisher_translation_id")]
        public int PublisherTranslationId { get; set; }

        [Column("publisher_translation_uuid")]
        public Guid PublisherTranslationUuid { get; set; } = Guid.NewGuid();

        [Column("publisher_uuid")]
        public Guid PublisherUuid { get; set; }

        [Column("language_uuid")]
        public Guid LanguageUuid { get; set; }

        [Column("translated_name")]
        [StringLength(255)]
        [Unicode(false)]
        public string? TranslatedName { get; set; }

        [Column("created_at")]
        public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

        [Column("updated_at")]
        public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;

        [ForeignKey("PublisherUuid")]
        [InverseProperty("PublisherTranslations")]
        public virtual Publisher PublisherUu { get; set; } = null!;

        [ForeignKey("LanguageUuid")]
        [InverseProperty("PublisherTranslations")]
        public virtual Language LanguageUu { get; set; } = null!;
    }
}

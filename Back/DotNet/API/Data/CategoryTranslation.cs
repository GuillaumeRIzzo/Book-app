using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Data
{
    [Table("CATEGORY_TRANSLATIONS")]
    [Index(nameof(CategoryUuid), nameof(LanguageUuid), IsUnique = true, Name = "UQ_CATEGORY_TRANSLATION_CAT_LANG")]
    public partial class CategoryTranslation
    {
        [Key]
        [Column("category_translation_id")]
        public int CategoryTranslationId { get; set; }

        [Column("category_translation_uuid")]
        public Guid CategoryTranslationUuid { get; set; } = Guid.NewGuid();

        [Column("category_uuid")]
        public Guid CategoryUuid { get; set; }

        [Column("language_uuid")]
        public Guid LanguageUuid { get; set; }

        [Column("translated_name")]
        [StringLength(100)]
        [Unicode(false)]
        public string? TranslatedName { get; set; }

        [Column("translated_description", TypeName = "text")]
        public string? TranslatedDescription { get; set; }

        [Column("created_at")]
        public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

        [Column("updated_at")]
        public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;

        [ForeignKey("CategoryUuid")]
        [InverseProperty("CategoryTranslations")]
        public virtual Category CategoryUu { get; set; } = null!;

        [ForeignKey("LanguageUuid")]
        [InverseProperty("CategoryTranslations")]
        public virtual Language LanguageUu { get; set; } = null!;
    }
}

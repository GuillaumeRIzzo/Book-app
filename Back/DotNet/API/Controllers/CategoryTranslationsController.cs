using API.Data;
using API.Models;
using API.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryTranslationsController : ControllerBase
    {
        private readonly BookDbContext _context;

        public CategoryTranslationsController(BookDbContext context)
        {
            _context = context;
        }

        // GET: api/CategoryTranslations?categoryUuid=xxx&languageUuid=yyy
        [HttpGet]
        public async Task<ActionResult<EncryptedPayload>> GetTranslations([FromQuery] Guid? categoryUuid, [FromQuery] Guid? languageUuid)
        {
            if (!categoryUuid.HasValue && !languageUuid.HasValue)
            {
                return BadRequest("At least one of categoryUuid or languageUuid must be specified.");
            }

            var query = _context.CategoryTranslations.AsQueryable();

            if (categoryUuid.HasValue)
                query = query.Where(t => t.CategoryUuid == categoryUuid.Value);

            if (languageUuid.HasValue)
                query = query.Where(t => t.LanguageUuid == languageUuid.Value);

            var translations = await query.ToListAsync();

            if (translations.Count == 0)
                return NoContent();

            var model = translations.Select(t => new CategoryTranslationDto()
            {
                CategoryTranslationId = t.CategoryTranslationId,
                CategoryTranslationUuid = t.CategoryTranslationUuid,
                CategoryUuid = t.CategoryUuid,
                LanguageUuid = t.LanguageUuid,
                TranslatedName = t.TranslatedName,
                TranslatedDescription = t.TranslatedDescription,
                CreatedAt = t.CreatedAt,
                UpdatedAt = t.UpdatedAt
            }).ToList();

            var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

            return Ok(new EncryptedPayload
            {
                EncryptedData = encryptedData.EncryptedData,
                Iv = encryptedData.Iv
            });
        }

        // GET: api/CategoryTranslations/{uuid}
        [HttpGet("{uuid}")]
        public async Task<ActionResult<EncryptedPayload>> GetTranslation(Guid uuid)
        {
            var translation = await _context.CategoryTranslations.FirstOrDefaultAsync(t => t.CategoryTranslationUuid == uuid);

            if (translation == null)
                return NotFound();

            var model = new CategoryTranslationDto()
            {
                CategoryTranslationId = translation.CategoryTranslationId,
                CategoryTranslationUuid = translation.CategoryTranslationUuid,
                CategoryUuid = translation.CategoryUuid,
                LanguageUuid = translation.LanguageUuid,
                TranslatedName = translation.TranslatedName,
                TranslatedDescription = translation.TranslatedDescription,
                CreatedAt = translation.CreatedAt,
                UpdatedAt = translation.UpdatedAt
            };

            var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

            return Ok(new EncryptedPayload
            {
                EncryptedData = encryptedData.EncryptedData,
                Iv = encryptedData.Iv
            });
        }

        // POST: api/CategoryTranslations
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpPost]
        public async Task<ActionResult<EncryptedPayload>> PostTranslation(EncryptedPayload payload)
        {
            try
            {
                var decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var model = JsonSerializer.Deserialize<CategoryTranslationDto>(decryptedData);

                if (model == null)
                    return BadRequest("Invalid data.");

                // Check for existing translation for this category and language (unique constraint)
                bool exists = await _context.CategoryTranslations.AnyAsync(t =>
                    t.CategoryUuid == model.CategoryUuid &&
                    t.LanguageUuid == model.LanguageUuid);

                if (exists)
                    return BadRequest("A translation for this category and language already exists.");

                var translation = new API.Data.CategoryTranslation()
                {
                    CategoryTranslationUuid = Guid.NewGuid(),
                    CategoryUuid = model.CategoryUuid,
                    LanguageUuid = model.LanguageUuid,
                    TranslatedName = model.TranslatedName,
                    TranslatedDescription = model.TranslatedDescription,
                    CreatedAt = DateTimeOffset.UtcNow,
                    UpdatedAt = DateTimeOffset.UtcNow
                };

                _context.CategoryTranslations.Add(translation);
                await _context.SaveChangesAsync();

                model.CategoryTranslationId = translation.CategoryTranslationId;
                model.CategoryTranslationUuid = translation.CategoryTranslationUuid;
                model.CreatedAt = translation.CreatedAt;
                model.UpdatedAt = translation.UpdatedAt;

                return CreatedAtAction(nameof(GetTranslation), new { uuid = translation.CategoryTranslationUuid }, model);
            }
            catch (JsonException ex)
            {
                return BadRequest(new { message = "Invalid JSON format.", details = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred.", details = ex.Message });
            }
        }

        // PUT: api/CategoryTranslations/{uuid}
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpPut("{uuid}")]
        public async Task<IActionResult> PutTranslation(Guid uuid, EncryptedPayload payload)
        {
            try
            {
                var decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var model = JsonSerializer.Deserialize<CategoryTranslationDto>(decryptedData);

                if (model == null)
                    return BadRequest("Invalid data.");

                if (uuid != model.CategoryTranslationUuid)
                    return BadRequest("UUID mismatch.");

                var translation = await _context.CategoryTranslations.FirstOrDefaultAsync(t => t.CategoryTranslationUuid == uuid);

                if (translation == null)
                    return NotFound();

                // Optionally: check if there's another translation with the same CategoryUuid and LanguageUuid but different UUID (to maintain unique constraint)
                bool conflict = await _context.CategoryTranslations.AnyAsync(t =>
                    t.CategoryUuid == model.CategoryUuid &&
                    t.LanguageUuid == model.LanguageUuid &&
                    t.CategoryTranslationUuid != uuid);

                if (conflict)
                    return BadRequest("Another translation with the same category and language exists.");

                translation.TranslatedName = model.TranslatedName;
                translation.TranslatedDescription = model.TranslatedDescription;
                translation.UpdatedAt = DateTimeOffset.UtcNow;

                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (JsonException ex)
            {
                return BadRequest(new { message = "Invalid JSON format.", details = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred.", details = ex.Message });
            }
        }

        // DELETE: api/CategoryTranslations/{uuid}
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpDelete("{uuid}")]
        public async Task<IActionResult> DeleteTranslation(Guid uuid)
        {
            var translation = await _context.CategoryTranslations.FirstOrDefaultAsync(t => t.CategoryTranslationUuid == uuid);

            if (translation == null)
                return NotFound();

            _context.CategoryTranslations.Remove(translation);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}

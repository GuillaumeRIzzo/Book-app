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
    public class PublisherTranslationsController : ControllerBase
    {
        private readonly BookDbContext _context;

        public PublisherTranslationsController(BookDbContext context)
        {
            _context = context;
        }

        // GET: api/PublisherTranslations
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EncryptedPayload>>> GetPublisherTranslations()
        {
            var translations = await _context.PublisherTranslations.ToListAsync();

            if (translations.Count < 1)
                return NoContent();

            var model = translations.Select(t => new PublisherTranslationDto()
            {
                PublisherTranslationId = t.PublisherTranslationId,
                PublisherTranslationUuid = t.PublisherTranslationUuid,
                PublisherUuid = t.PublisherUuid,
                LanguageUuid = t.LanguageUuid,
                TranslatedName = t.TranslatedName,
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

        // GET: api/PublisherTranslations/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<EncryptedPayload>> GetPublisherTranslation(int id)
        {
            var translation = await _context.PublisherTranslations.FindAsync(id);

            if (translation == null)
                return NotFound();

            var model = new PublisherTranslationDto()
            {
                PublisherTranslationId = translation.PublisherTranslationId,
                PublisherTranslationUuid = translation.PublisherTranslationUuid,
                PublisherUuid = translation.PublisherUuid,
                LanguageUuid = translation.LanguageUuid,
                TranslatedName = translation.TranslatedName,
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

        // POST: api/PublisherTranslations
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpPost]
        public async Task<ActionResult<EncryptedPayload>> PostPublisherTranslation(EncryptedPayload payload)
        {
            try
            {
                var decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var model = JsonSerializer.Deserialize<PublisherTranslationDto>(decryptedData);

                if (model == null)
                    return BadRequest("Invalid data.");

                // Vérifier doublon sur PublisherUuid + LanguageUuid
                var exists = await _context.PublisherTranslations.AnyAsync(t =>
                    t.PublisherUuid == model.PublisherUuid && t.LanguageUuid == model.LanguageUuid);

                if (exists)
                    return BadRequest("Translation already exists for this publisher and language.");

                var translation = new PublisherTranslation()
                {
                    PublisherUuid = model.PublisherUuid,
                    LanguageUuid = model.LanguageUuid,
                    TranslatedName = model.TranslatedName,
                    CreatedAt = DateTimeOffset.UtcNow,
                    UpdatedAt = DateTimeOffset.UtcNow
                };

                _context.PublisherTranslations.Add(translation);
                await _context.SaveChangesAsync();

                model.PublisherTranslationId = translation.PublisherTranslationId;
                model.PublisherTranslationUuid = translation.PublisherTranslationUuid;
                model.CreatedAt = translation.CreatedAt;
                model.UpdatedAt = translation.UpdatedAt;

                var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

                return CreatedAtAction(nameof(GetPublisherTranslation), new { id = translation.PublisherTranslationId },
                    new EncryptedPayload
                    {
                        EncryptedData = encryptedData.EncryptedData,
                        Iv = encryptedData.Iv
                    });
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

        // PUT: api/PublisherTranslations/{id}
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPublisherTranslation(int id, EncryptedPayload payload)
        {
            try
            {
                var decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var model = JsonSerializer.Deserialize<PublisherTranslationDto>(decryptedData);

                if (model == null || id != model.PublisherTranslationId)
                    return BadRequest();

                var translation = await _context.PublisherTranslations.FindAsync(id);
                if (translation == null)
                    return NotFound();

                // Vérifier doublon si PublisherUuid ou LanguageUuid changent
                var duplicateExists = await _context.PublisherTranslations.AnyAsync(t =>
                    t.PublisherUuid == model.PublisherUuid &&
                    t.LanguageUuid == model.LanguageUuid &&
                    t.PublisherTranslationId != id);

                if (duplicateExists)
                    return BadRequest("Another translation exists with the same publisher and language.");

                translation.PublisherUuid = model.PublisherUuid;
                translation.LanguageUuid = model.LanguageUuid;
                translation.TranslatedName = model.TranslatedName;
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

        // DELETE: api/PublisherTranslations/{id}
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePublisherTranslation(int id)
        {
            var translation = await _context.PublisherTranslations.FindAsync(id);
            if (translation == null)
                return NotFound();

            _context.PublisherTranslations.Remove(translation);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
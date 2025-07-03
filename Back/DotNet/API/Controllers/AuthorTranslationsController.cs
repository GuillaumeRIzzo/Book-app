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
    public class AuthorTranslationsController : ControllerBase
    {
        private readonly BookDbContext _context;

        public AuthorTranslationsController(BookDbContext context)
        {
            _context = context;
        }

        // GET: api/AuthorTranslations
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EncryptedPayload>>> GetAuthorTranslations()
        {
            var translations = await _context.AuthorTranslations.ToListAsync();

            if (translations.Count < 1)
                return NoContent();

            var model = translations.Select(t => new AuthorTranslationDto()
            {
                AuthorTranslationId = t.AuthorTranslationId,
                AuthorTranslationUuid = t.AuthorTranslationUuid,
                AuthorUuid = t.AuthorUuid,
                LanguageUuid = t.LanguageUuid,
                AuthorBio = t.AuthorBio,
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

        // GET: api/AuthorTranslations/{uuid}
        [HttpGet("{uuid}")]
        public async Task<ActionResult<EncryptedPayload>> GetAuthorTranslation(Guid uuid)
        {
            var translation = await _context.AuthorTranslations
                .FirstOrDefaultAsync(t => t.AuthorTranslationUuid == uuid);

            if (translation == null)
                return NotFound();

            var model = new AuthorTranslationDto()
            {
                AuthorTranslationId = translation.AuthorTranslationId,
                AuthorTranslationUuid = translation.AuthorTranslationUuid,
                AuthorUuid = translation.AuthorUuid,
                LanguageUuid = translation.LanguageUuid,
                AuthorBio = translation.AuthorBio,
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

        // POST: api/AuthorTranslations
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpPost]
        public async Task<ActionResult<EncryptedPayload>> PostAuthorTranslation(EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);

                var model = JsonSerializer.Deserialize<AuthorTranslationDto>(decryptedData);

                if (model == null)
                    return BadRequest("Invalid data");

                // Optionnel : vérifier qu'on a pas déjà une traduction pour cet auteur + langue
                var exists = await _context.AuthorTranslations.AnyAsync(t =>
                    t.AuthorUuid == model.AuthorUuid &&
                    t.LanguageUuid == model.LanguageUuid);

                if (exists)
                    return BadRequest("Translation for this author and language already exists");

                var translation = new AuthorTranslation()
                {
                    AuthorTranslationUuid = model.AuthorTranslationUuid == Guid.Empty ? Guid.NewGuid() : model.AuthorTranslationUuid,
                    AuthorUuid = model.AuthorUuid,
                    LanguageUuid = model.LanguageUuid,
                    AuthorBio = model.AuthorBio,
                    CreatedAt = DateTimeOffset.UtcNow,
                    UpdatedAt = DateTimeOffset.UtcNow,
                };

                _context.AuthorTranslations.Add(translation);
                await _context.SaveChangesAsync();

                // Retourner la traduction créée (non chiffrée ici mais on peut chiffrer)
                model.AuthorTranslationId = translation.AuthorTranslationId;
                model.AuthorTranslationUuid = translation.AuthorTranslationUuid;
                model.CreatedAt = translation.CreatedAt;
                model.UpdatedAt = translation.UpdatedAt;

                var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

                return CreatedAtAction(nameof(GetAuthorTranslation), new { uuid = translation.AuthorTranslationUuid }, new EncryptedPayload
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

        // PUT: api/AuthorTranslations/{uuid}
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpPut("{uuid}")]
        public async Task<IActionResult> PutAuthorTranslation(Guid uuid, EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);

                var model = JsonSerializer.Deserialize<AuthorTranslationDto>(decryptedData);

                if (model == null || uuid != model.AuthorTranslationUuid)
                    return BadRequest();

                var translation = await _context.AuthorTranslations
                    .FirstOrDefaultAsync(t => t.AuthorTranslationUuid == uuid);

                if (translation == null)
                    return NotFound();

                translation.AuthorBio = model.AuthorBio;
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

        // DELETE: api/AuthorTranslations/{uuid}
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpDelete("{uuid}")]
        public async Task<IActionResult> DeleteAuthorTranslation(Guid uuid)
        {
            var translation = await _context.AuthorTranslations
                .FirstOrDefaultAsync(t => t.AuthorTranslationUuid == uuid);

            if (translation == null)
                return NotFound();

            _context.AuthorTranslations.Remove(translation);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}

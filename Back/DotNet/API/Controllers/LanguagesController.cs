using BookAPI.Data;
using BookAPI.Models;
using BookAPI.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace BookAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LanguagesController : ControllerBase
    {
        private readonly BookDbContext _context;

        public LanguagesController(BookDbContext context)
        {
            _context = context;
        }

        // GET: api/Languages
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EncryptedPayload>>> GetLanguages()
        {
            var languages = await _context.Languages.ToListAsync();

            if (languages.Count >= 1)
            {
                var model = languages.Select(x => new LanguageDto()
                {
                    LanguageId = x.LanguageId,
                    LanguageUuid = x.LanguageUuid,
                    LanguageName = x.LanguageName,
                    IsoCode = x.IsoCode,
                    IsDefault = x.IsDefault,
                }).ToList();
                // Encrypt the list of languages
                var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

                return Ok(new EncryptedPayload
                {
                    EncryptedData = encryptedData.EncryptedData,
                    Iv = encryptedData.Iv
                });
            }

            return NoContent();
        }

        // GET: api/Languages/5
        [HttpGet("{uuid}")]
        public async Task<ActionResult<EncryptedPayload>> GetLanguage(Guid uuid)
        {
            var language = await _context.Languages.FirstOrDefaultAsync(l => l.LanguageUuid == uuid);

            if (language == null)
            {
                return NotFound();
            }

            var model = new LanguageDto()
            {
                LanguageId = language.LanguageId,
                LanguageUuid = language.LanguageUuid,
                LanguageName = language.LanguageName,
                IsoCode = language.IsoCode,
                IsDefault = language.IsDefault,
            };

            // Encrypt the list of languages
            var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

            return Ok(new EncryptedPayload
            {
                EncryptedData = encryptedData.EncryptedData,
                Iv = encryptedData.Iv
            });
        }

        // PUT: api/Languages/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult<EncryptedPayload>> PutLanguage(Guid id, EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true // Enable case-insensitive matching
                };
                var model = JsonSerializer.Deserialize<LanguageDto>(decryptedData, options);

                if (model == null) { return NotFound(); }

                if (id != model.LanguageUuid)
                {
                    return BadRequest();
                }

                if (LanguageNameExists(model.LanguageName, id))
                {
                    return BadRequest("Name already exists");
                }

                if (LanguageCodeExists(model.IsoCode, id))
                {
                    return BadRequest("Iso code already exists");
                }

                var language = await _context.Languages.FindAsync(id);

                if (language != null)
                {
                    language.LanguageId = model.LanguageId;
                    language.LanguageUuid = model.LanguageUuid;
                    language.LanguageName = model.LanguageName;
                    language.IsoCode = model.IsoCode;
                    language.IsDefault = model.IsDefault;
                }

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!LanguageExists(id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }

                return NoContent();
            }
            catch (JsonException ex)
            {
                // Handle JSON deserialization errors
                return BadRequest(new { message = "Invalid JSON format.", details = ex.Message });
            }
            catch (Exception ex)
            {
                // Handle other errors
                return StatusCode(500, new { message = "An error occurred.", details = ex.Message });
            }
        }

        // POST: api/Languages
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<EncryptedPayload>> PostLanguage(EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var model = JsonSerializer.Deserialize<LanguageDto>(decryptedData);

                if (model == null)
                {
                    return NoContent();
                }

                if (LanguageNameExists(model.LanguageName, Guid.Empty))
                {
                    return BadRequest("Name already exists");
                }

                if (LanguageCodeExists(model.IsoCode, Guid.Empty))
                {
                    return BadRequest("Iso code already exists");
                }

                var language = new Language()
                {
                    LanguageName = model.LanguageName,
                    IsoCode = model.IsoCode,
                    IsDefault = model.IsDefault,
                };

                _context.Languages.Add(language);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetLanguage", new { uuid = model.LanguageUuid }, model);
            }
            catch (JsonException ex)
            {
                // Handle JSON deserialization errors
                return BadRequest(new { message = "Invalid JSON format.", details = ex.Message });
            }
            catch (Exception ex)
            {
                // Handle other errors
                return StatusCode(500, new { message = "An error occurred.", details = ex.Message });
            }

        }

        // DELETE: api/Languages/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLanguage(int id)
        {
            var language = await _context.Languages.FindAsync(id);
            if (language == null)
            {
                return NotFound();
            }

            _context.Languages.Remove(language);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool LanguageExists(Guid id)
        {
            return _context.Languages.Any(e => e.LanguageUuid == id);
        }

        private bool LanguageNameExists(string name, Guid id)
        {
            return _context.Languages.Any(p => p.LanguageName == name && p.LanguageUuid != id);
        }
        private bool LanguageCodeExists(string code, Guid id)
        {
            return _context.Languages.Any(p => p.IsoCode == code && p.LanguageUuid != id);
        }
    }
}

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
    public class BookTranslationsController : ControllerBase
    {
        private readonly BookDbContext _context;

        public BookTranslationsController(BookDbContext context)
        {
            _context = context;
        }

        // GET: api/BookTranslations
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EncryptedPayload>>> GetBookTranslations()
        {
            var translations = await _context.BookTranslations.ToListAsync();

            if (translations.Count >= 1)
            {
                var model = translations.Select(x => new BookTranslationDto()
                {
                    BookTranslationId = x.BookTranslationId,
                    BookTranslationUuid = x.BookTranslationUuid,
                    Title = x.Title,
                    Summary = x.Summary,
                    CreatedAt = x.CreatedAt,
                    UpdatedAt = x.UpdatedAt,
                    BookUuid = x.BookUuid,
                    LanguageUuid = x.LanguageUuid,
                }).ToList();
                // Encrypt the list of translations
                var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

                return Ok(new EncryptedPayload
                {
                    EncryptedData = encryptedData.EncryptedData,
                    Iv = encryptedData.Iv
                });
            }

            return NoContent();
        }

        // GET: api/BookTranslations/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EncryptedPayload>> GetBookTranslation(Guid id)
        {
            var translation = await _context.BookTranslations.FindAsync(id);

            if (translation == null)
            {
                return NotFound();
            }

            var model = new BookTranslationDto()
            {
                BookTranslationId = translation.BookTranslationId,
                BookTranslationUuid = translation.BookTranslationUuid,
                Title = translation.Title,
                Summary = translation.Summary,
                CreatedAt = translation.CreatedAt,
                UpdatedAt = translation.UpdatedAt,
                BookUuid = translation.BookUuid,
                LanguageUuid = translation.LanguageUuid,
            };

            // Encrypt the list of translations
            var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

            return Ok(new EncryptedPayload
            {
                EncryptedData = encryptedData.EncryptedData,
                Iv = encryptedData.Iv
            });
        }

        // PUT: api/BookTranslations/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult<EncryptedPayload>> PutBookTranslation(Guid id, EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true // Enable case-insensitive matching
                };
                var model = JsonSerializer.Deserialize<BookTranslationDto>(decryptedData, options);

                if (model == null) { return NotFound(); }

                if (id != model.BookTranslationUuid)
                {
                    return BadRequest();
                }

                var translation = await _context.BookTranslations.FindAsync(id);

                if (translation != null)
                {
                    translation.BookTranslationId = model.BookTranslationId;
                    translation.BookTranslationUuid = model.BookTranslationUuid;
                    translation.Title = model.Title;
                    translation.Summary = model.Summary;
                    translation.CreatedAt = model.CreatedAt;
                    translation.UpdatedAt = DateTimeOffset.UtcNow;
                    translation.BookUuid = model.BookUuid;
                    translation.LanguageUuid = model.LanguageUuid;
                }

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!BookTranslationExists(id))
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

        // POST: api/BookTranslations
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<EncryptedPayload>> PostBookTranslation(EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var model = JsonSerializer.Deserialize<BookTranslationDto>(decryptedData);

                if (model == null)
                {
                    return NoContent();
                }

                var translation = new BookTranslation()
                {
                    Title = model.Title,
                    Summary = model.Summary,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    BookUuid = model.BookUuid,
                    LanguageUuid = model.LanguageUuid,
                };

                _context.BookTranslations.Add(translation);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetBookTranslation", new { id = model.BookTranslationUuid}, model);
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

        // DELETE: api/BookTranslations/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBookTranslation(int id)
        {
            var translation = await _context.BookTranslations.FindAsync(id);
            if (translation == null)
            {
                return NotFound();
            }

            _context.BookTranslations.Remove(translation);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BookTranslationExists(Guid id)
        {
            return _context.BookTranslations.Any(e => e.BookTranslationUuid == id);
        }
    }
}

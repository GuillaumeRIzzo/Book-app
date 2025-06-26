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
    public class BookLanguagesController : ControllerBase
    {
        private readonly BookDbContext _context;

        public BookLanguagesController(BookDbContext context)
        {
            _context = context;
        }

        // GET: api/BookLanguages
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EncryptedPayload>>> GetBookLanguages()
        {
            var bLanguages = await _context.BookLanguages.ToListAsync();

            if (bLanguages.Count >= 1)
            {
                var model = bLanguages.Select(x => new BookLanguageDto()
                {
                   BookUuid = x.BookUuid,
                   LanguageUuid = x.LanguageUuid,
                   CreatedAt = x.CreatedAt,
                   UpdatedAt = x.UpdatedAt

                }).ToList();

                // Encrypt the list of bLanguages
                var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

                return Ok(new EncryptedPayload
                {
                    EncryptedData = encryptedData.EncryptedData,
                    Iv = encryptedData.Iv
                });
            }
            return NoContent();
        }

        // GET: api/BookLanguages/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EncryptedPayload>> GetBookLanguage(Guid bookUuid, Guid languageUuid)
        {
            var bLanguage = await _context.BookLanguages.FindAsync(bookUuid, languageUuid);

            if (bLanguage == null)
            {
                return NotFound();
            }

            var model = new BookLanguageDto()
            {
                BookUuid = bLanguage.BookUuid,
                LanguageUuid = bLanguage.LanguageUuid,
                CreatedAt = bLanguage.CreatedAt,
                UpdatedAt = bLanguage.UpdatedAt
            };

            // Encrypt the bLanguage data
            var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

            return Ok(new EncryptedPayload
            {
                EncryptedData = encryptedData.EncryptedData,
                Iv = encryptedData.Iv
            });
        }

        // PUT: api/BookLanguages/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBookLanguage(Guid bookUuid, Guid languageUuid, EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true // Enable case-insensitive matching
                };
                var model = JsonSerializer.Deserialize<BookLanguageDto>(decryptedData, options);

                if (model == null) { return NotFound(); }

                if (bookUuid != model.BookUuid && languageUuid != model.LanguageUuid)
                {
                    return BadRequest();
                }

                var bLanguage = await _context.BookLanguages.FindAsync(bookUuid, languageUuid);

                if (bLanguage != null)
                {
                    bLanguage.BookUuid = model.BookUuid;
                    bLanguage.LanguageUuid = model.LanguageUuid;
                    bLanguage.CreatedAt = model.CreatedAt;
                    bLanguage.UpdatedAt = DateTimeOffset.UtcNow;
                }

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!BookLanguageExists(bookUuid, languageUuid))
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

        // POST: api/BookLanguages
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpPost]
        public async Task<ActionResult<EncryptedPayload>> PostBookLanguage(EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var model = JsonSerializer.Deserialize<BookLanguageDto>(decryptedData);

                if (model == null)
                {
                    return NoContent();
                }

                var bLanguage = new BookLanguage()
                {
                    CreatedAt = DateTimeOffset.UtcNow,
                    UpdatedAt = DateTimeOffset.UtcNow,
                };

                _context.BookLanguages.Add(bLanguage);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetBookLanguage", new { bookUuid = model.BookUuid, languageUuid = model.LanguageUuid }, model);
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

        // DELETE: api/BookLanguages/5
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBookLanguage(int id)
        {
            var bLanguage = await _context.BookLanguages.FindAsync(id);
            if (bLanguage == null)
            {
                return NotFound();
            }

            _context.BookLanguages.Remove(bLanguage);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BookLanguageExists(Guid bookUuid, Guid languageUuid)
        {
            return _context.BookLanguages.Any(e => e.BookUuid == bookUuid && e.LanguageUuid == languageUuid);
        }
    }
}

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
    public class AuthorLanguagesController : ControllerBase
    {
        private readonly BookDbContext _context;

        public AuthorLanguagesController(BookDbContext context)
        {
            _context = context;
        }

        // GET: api/AuthorLanguages
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EncryptedPayload>>> GetAuthorLanguages()
        {
            var alanguages = await _context.AuthorLanguages.ToListAsync();

            if (alanguages.Count >= 1)
            {
                var model = alanguages.Select(x => new AuthorLanguageDto()
                {
                    AuthorUuid = x.AuthorUuid,
                    LanguageUuid = x.LanguageUuid,
                    IsPrimaryLanguage = x.IsPrimaryLanguage,
                    AddedAt = x.AddedAt,

                }).ToList();

                // Encrypt the list of alanguages
                var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

                return Ok(new EncryptedPayload
                {
                    EncryptedData = encryptedData.EncryptedData,
                    Iv = encryptedData.Iv
                });
            }
            return NoContent();
        }

        // GET: api/AuthorLanguages/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EncryptedPayload>> GetAuthorLanguage(Guid authorUuid, Guid languageUuid)
        {
            var alanguage = await _context.AuthorLanguages.FindAsync(authorUuid, languageUuid);

            if (alanguage == null)
            {
                return NotFound();
            }

            var model = new AuthorLanguageDto()
            {
                AuthorUuid = alanguage.AuthorUuid,
                LanguageUuid = alanguage.LanguageUuid,
                IsPrimaryLanguage = alanguage.IsPrimaryLanguage,
                AddedAt = alanguage.AddedAt,
            };

            // Encrypt the alanguage data
            var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

            return Ok(new EncryptedPayload
            {
                EncryptedData = encryptedData.EncryptedData,
                Iv = encryptedData.Iv
            });
        }

        // PUT: api/AuthorLanguages/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAuthorLanguage(Guid authorUuid, Guid languageUuid, EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true // Enable case-insensitive matching
                };
                var model = JsonSerializer.Deserialize<AuthorLanguageDto>(decryptedData, options);

                if (model == null) { return NotFound(); }

                if (authorUuid != model.AuthorUuid && languageUuid != model.LanguageUuid)
                {
                    return BadRequest();
                }

                var alanguage = await _context.AuthorLanguages.FindAsync(authorUuid, languageUuid);

                if (alanguage != null)
                {
                    alanguage.AuthorUuid = model.AuthorUuid;
                    alanguage.LanguageUuid = model.LanguageUuid;
                    alanguage.IsPrimaryLanguage = model.IsPrimaryLanguage;
                    alanguage.AddedAt = model.AddedAt;
                }

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!AuthorLanguageExists(authorUuid, languageUuid))
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

        // POST: api/AuthorLanguages
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpPost]
        public async Task<ActionResult<EncryptedPayload>> PostAuthorLanguage(EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var model = JsonSerializer.Deserialize<AuthorLanguageDto>(decryptedData);

                if (model == null)
                {
                    return NoContent();
                }

                var alanguage = new AuthorLanguage()
                {
                    AuthorUuid = model.AuthorUuid,
                    LanguageUuid = model.LanguageUuid,
                    IsPrimaryLanguage = model.IsPrimaryLanguage,
                    AddedAt = DateTimeOffset.UtcNow,
                    
                };

                _context.AuthorLanguages.Add(alanguage);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetAuthorLanguage", new { authorUuid  = model.AuthorUuid, languageUuid = model.LanguageUuid} ,  model);
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

        // DELETE: api/AuthorLanguages/5
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAuthor(int id)
        {
            var alanguage = await _context.AuthorLanguages.FindAsync(id);
            if (alanguage == null)
            {
                return NotFound();
            }

            _context.AuthorLanguages.Remove(alanguage);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AuthorLanguageExists(Guid authorUuid, Guid languageUuid)
        {
            return _context.AuthorLanguages.Any(e => e.AuthorUuid == authorUuid && e.LanguageUuid == languageUuid);
        }
    }
}

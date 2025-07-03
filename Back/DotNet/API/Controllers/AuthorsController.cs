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
    public class AuthorsController : ControllerBase
    {
        private readonly BookDbContext _context;

        public AuthorsController(BookDbContext context)
        {
            _context = context;
        }

        // GET: api/Authors?languageUuid=...
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EncryptedPayload>>> GetAuthors([FromQuery] Guid? languageUuid = null)
        {
            // Inclure les traductions pour éviter les requêtes multiples
            var authors = await _context.Authors
                .Include(a => a.AuthorTranslations)
                .ToListAsync();

            if (authors.Count < 1)
                return NoContent();

            var model = authors.Select(a =>
            {
                // Trouver la traduction selon languageUuid s’il est donné
                var translation = languageUuid.HasValue
                    ? a.AuthorTranslations.FirstOrDefault(t => t.LanguageUuid == languageUuid.Value)
                    : null;

                return new AuthorDto
                {
                    AuthorId = a.AuthorId,
                    AuthorUuid = a.AuthorUuid,
                    AuthorFullName = a.AuthorFullName,
                    AuthorBirthDate = a.AuthorBirthDate,
                    AuthorBirthPlace = a.AuthorBirthPlace,
                    AuthorDeathDate = a.AuthorDeathDate,
                    AuthorDeathPlace = a.AuthorDeathPlace,
                    // Utiliser la bio traduite si disponible, sinon la bio originale
                    AuthorBio = translation?.AuthorBio ?? a.AuthorBio,
                    IsDeleted = a.IsDeleted,
                    CreatedAt = a.CreatedAt,
                    UpdatedAt = a.UpdatedAt,
                };
            }).ToList();

            var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

            return Ok(new EncryptedPayload
            {
                EncryptedData = encryptedData.EncryptedData,
                Iv = encryptedData.Iv
            });
        }

        // GET: api/Authors/{uuid}?languageUuid=...
        [HttpGet("{uuid}")]
        public async Task<ActionResult<EncryptedPayload>> GetAuthor(Guid uuid, [FromQuery] Guid? languageUuid = null)
        {
            var author = await _context.Authors
                .Include(a => a.AuthorTranslations)
                .FirstOrDefaultAsync(a => a.AuthorUuid == uuid);

            if (author == null)
                return NotFound();

            var translation = languageUuid.HasValue
                ? author.AuthorTranslations.FirstOrDefault(t => t.LanguageUuid == languageUuid.Value)
                : null;

            var model = new AuthorDto
            {
                AuthorId = author.AuthorId,
                AuthorUuid = author.AuthorUuid,
                AuthorFullName = author.AuthorFullName,
                AuthorBirthDate = author.AuthorBirthDate,
                AuthorBirthPlace = author.AuthorBirthPlace,
                AuthorDeathDate = author.AuthorDeathDate,
                AuthorDeathPlace = author.AuthorDeathPlace,
                AuthorBio = translation?.AuthorBio ?? author.AuthorBio,
                IsDeleted = author.IsDeleted,
                CreatedAt = author.CreatedAt,
                UpdatedAt = author.UpdatedAt,
            };

            var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

            return Ok(new EncryptedPayload
            {
                EncryptedData = encryptedData.EncryptedData,
                Iv = encryptedData.Iv
            });
        }

        // PUT: api/Authors/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAuthor(Guid id, EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true // Enable case-insensitive matching
                };
                var model = JsonSerializer.Deserialize<AuthorDto>(decryptedData, options);

                if (model == null) { return NotFound(); }

                if (id != model.AuthorUuid)
                {
                    return BadRequest();
                }

                if (AuthorFullNameExists(model.AuthorFullName, id))
                {
                    return BadRequest("Name already exists");
                }

                var author = await _context.Authors.FindAsync(id);

                if (author != null)
                {
                    author.AuthorFullName = model.AuthorFullName;
                    author.AuthorBirthDate = model.AuthorBirthDate;
                    author.AuthorBirthPlace = model.AuthorBirthPlace;
                    author.AuthorDeathDate = model.AuthorDeathDate;
                    author.AuthorDeathPlace = model.AuthorDeathPlace;
                    author.AuthorBio = model.AuthorBio;
                    author.IsDeleted = model.IsDeleted;
                    author.CreatedAt = model.CreatedAt;
                    author.UpdatedAt = model.UpdatedAt;
                }

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!AuthorExists(id))
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

        // POST: api/Authors
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpPost]
        public async Task<ActionResult<EncryptedPayload>> PostAuthor(EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var model = JsonSerializer.Deserialize<AuthorDto>(decryptedData);

                if (model == null)
                {
                    return NoContent();
                }

                if (AuthorFullNameExists(model.AuthorFullName, Guid.Empty))
                {
                    return BadRequest("Name already exists");
                }

                var author = new Author()
                {
                    AuthorUuid = model.AuthorUuid,
                    AuthorFullName = model.AuthorFullName,
                    AuthorBirthDate = model.AuthorBirthDate,
                    AuthorBirthPlace = model.AuthorBirthPlace,
                    AuthorDeathDate = model.AuthorDeathDate,
                    AuthorDeathPlace = model.AuthorDeathPlace,
                    AuthorBio = model.AuthorBio,
                    IsDeleted = model.IsDeleted,
                    CreatedAt = model.CreatedAt,
                    UpdatedAt = model.UpdatedAt,
                };

                _context.Authors.Add(author);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetAuthor", new { id = model.AuthorUuid }, model);
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

        // DELETE: api/Authors/5
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAuthor(int id)
        {
            var author = await _context.Authors.FindAsync(id);
            if (author == null)
            {
                return NotFound();
            }

            _context.Authors.Remove(author);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AuthorExists(Guid id)
        {
            return _context.Authors.Any(e => e.AuthorUuid == id);
        }

        private bool AuthorFullNameExists(string name, Guid id)
        {
            return _context.Authors.Any(a => a.AuthorFullName == name && a.AuthorUuid != id);
        }
    }
}

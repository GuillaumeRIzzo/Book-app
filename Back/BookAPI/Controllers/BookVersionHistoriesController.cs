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
    public class BookVersionHistoriesController : ControllerBase
    {
        private readonly BookDbContext _context;

        public BookVersionHistoriesController(BookDbContext context)
        {
            _context = context;
        }

        // GET: api/BookVersionHistories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EncryptedPayload>>> GetBookVersionHistories()
        {
            var versions = await _context.BookVersionHistories.ToListAsync();

            if (versions.Count >= 1)
            {
                var model = versions.Select(x => new BookVersionHistoryDto()
                {
                   VersionId = x.VersionId,
                   VersionUuid = x.VersionUuid,
                   BookUuid = x.BookUuid,
                   UserUuid = x.UserUuid,
                   ChangeDate = x.ChangeDate,
                   VersionDescription = x.VersionDescription,
                }).ToList();

                // Encrypt the list of versions
                var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

                return Ok(new EncryptedPayload
                {
                    EncryptedData = encryptedData.EncryptedData,
                    Iv = encryptedData.Iv
                });
            }
            return NoContent();
        }

        // GET: api/BookVersionHistories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EncryptedPayload>> GetBookVersionHistory(Guid id)
        {
            var version = await _context.BookVersionHistories.FindAsync(id);

            if (version == null)
            {
                return NotFound();
            }

            var model = new BookVersionHistoryDto()
            {
                VersionId = version.VersionId,
                VersionUuid = version.VersionUuid,
                BookUuid = version.BookUuid,
                UserUuid = version.UserUuid,
                ChangeDate = version.ChangeDate,
                VersionDescription = version.VersionDescription,
            };

            // Encrypt the version data
            var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

            return Ok(new EncryptedPayload
            {
                EncryptedData = encryptedData.EncryptedData,
                Iv = encryptedData.Iv
            });
        }

        // PUT: api/BookVersionHistories/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBookVersionHistorie(Guid id, EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true // Enable case-insensitive matching
                };
                var model = JsonSerializer.Deserialize<BookVersionHistoryDto>(decryptedData, options);

                if (model == null) { return NotFound(); }

                if (id != model.VersionUuid)
                {
                    return BadRequest();
                }

                var version = await _context.BookVersionHistories.FindAsync(id);

                if (version != null)
                {
                    version.BookUuid = model.BookUuid;
                    version.UserUuid = model.UserUuid;
                    version.VersionDescription = model.VersionDescription;
                    version.ChangeDate = DateTimeOffset.UtcNow;
                }

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!BookVersionHistorieExists(id))
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

        // POST: api/BookVersionHistories
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpPost]
        public async Task<ActionResult<EncryptedPayload>> PostBookVersionHistorie(EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var model = JsonSerializer.Deserialize<BookVersionHistoryDto>(decryptedData);

                if (model == null)
                {
                    return NoContent();
                }

                var version = new BookVersionHistory()
                {
                    BookUuid = model.BookUuid,
                    UserUuid = model.UserUuid,
                    ChangeDate = DateTime.UtcNow,
                    VersionDescription = model.VersionDescription,
                };

                _context.BookVersionHistories.Add(version);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetBookVersionHistorie", model.VersionUuid, model);
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

        // DELETE: api/BookVersionHistories/5
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBookVersionHistorie(int id)
        {
            var version = await _context.BookVersionHistories.FindAsync(id);
            if (version == null)
            {
                return NotFound();
            }

            _context.BookVersionHistories.Remove(version);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BookVersionHistorieExists(Guid id)
        {
            return _context.BookVersionHistories.Any(e => e.VersionUuid == id);
        }
    }
}

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
    public class AuthorDistinctionsController : ControllerBase
    {
        private readonly BookDbContext _context;

        public AuthorDistinctionsController(BookDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<EncryptedPayload>>> GetAuthorDistinctions()
        {
            var distinctions = await _context.AuthorDistinctions.ToListAsync();

            if (distinctions.Count >= 1)
            {
                var model = distinctions.Select(x => new AuthorDistinctionDto()
                {
                    DistinctionId = x.DistinctionId,
                    DistinctionUuid = x.DistinctionUuid,
                    DistinctionLabel = x.DistinctionLabel,
                    DistinctionDate = x.DistinctionDate,
                    CreatedAt = x.CreatedAt,
                    UpdatedAt = x.UpdatedAt,
                    AuthorUuid = x.AuthorUuid,
                }).ToList();

                // Encrypt the list of author distinctions
                var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

                return Ok(new EncryptedPayload
                {
                    EncryptedData = encryptedData.EncryptedData,
                    Iv = encryptedData.Iv
                });
            }

            return NoContent();
        }

        // GET: api/AuthorDistinctions/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EncryptedPayload>> GetAuthorDistinction(Guid id)
        {
            var distinctions = await _context.AuthorDistinctions.FindAsync(id);

            if (distinctions == null)
            {
                return NotFound();
            }

            var model = new AuthorDistinctionDto()
            {
                DistinctionId = distinctions.DistinctionId,
                DistinctionUuid = distinctions .DistinctionUuid,
                DistinctionLabel = distinctions.DistinctionLabel,
                DistinctionDate = distinctions.DistinctionDate,
                CreatedAt = distinctions.CreatedAt,
                UpdatedAt = distinctions.UpdatedAt,
                AuthorUuid = distinctions.AuthorUuid,
            };

            // Encrypt the activity type data
            var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

            return Ok(new EncryptedPayload
            {
                EncryptedData = encryptedData.EncryptedData,
                Iv = encryptedData.Iv
            });
        }

        // PUT: api/AuthorDistinctions/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpPut("{id}")]
        public async Task<ActionResult<EncryptedPayload>> PutAuthorDistinction(Guid id, EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true // Enable case-insensitive matching
                };
                var model = JsonSerializer.Deserialize<AuthorDistinctionDto>(decryptedData, options);

                if (model == null) { return NotFound(); }

                if (id != model.DistinctionUuid)
                {
                    return BadRequest();
                }

                var distinctions = await _context.AuthorDistinctions.FindAsync(id);

                if (distinctions == null)
                {
                    return NotFound();
                }

                distinctions.DistinctionId = model.DistinctionId;
                distinctions.DistinctionUuid = model.DistinctionUuid;
                distinctions.DistinctionLabel = model.DistinctionLabel;
                distinctions.DistinctionDate = model.DistinctionDate;
                distinctions.CreatedAt = model.CreatedAt;
                distinctions.UpdatedAt = model.UpdatedAt;
                distinctions.AuthorUuid = model.AuthorUuid;


                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!AuthorDistinctionExists(model.DistinctionUuid))
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

        // POST: api/AuthorDistinctions
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpPost]
        public async Task<ActionResult<EncryptedPayload>> PostAuthorDistinction(EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true // Enable case-insensitive matching
                };
                var model = JsonSerializer.Deserialize<AuthorDistinctionDto>(decryptedData, options);


                if (model == null)
                {
                    return NoContent();
                }

                var distinctions = new AuthorDistinction()
                {
                    DistinctionLabel = model.DistinctionLabel,
                    DistinctionDate = model.DistinctionDate,
                    CreatedAt = new DateTimeOffset(),
                    UpdatedAt = new DateTimeOffset(),
                    AuthorUuid = model.AuthorUuid,
                };

                _context.AuthorDistinctions.Add(distinctions);
                await _context.SaveChangesAsync();

                model.DistinctionId = distinctions.DistinctionId;

                return CreatedAtAction("GetBook", new { id = model.DistinctionUuid }, model);
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

        // DELETE: api/AuthorDistinctions/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAuthorDistinction(int id)
        {
            var distinctions = await _context.AuthorDistinctions.FindAsync(id);
            if (distinctions == null)
            {
                return NotFound();
            }

            _context.AuthorDistinctions.Remove(distinctions);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AuthorDistinctionExists(Guid id)
        {
            return _context.AuthorDistinctions.Any(e => e.DistinctionUuid == id);
        }
    }
}

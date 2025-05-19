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
    public class BookImageTypesController : ControllerBase
    {
        private readonly BookDbContext _context;

        public BookImageTypesController(BookDbContext context)
        {
            _context = context;
        }

        // GET: api/BookImageTypes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EncryptedPayload>>> GetBookImageTypes()
        {
            var bookImageTypeType = await _context.BookImageTypes.ToListAsync();

            if (bookImageTypeType.Count >= 1)
            {
                var model = bookImageTypeType.Select(x => new BookImageTypeDto()
                {
                    ImageTypeId = x.ImageTypeId,
                    ImageTypeUuid = x.ImageTypeUuid,
                    Label = x.Label,

                }).ToList();

                // Encrypt the list of bookImageTypeType
                var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

                return Ok(new EncryptedPayload
                {
                    EncryptedData = encryptedData.EncryptedData,
                    Iv = encryptedData.Iv
                });
            }
            return NoContent();
        }

        // GET: api/BookImageTypes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EncryptedPayload>> GetBookImageType(Guid id)
        {
            var bookImageType = await _context.BookImageTypes.FindAsync(id);

            if (bookImageType == null)
            {
                return NotFound();
            }

            var model = new BookImageTypeDto()
            {
                ImageTypeId = bookImageType.ImageTypeId,
                ImageTypeUuid = bookImageType.ImageTypeUuid,
                Label = bookImageType.Label,
            };

            // Encrypt the bookImageType data
            var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

            return Ok(new EncryptedPayload
            {
                EncryptedData = encryptedData.EncryptedData,
                Iv = encryptedData.Iv
            });
        }

        // PUT: api/BookImageTypes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBookImageType(Guid id, EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true // Enable case-insensitive matching
                };
                var model = JsonSerializer.Deserialize<BookImageTypeDto>(decryptedData, options);

                if (model == null) { return NotFound(); }

                if (id != model.ImageTypeUuid)
                {
                    return BadRequest();
                }

                var bookImageType = await _context.BookImageTypes.FindAsync(id);

                if (bookImageType != null)
                {
                    bookImageType.ImageTypeId = model.ImageTypeId;
                    bookImageType.ImageTypeUuid = model.ImageTypeUuid;
                    bookImageType.Label = model.Label;
                }

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!BookImageTypeExists(id))
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

        // POST: api/BookImageTypes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpPost]
        public async Task<ActionResult<EncryptedPayload>> PostBookImageType(EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var model = JsonSerializer.Deserialize<BookImageTypeDto>(decryptedData);

                if (model == null)
                {
                    return NoContent();
                }

                var bookImageType = new BookImageType()
                {
                    ImageTypeId = model.ImageTypeId,
                    ImageTypeUuid = model.ImageTypeUuid,
                    Label = model.Label,
                    
                };

                _context.BookImageTypes.Add(bookImageType);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetBookImageType", model);
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

        // DELETE: api/BookImageTypes/5
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBookImageType(int id)
        {
            var bookImageType = await _context.BookImageTypes.FindAsync(id);
            if (bookImageType == null)
            {
                return NotFound();
            }

            _context.BookImageTypes.Remove(bookImageType);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BookImageTypeExists(Guid id)
        {
            return _context.BookImageTypes.Any(e => e.ImageTypeUuid == id);
        }
    }
}

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
    public class ReadListBooksController : ControllerBase
    {
        private readonly BookDbContext _context;

        public ReadListBooksController(BookDbContext context)
        {
            _context = context;
        }

        // GET: api/ReadListBooks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EncryptedPayload>>> GetReadListBooks()
        {
            var rLBs = await _context.ReadListBooks.ToListAsync();

            if (rLBs.Count >= 1)
            {
                var model = rLBs.Select(x => new ReadListBookDto()
                {
                    ReadListUuid = x.ReadListUuid,
                    BookUuid = x.BookUuid,
                    CreatedAt = x.CreatedAt,
                    UpdatedAt = x.UpdatedAt,
                }).ToList();

                // Encrypt the list of rLBs
                var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

                return Ok(new EncryptedPayload
                {
                    EncryptedData = encryptedData.EncryptedData,
                    Iv = encryptedData.Iv
                });
            }

            return NoContent();
        }

        // GET: api/ReadListBooks/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EncryptedPayload>> GetReadListBook(Guid id)
        {
            var rLB = await _context.ReadListBooks.FindAsync(id);

            if (rLB == null)
            {
                return NotFound();
            }

            var model = new ReadListBookDto()
            {
                ReadListUuid = rLB.ReadListUuid,
                BookUuid = rLB.BookUuid,
                CreatedAt = rLB.CreatedAt,
                UpdatedAt = rLB.UpdatedAt,
            };


            // Encrypt the list of publishers
            var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

            return Ok(new EncryptedPayload
            {
                EncryptedData = encryptedData.EncryptedData,
                Iv = encryptedData.Iv
            });
        }

        // PUT: api/ReadListBooks/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutReadListBook(Guid readListUuid, Guid bookUuid, EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true // Enable case-insensitive matching
                };
                var model = JsonSerializer.Deserialize<ReadListBookDto>(decryptedData, options);

                if (model == null) { return NotFound(); }

                if (readListUuid != model.ReadListUuid && bookUuid != model.BookUuid)
                {
                    return BadRequest();
                }

                var rLB = await _context.ReadListBooks.FindAsync(readListUuid);
                if (rLB != null)
                {
                    rLB.ReadListUuid = model.ReadListUuid;
                    rLB.BookUuid = model.BookUuid;
                    rLB.CreatedAt = model.CreatedAt;
                    rLB.UpdatedAt = DateTimeOffset.UtcNow;
                }

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    throw;
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

        // POST: api/ReadListBooks
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpPost]
        public async Task<ActionResult<EncryptedPayload>> PostReadListBook(EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var model = JsonSerializer.Deserialize<ReadListBookDto>(decryptedData);

                if (model == null)
                {
                    return NoContent();
                }

                var rLB = new ReadListBook()
                {
                    CreatedAt = DateTimeOffset.UtcNow,
                    UpdatedAt = DateTimeOffset.UtcNow,
                };

                _context.ReadListBooks.Add(rLB);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetReadListBook", new { readListUuid = rLB.ReadListUuid, bookUuid = rLB.BookUuid }, model);
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

        // DELETE: api/ReadListBooks/5
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReadListBook(int id)
        {
            var ReadListBook = await _context.ReadListBooks.FindAsync(id);
            if (ReadListBook == null)
            {
                return NotFound();
            }

            _context.ReadListBooks.Remove(ReadListBook);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}

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
    public class BookSeriesOrdersController : ControllerBase
    {
        private readonly BookDbContext _context;

        public BookSeriesOrdersController(BookDbContext context)
        {
            _context = context;
        }

        // GET: api/BookSeriesOrders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EncryptedPayload>>> GetBookSeriesOrders()
        {
            var bSOs = await _context.BookSeriesOrders.ToListAsync();

            if (bSOs.Count >= 1)
            {
                var model = bSOs.Select(x => new BookSeriesOrderDto()
                {
                    SeriesUuid = x.SeriesUuid,
                    BookUuid = x.BookUuid,
                    SeriesOrder = x.SeriesOrder,
                }).ToList();
                // Encrypt the list of bSOs
                var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

                return Ok(new EncryptedPayload
                {
                    EncryptedData = encryptedData.EncryptedData,
                    Iv = encryptedData.Iv
                });
            }

            return NoContent();
        }

        // GET: api/BookSeriesOrders/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EncryptedPayload>> GetBookSeriesOrder(Guid serieUuid, Guid bookUuid)
        {
            var bSO = await _context.BookSeriesOrders.FindAsync(serieUuid, bookUuid);

            if (bSO == null)
            {
                return NotFound();
            }

            var model = new BookSeriesOrderDto()
            {
                SeriesUuid= bSO.SeriesUuid,
                BookUuid= bSO.BookUuid,
                SeriesOrder = bSO.SeriesOrder,
            };

            // Encrypt the list of bSOs
            var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

            return Ok(new EncryptedPayload
            {
                EncryptedData = encryptedData.EncryptedData,
                Iv = encryptedData.Iv
            });
        }

        // PUT: api/BookSeriesOrders/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult<EncryptedPayload>> PutBookSeriesOrder(Guid serieUUid, Guid bookUuid, EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true // Enable case-insensitive matching
                };
                var model = JsonSerializer.Deserialize<BookSeriesOrderDto>(decryptedData, options);

                if (model == null) { return NotFound(); }

                if (serieUUid != model.SeriesUuid && bookUuid != model.BookUuid)
                {
                    return BadRequest();
                }

                var bSO = await _context.BookSeriesOrders.FindAsync(serieUUid, bookUuid);

                if (bSO != null)
                {
                    bSO.SeriesUuid = model.SeriesUuid;
                    bSO.BookUuid = model.BookUuid;
                    bSO.SeriesOrder =  model.SeriesOrder;
                }

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!BookSeriesOrderExists(serieUUid, bookUuid))
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

        // POST: api/BookSeriesOrders
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<EncryptedPayload>> PostBookSeriesOrder(EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var model = JsonSerializer.Deserialize<BookSeriesOrderDto>(decryptedData);

                if (model == null)
                {
                    return NoContent();
                }

                var bSO = new BookSeriesOrder()
                {
                    SeriesUuid = model.SeriesUuid,
                    BookUuid = model.BookUuid,
                    SeriesOrder = model.SeriesOrder,
                };

                _context.BookSeriesOrders.Add(bSO);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetBookSeriesOrder", new { serieUuid = model.SeriesUuid, bookUuid = model.BookUuid }, model);
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

        // DELETE: api/BookSeriesOrders/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBookSeriesOrder(int id)
        {
            var bSO = await _context.BookSeriesOrders.FindAsync(id);
            if (bSO == null)
            {
                return NotFound();
            }

            _context.BookSeriesOrders.Remove(bSO);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BookSeriesOrderExists(Guid serieUuid, Guid bookUuid)
        {
            return _context.BookSeriesOrders.Any(e => e.SeriesUuid == serieUuid && e.BookUuid == bookUuid);
        }
    }
}

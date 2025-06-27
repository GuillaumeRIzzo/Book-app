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
    public class SeriesController : ControllerBase
    {
        private readonly BookDbContext _context;

        public SeriesController(BookDbContext context)
        {
            _context = context;
        }

        // GET: api/Series
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EncryptedPayload>>> GetSeries()
        {
            var series = await _context.Series.ToListAsync();

            if (series.Count >= 1)
            {
                var model = series.Select(x => new SeriesDto()
                {
                    SeriesId = x.SeriesId,
                    SeriesUuid = x.SeriesUuid,
                    SeriesName = x.SeriesName,
                }).ToList();
                // Encrypt the list of series
                var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

                return Ok(new EncryptedPayload
                {
                    EncryptedData = encryptedData.EncryptedData,
                    Iv = encryptedData.Iv
                });
            }

            return NoContent();
        }

        // GET: api/Series/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EncryptedPayload>> GetSeries(Guid id)
        {
            var serie = await _context.Series.FindAsync(id);

            if (serie == null)
            {
                return NotFound();
            }

            var model = new SeriesDto()
            {
                SeriesId = serie.SeriesId,
                SeriesUuid = serie.SeriesUuid,
                SeriesName = serie.SeriesName,
            };

            // Encrypt the list of series
            var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

            return Ok(new EncryptedPayload
            {
                EncryptedData = encryptedData.EncryptedData,
                Iv = encryptedData.Iv
            });
        }

        // PUT: api/Series/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult<EncryptedPayload>> PutSeries(Guid id, EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true // Enable case-insensitive matching
                };
                var model = JsonSerializer.Deserialize<SeriesDto>(decryptedData, options);

                if (model == null) { return NotFound(); }

                if (id != model.SeriesUuid)
                {
                    return BadRequest();
                }

                if (SeriesNameExists(model.SeriesName, id))
                {
                    return BadRequest("Name already exists");
                }

                var serie = await _context.Series.FindAsync(id);

                if (serie != null)
                {
                    serie.SeriesId = model.SeriesId;
                    serie.SeriesUuid = model.SeriesUuid;
                    serie.SeriesName = model.SeriesName;
                }

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!SeriesExists(id))
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

        // POST: api/Series
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<EncryptedPayload>> PostSeries(EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var model = JsonSerializer.Deserialize<SeriesDto>(decryptedData);

                if (model == null)
                {
                    return NoContent();
                }

                if (SeriesNameExists(model.SeriesName, Guid.Empty))
                {
                    return BadRequest("Name already exists");
                }

                var serie = new Series()
                {
                    SeriesName = model.SeriesName,
                };

                _context.Series.Add(serie);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetSeries", new { id = model.SeriesUuid }, model);
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

        // DELETE: api/Series/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSeries(int id)
        {
            var serie = await _context.Series.FindAsync(id);
            if (serie == null)
            {
                return NotFound();
            }

            _context.Series.Remove(serie);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SeriesExists(Guid id)
        {
            return _context.Series.Any(e => e.SeriesUuid == id);
        }

        private bool SeriesNameExists(string name, Guid id)
        {
            return _context.Series.Any(p => p.SeriesName == name && p.SeriesUuid != id);
        }
    }
}

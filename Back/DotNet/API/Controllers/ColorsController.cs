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
    public class ColorsController : ControllerBase
    {
        private readonly BookDbContext _context;

        public ColorsController(BookDbContext context)
        {
            _context = context;
        }

        // GET: api/Colors
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EncryptedPayload>>> GetColors()
        {
            var colors = await _context.Colors.ToListAsync();

            if (colors.Count >= 1)
            {
                var model = colors.Select(x => new ColorDto()
                {
                    ColorId = x.ColorId,
                    ColorUuid = x.ColorUuid,
                    ColorName = x.ColorName,
                    ColorHex = x.ColorHex,
                }).ToList();
                // Encrypt the list of colors

                var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

                return Ok(new EncryptedPayload
                {
                    EncryptedData = encryptedData.EncryptedData,
                    Iv = encryptedData.Iv
                });
            }

            return NoContent();
        }

        // GET: api/Colors/5
        [HttpGet("{uuid}")]
        public async Task<ActionResult<EncryptedPayload>> GetColor(Guid uuid)
        {
            var color = await _context.Colors.FirstOrDefaultAsync(c => c.ColorUuid == uuid);

            if (color == null)
            {
                return NotFound();
            }

            var model = new ColorDto()
            {
                ColorId = color.ColorId,
                ColorUuid = color.ColorUuid,
                ColorName = color.ColorName,
                ColorHex = color.ColorHex,
            };

            // Encrypt the list of colors
            var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

            return Ok(new EncryptedPayload
            {
                EncryptedData = encryptedData.EncryptedData,
                Iv = encryptedData.Iv
            });
        }

        // PUT: api/Colors/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPut("{uuid}")]
        public async Task<ActionResult<EncryptedPayload>> PutColor(Guid uuid, EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true // Enable case-insensitive matching
                };
                var model = JsonSerializer.Deserialize<ColorDto>(decryptedData, options);

                if (model == null) { return NotFound(); }

                if (uuid != model.ColorUuid)
                {
                    return BadRequest();
                }

                if (ColorNameExists(model.ColorName, uuid))
                {
                    return BadRequest("Name already exists");
                }

                var color = await _context.Colors.FirstOrDefaultAsync(c => c.ColorUuid == uuid);

                if (color != null)
                {
                    color.ColorId = model.ColorId;
                    color.ColorUuid = model.ColorUuid;
                    color.ColorName = model.ColorName;
                    color.ColorHex = model.ColorHex;
                }

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ColorExists(uuid))
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

        // POST: api/Colors
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<EncryptedPayload>> PostColor(EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var model = JsonSerializer.Deserialize<ColorDto>(decryptedData);

                if (model == null)
                {
                    return NoContent();
                }

                if (ColorNameExists(model.ColorName, Guid.Empty))
                {
                    return BadRequest("Name already exists");
                }

                var color = new Color()
                {
                    ColorName = model.ColorName,
                    ColorHex = model.ColorHex,
                };

                _context.Colors.Add(color);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetColor", new { uuid = model.ColorUuid }, model);
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

        // DELETE: api/Colors/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteColor(int id)
        {
            var color = await _context.Colors.FindAsync(id);
            if (color == null)
            {
                return NotFound();
            }

            _context.Colors.Remove(color);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ColorExists(Guid uuid)
        {
            return _context.Colors.Any(e => e.ColorUuid == uuid);
        }

        private bool ColorNameExists(string name, Guid uuid)
        {
            return _context.Colors.Any(p => p.ColorName == name && p.ColorUuid != uuid);
        }
    }
}

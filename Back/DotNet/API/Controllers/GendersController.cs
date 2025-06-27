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
    public class GendersController : ControllerBase
    {
        private readonly BookDbContext _context;

        public GendersController(BookDbContext context)
        {
            _context = context;
        }

        // GET: api/Genders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EncryptedPayload>>> GetGenders()
        {
            var genders = await _context.Genders.ToListAsync();

            if (genders.Count >= 1)
            {
                var model = genders.Select(x => new GenderDto()
                {
                    GenderId = x.GenderId,
                    GenderUuid = x.GenderUuid,
                    GenderLabel = x.GenderLabel,
                }).ToList();
                // Encrypt the list of genders
                var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

                return Ok(new EncryptedPayload
                {
                    EncryptedData = encryptedData.EncryptedData,
                    Iv = encryptedData.Iv
                });
            }

            return NoContent();
        }

        // GET: api/Genders/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EncryptedPayload>> GetGender(Guid id)
        {
            var gender = await _context.Genders.FindAsync(id);

            if (gender == null)
            {
                return NotFound();
            }

            var model = new GenderDto()
            {
                GenderId = gender.GenderId,
                GenderUuid = gender.GenderUuid,
                GenderLabel = gender.GenderLabel,
            };

            // Encrypt the list of genders
            var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

            return Ok(new EncryptedPayload
            {
                EncryptedData = encryptedData.EncryptedData,
                Iv = encryptedData.Iv
            });
        }

        // PUT: api/Genders/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult<EncryptedPayload>> PutGender(Guid id, EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true // Enable case-insensitive matching
                };
                var model = JsonSerializer.Deserialize<GenderDto>(decryptedData, options);

                if (model == null) { return NotFound(); }

                if (id != model.GenderUuid)
                {
                    return BadRequest();
                }

                if (GenderNameExists(model.GenderLabel, id))
                {
                    return BadRequest("Name already exists");
                }

                var gender = await _context.Genders.FindAsync(id);

                if (gender != null)
                {
                    gender.GenderId = model.GenderId;
                    gender.GenderUuid = model.GenderUuid;
                    gender.GenderLabel = model.GenderLabel;
                }

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!GenderExists(id))
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

        // POST: api/Genders
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<EncryptedPayload>> PostGender(EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var model = JsonSerializer.Deserialize<GenderDto>(decryptedData);

                if (model == null)
                {
                    return NoContent();
                }

                if (GenderNameExists(model.GenderLabel, Guid.Empty))
                {
                    return BadRequest("Name already exists");
                }

                var gender = new Gender()
                {
                    GenderLabel = model.GenderLabel,
                };

                _context.Genders.Add(gender);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetGender", new { id = model.GenderUuid }, model);
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

        // DELETE: api/Genders/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGender(int id)
        {
            var gender = await _context.Genders.FindAsync(id);
            if (gender == null)
            {
                return NotFound();
            }

            _context.Genders.Remove(gender);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool GenderExists(Guid id)
        {
            return _context.Genders.Any(e => e.GenderUuid == id);
        }

        private bool GenderNameExists(string name, Guid id)
        {
            return _context.Genders.Any(p => p.GenderLabel == name && p.GenderUuid != id);
        }
    }
}

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
    public class StateStatusesController : ControllerBase
    {
        private readonly BookDbContext _context;

        public StateStatusesController(BookDbContext context)
        {
            _context = context;
        }

        // GET: api/StateStatuses
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EncryptedPayload>>> GetStateStatuses()
        {
            var stateStatuses = await _context.StateStatuses.ToListAsync();

            if (stateStatuses.Count >= 1)
            {
                var model = stateStatuses.Select(x => new StateStatusDto()
                {
                    StateStatusId = x.StateStatusId,
                    StateStatusUuid = x.StateStatusUuid,
                    Code = x.Code,
                    Label = x.Label
                }).ToList();
                // Encrypt the list of stateStatuses
                var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

                return Ok(new EncryptedPayload
                {
                    EncryptedData = encryptedData.EncryptedData,
                    Iv = encryptedData.Iv
                });
            }

            return NoContent();
        }

        // GET: api/StateStatuses/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EncryptedPayload>> GetStateStatuses(Guid id)
        {
            var stateStatus = await _context.StateStatuses.FindAsync(id);

            if (stateStatus == null)
            {
                return NotFound();
            }

            var model = new StateStatusDto()
            {
                StateStatusId = stateStatus.StateStatusId,
                StateStatusUuid= stateStatus.StateStatusUuid,
                Code = stateStatus.Code,
                Label = stateStatus.Label
            };

            // Encrypt the list of stateStatuses
            var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

            return Ok(new EncryptedPayload
            {
                EncryptedData = encryptedData.EncryptedData,
                Iv = encryptedData.Iv
            });
        }

        // PUT: api/StateStatuses/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult<EncryptedPayload>> PutStateStatuses(Guid id, EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true // Enable case-insensitive matching
                };
                var model = JsonSerializer.Deserialize<StateStatusDto>(decryptedData, options);

                if (model == null) { return NotFound(); }

                if (id != model.StateStatusUuid)
                {
                    return BadRequest();
                }

                if (StateStatusesNameExists(model.Label, id))
                {
                    return BadRequest("Name already exists");
                }

                var stateStatus = await _context.StateStatuses.FindAsync(id);

                if (stateStatus != null)
                {
                    stateStatus.StateStatusId = model.StateStatusId;
                    stateStatus.StateStatusUuid = model.StateStatusUuid;
                    stateStatus.Code = model.Code;
                    stateStatus.Label = model.Label;
                }

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!StateStatusesExists(id))
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

        // POST: api/StateStatuses
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<EncryptedPayload>> PostStateStatuses(EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var model = JsonSerializer.Deserialize<StateStatusDto>(decryptedData);

                if (model == null)
                {
                    return NoContent();
                }

                if (StateStatusesNameExists(model.Label, Guid.Empty))
                {
                    return BadRequest("Name already exists");
                }

                var stateStatus = new StateStatus()
                {
                    Code = model.Code,
                    Label = model.Label,
                };

                _context.StateStatuses.Add(stateStatus);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetStateStatuses", new { id = model.StateStatusUuid }, model);
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

        // DELETE: api/StateStatuses/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStateStatuses(int id)
        {
            var stateStatus = await _context.StateStatuses.FindAsync(id);
            if (stateStatus == null)
            {
                return NotFound();
            }

            _context.StateStatuses.Remove(stateStatus);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool StateStatusesExists(Guid id)
        {
            return _context.StateStatuses.Any(e => e.StateStatusUuid == id);
        }

        private bool StateStatusesNameExists(string name, Guid id)
        {
            return _context.StateStatuses.Any(p => p.Label == name && p.StateStatusUuid != id);
        }
    }
}

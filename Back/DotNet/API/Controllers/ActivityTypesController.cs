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
    public class ActivityTypesController : ControllerBase
    {
        private readonly BookDbContext _context;

        public ActivityTypesController(BookDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<EncryptedPayload>>> GetActivityTypes()
        {
            var activityTypes = await _context.ActivityTypes.ToListAsync();

            if (activityTypes.Count >= 1)
            {
                var model = activityTypes.Select(x => new ActivityTypeDto()
                {
                    ActivityTypeId = x.ActivityTypeId,
                    ActivityTypeUuid = x.ActivityTypeUuid,
                    Code = x.Code,
                    Label = x.Label,
                }).ToList();

                // Encrypt the list of activity types
                var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

                return Ok(new EncryptedPayload
                {
                    EncryptedData = encryptedData.EncryptedData,
                    Iv = encryptedData.Iv
                });
            }

            return NoContent();
        }

        // GET: api/ActivityTypes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EncryptedPayload>> GetActivityType(Guid id)
        {
            var ativityType = await _context.ActivityTypes.FindAsync(id);

            if (ativityType == null)
            {
                return NotFound();
            }

            var model = new ActivityTypeDto()
            {
                ActivityTypeId = ativityType.ActivityTypeId,
                ActivityTypeUuid = ativityType.ActivityTypeUuid,
                Code = ativityType.Code,
                Label = ativityType.Label,
            };

            // Encrypt the activity type data
            var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

            return Ok(new EncryptedPayload
            {
                EncryptedData = encryptedData.EncryptedData,
                Iv = encryptedData.Iv
            });
        }

        // PUT: api/ActivityTypes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpPut("{id}")]
        public async Task<ActionResult<EncryptedPayload>> PutActivityType(Guid id, EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true // Enable case-insensitive matching
                };
                var model = JsonSerializer.Deserialize<ActivityTypeDto>(decryptedData, options);

                if (model == null) { return NotFound(); }

                if (id != model.ActivityTypeUuid)
                {
                    return BadRequest();
                }

                var activityType = await _context.ActivityTypes.FindAsync(id);

                if (activityType == null)
                {
                    return NotFound();
                }

                activityType.ActivityTypeId = model.ActivityTypeId;
                activityType.ActivityTypeUuid = model.ActivityTypeUuid;
                activityType.Code = model.Code;
                activityType.Label = model.Label;


                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ActivityTypeExists(model.ActivityTypeUuid))
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

        // POST: api/ActivityTypes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpPost]
        public async Task<ActionResult<EncryptedPayload>> PostActivityType(EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true // Enable case-insensitive matching
                };
                var model = JsonSerializer.Deserialize<ActivityTypeDto>(decryptedData, options);


                if (model == null)
                {
                    return NoContent();
                }

                var activityType = new ActivityType()
                {
                    Code = model.Code,
                    Label = model.Label,
                };

                _context.ActivityTypes.Add(activityType);
                await _context.SaveChangesAsync();

                model.ActivityTypeId = activityType.ActivityTypeId;

                return CreatedAtAction("GetBook", new { id = model.ActivityTypeUuid }, model);
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

        // DELETE: api/ActivityTypes/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivityType(int id)
        {
            var activityType = await _context.ActivityTypes.FindAsync(id);
            if (activityType == null)
            {
                return NotFound();
            }

            _context.ActivityTypes.Remove(activityType);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ActivityTypeExists(Guid id)
        {
            return _context.ActivityTypes.Any(e => e.ActivityTypeUuid == id);
        }
    }
}

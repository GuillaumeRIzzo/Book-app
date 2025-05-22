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
    public class UserBookActivitiesController : ControllerBase
    {
        private readonly BookDbContext _context;

        public UserBookActivitiesController(BookDbContext context)
        {
            _context = context;
        }

        // GET: api/UserBookActivities
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EncryptedPayload>>> GetUserBookActivities()
        {
            var activities = await _context.UserBookActivities.ToListAsync();

            if (activities.Count >= 1)
            {
                var model = activities.Select(x => new UserBookActivityDto()
                {
                    ActivityId = x.ActivityId,
                    ActivityUuid = x.ActivityUuid,
                    UserUuid = x.UserUuid,
                    BookUuid = x.BookUuid,
                    ActivityTypeUuid = x.ActivityTypeUuid,
                    ActivityDate = x.ActivityDate,
                }).ToList();
                // Encrypt the list of activities
                var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

                return Ok(new EncryptedPayload
                {
                    EncryptedData = encryptedData.EncryptedData,
                    Iv = encryptedData.Iv
                });
            }

            return NoContent();
        }

        // GET: api/UserBookActivities/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EncryptedPayload>> GetUserBookActivity(Guid id)
        {
            var activity = await _context.UserBookActivities.FindAsync(id);

            if (activity == null)
            {
                return NotFound();
            }

            var model = new UserBookActivityDto()
            {
                ActivityId = activity.ActivityId,
                ActivityUuid = activity.ActivityUuid,
                UserUuid = activity.UserUuid,
                BookUuid = activity.BookUuid,
                ActivityTypeUuid = activity.ActivityTypeUuid,
                ActivityDate = activity.ActivityDate,
            };

            // Encrypt the list of activities
            var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

            return Ok(new EncryptedPayload
            {
                EncryptedData = encryptedData.EncryptedData,
                Iv = encryptedData.Iv
            });
        }

        // PUT: api/UserBookActivities/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult<EncryptedPayload>> PutUserBookActivity(Guid id, EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true // Enable case-insensitive matching
                };
                var model = JsonSerializer.Deserialize<UserBookActivityDto>(decryptedData, options);

                if (model == null) { return NotFound(); }

                if (id != model.ActivityUuid)
                {
                    return BadRequest();
                }

                var activity = await _context.UserBookActivities.FindAsync(id);

                if (activity != null)
                {
                    activity.ActivityId = model.ActivityId;
                    activity.ActivityUuid = model.ActivityUuid;
                    activity.UserUuid = model.UserUuid;
                    activity.BookUuid = model.BookUuid;
                    activity.ActivityTypeUuid = model.ActivityTypeUuid;
                    activity.ActivityDate = model.ActivityDate;
                }

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!UserBookActivityExists(id))
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

        // POST: api/UserBookActivities
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<EncryptedPayload>> PostUserBookActivity(EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var model = JsonSerializer.Deserialize<UserBookActivityDto>(decryptedData);

                if (model == null)
                {
                    return NoContent();
                }

                var activity = new UserBookActivity()
                {
                    UserUuid = model.UserUuid,
                    BookUuid = model.BookUuid,
                    ActivityTypeUuid = model.ActivityTypeUuid,
                    ActivityDate = DateTimeOffset.UtcNow
                };

                _context.UserBookActivities.Add(activity);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetUserBookActivity", new { id = model.ActivityUuid }, model);
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

        // DELETE: api/UserBookActivities/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserBookActivity(int id)
        {
            var activity = await _context.UserBookActivities.FindAsync(id);
            if (activity == null)
            {
                return NotFound();
            }

            _context.UserBookActivities.Remove(activity);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserBookActivityExists(Guid id)
        {
            return _context.UserBookActivities.Any(e => e.ActivityUuid == id);
        }
    }
}

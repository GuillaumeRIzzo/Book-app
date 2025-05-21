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
    public class UserBookStatesController : ControllerBase
    {
        private readonly BookDbContext _context;

        public UserBookStatesController(BookDbContext context)
        {
            _context = context;
        }

        // GET: api/UserBookStates
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EncryptedPayload>>> GetUserBookStates()
        {
            var states = await _context.UserBookStates.ToListAsync();

            if (states.Count >= 1)
            {
                var model = states.Select(x => new UserBookStateDto()
                {
                    UserUuid = x.UserUuid,
                    BookUuid = x.BookUuid,
                    StateStatusUuid = x.StateStatusUuid,
                    StateProgress = x.StateProgress,
                    CreatedAt = x.CreatedAt,
                    UpdatedAt = x.UpdatedAt
                }).ToList();

                // Encrypt the list of states
                var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

                return Ok(new EncryptedPayload
                {
                    EncryptedData = encryptedData.EncryptedData,
                    Iv = encryptedData.Iv
                });
            }

            return NoContent();
        }

        // GET: api/UserBookStates/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EncryptedPayload>> GetUserBookState(Guid id)
        {
            var state = await _context.UserBookStates.FindAsync(id);

            if (state == null)
            {
                return NotFound();
            }

            var model = new UserBookStateDto()
            {
                UserUuid = state.UserUuid,
                BookUuid = state.BookUuid,
                StateStatusUuid = state.StateStatusUuid,
                StateProgress = state.StateProgress,
                CreatedAt = state.CreatedAt,
                UpdatedAt = state.UpdatedAt
            };


            // Encrypt the list of publishers
            var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

            return Ok(new EncryptedPayload
            {
                EncryptedData = encryptedData.EncryptedData,
                Iv = encryptedData.Iv
            });
        }

        // PUT: api/UserBookStates/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUserBookState(Guid userUuid, Guid bookUuid, EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true // Enable case-insensitive matching
                };
                var model = JsonSerializer.Deserialize<UserBookStateDto>(decryptedData, options);

                if (model == null) { return NotFound(); }

                if (userUuid != model.UserUuid && bookUuid != model.BookUuid)
                {
                    return BadRequest();
                }

                var state = await _context.UserBookStates.FindAsync(userUuid, bookUuid);
                if (state != null)
                {
                    state.UserUuid = model.UserUuid;
                    state.BookUuid = model.BookUuid;
                    state.StateStatusUuid = model.StateStatusUuid;
                    state.StateProgress = model.StateProgress;
                    state.CreatedAt = model.CreatedAt;
                    state.UpdatedAt = DateTimeOffset.UtcNow;
                }

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!UserBookStateExists(userUuid, bookUuid))
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

        // POST: api/UserBookStates
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpPost]
        public async Task<ActionResult<EncryptedPayload>> PostUserBookState(EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var model = JsonSerializer.Deserialize<UserBookStateDto>(decryptedData);

                if (model == null)
                {
                    return NoContent();
                }

                var state = new UserBookState()
                {
                    StateProgress = model.StateProgress,
                    CreatedAt = DateTimeOffset.UtcNow,
                    UpdatedAt = DateTimeOffset.UtcNow,
                };

                _context.UserBookStates.Add(state);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetUserBookState", new { userUuid = state.UserUuid, bookUuid = state.BookUuid  }, model);
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

        // DELETE: api/UserBookStates/5
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserBookState(int id)
        {
            var UserBookState = await _context.UserBookStates.FindAsync(id);
            if (UserBookState == null)
            {
                return NotFound();
            }

            _context.UserBookStates.Remove(UserBookState);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserBookStateExists(Guid userUuid, Guid bookUuid)
        {
            return _context.UserBookStates.Any(e => e.UserUuid == userUuid && e.BookUuid == bookUuid);
        }
    }
}

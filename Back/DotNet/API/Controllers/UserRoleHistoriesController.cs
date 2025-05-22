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
    public class UserRoleHistoriesController : ControllerBase
    {
        private readonly BookDbContext _context;

        public UserRoleHistoriesController(BookDbContext context)
        {
            _context = context;
        }

        // GET: api/UserRoleHistories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EncryptedPayload>>> GetUserRoleHistories()
        {
            var histories = await _context.UserRoleHistories.ToListAsync();

            if (histories.Count >= 1)
            {
                var model = histories.Select(x => new UserRoleHistoryDto()
                {
                    HistoryId = x.HistoryId,
                    HistoryUuid = x.HistoryUuid,
                    TargetUserUuid = x.TargetUserUuid,
                    ModifiedByUuid = x.ModifiedByUuid,
                    PreviousRightUuid = x.PreviousRightUuid,
                    NewRightUuid = x.NewRightUuid,
                    ChangeDate = x.ChangeDate,
                }).ToList();
                // Encrypt the list of histories
                var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

                return Ok(new EncryptedPayload
                {
                    EncryptedData = encryptedData.EncryptedData,
                    Iv = encryptedData.Iv
                });
            }

            return NoContent();
        }

        // GET: api/UserRoleHistories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EncryptedPayload>> GetUserRoleHistory(Guid id)
        {
            var history = await _context.UserRoleHistories.FindAsync(id);

            if (history == null)
            {
                return NotFound();
            }

            var model = new UserRoleHistoryDto()
            {
                HistoryId = history.HistoryId,
                HistoryUuid = history.HistoryUuid,
                TargetUserUuid = history.TargetUserUuid,
                ModifiedByUuid = history.ModifiedByUuid,
                PreviousRightUuid = history.PreviousRightUuid,
                NewRightUuid = history.NewRightUuid,
                ChangeDate = history.ChangeDate,
            };

            // Encrypt the list of histories
            var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

            return Ok(new EncryptedPayload
            {
                EncryptedData = encryptedData.EncryptedData,
                Iv = encryptedData.Iv
            });
        }

        // PUT: api/UserRoleHistories/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult<EncryptedPayload>> PutUserRoleHistory(Guid id, EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true // Enable case-insensitive matching
                };
                var model = JsonSerializer.Deserialize<UserRoleHistoryDto>(decryptedData, options);

                if (model == null) { return NotFound(); }

                if (id != model.HistoryUuid)
                {
                    return BadRequest();
                }

                var history = await _context.UserRoleHistories.FindAsync(id);

                if (history != null)
                {
                    history.HistoryId = model.HistoryId;
                    history.HistoryUuid = model.HistoryUuid;
                    history.TargetUserUuid = model.TargetUserUuid;
                    history.PreviousRightUuid = model.PreviousRightUuid;
                    history.NewRightUuid = model.NewRightUuid;
                    history.ChangeDate = model.ChangeDate;
                }

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!UserRoleHistoryExists(id))
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

        // POST: api/UserRoleHistories
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<EncryptedPayload>> PostUserRoleHistory(EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var model = JsonSerializer.Deserialize<UserRoleHistoryDto>(decryptedData);

                if (model == null)
                {
                    return NoContent();
                }

                var history = new UserRoleHistory()
                {
                    TargetUserUuid = model.TargetUserUuid,
                    ModifiedByUuid = model.ModifiedByUuid,
                    PreviousRightUuid = model.PreviousRightUuid,
                    NewRightUuid = model.NewRightUuid,
                    ChangeDate = model.ChangeDate,
                };

                _context.UserRoleHistories.Add(history);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetUserRoleHistory", new { id = model.HistoryUuid }, model);
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

        // DELETE: api/UserRoleHistories/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserRoleHistory(int id)
        {
            var history = await _context.UserRoleHistories.FindAsync(id);
            if (history == null)
            {
                return NotFound();
            }

            _context.UserRoleHistories.Remove(history);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserRoleHistoryExists(Guid id)
        {
            return _context.UserRoleHistories.Any(e => e.HistoryUuid == id);
        }
    }
}

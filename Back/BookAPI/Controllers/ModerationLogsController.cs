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
    public class ModerationLogsController : ControllerBase
    {
        private readonly BookDbContext _context;

        public ModerationLogsController(BookDbContext context)
        {
            _context = context;
        }

        // GET: api/ModerationLogs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EncryptedPayload>>> GetModerationLogs()
        {
            var logs = await _context.ModerationLogs.ToListAsync();

            if (logs.Count >= 1)
            {
                var model = logs.Select(x => new ModerationLogDto()
                {
                    ModerationId = x.ModerationId,
                    ModerationUuid = x.ModerationUuid,
                    TargetType = x.TargetType,
                    TargetUuid = x.TargetUuid,
                    TriggerReason = x.TriggerReason,
                    ModerationType = x.ModerationType,
                    ModerationLevel = x.ModerationLevel,
                    Action = x.Action,
                    ModerationStatus = x.ModerationStatus,
                    ModerationComment = x.ModerationComment,
                    DetectedBy = x.DetectedBy,
                    CreatedAt = x.CreatedAt,
                    UpdatedAt = x.UpdatedAt,
                    Resolved = x.Resolved,
                }).ToList();
                // Encrypt the list of logs
                var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

                return Ok(new EncryptedPayload
                {
                    EncryptedData = encryptedData.EncryptedData,
                    Iv = encryptedData.Iv
                });
            }

            return NoContent();
        }

        // GET: api/ModerationLogs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EncryptedPayload>> GetModerationLog(Guid id)
        {
            var log = await _context.ModerationLogs.FindAsync(id);

            if (log == null)
            {
                return NotFound();
            }

            var model = new ModerationLogDto()
            {
                ModerationId = log.ModerationId,
                ModerationUuid = log.ModerationUuid,
                TargetType = log.TargetType,
                TargetUuid = log.TargetUuid,
                TriggerReason = log.TriggerReason,
                ModerationType = log.ModerationType,
                ModerationLevel = log.ModerationLevel,
                Action = log.Action,
                ModerationStatus = log.ModerationStatus,
                ModerationComment = log.ModerationComment,
                DetectedBy = log.DetectedBy,
                CreatedAt = log.CreatedAt,
                UpdatedAt = log.UpdatedAt,
                Resolved = log.Resolved,
            };

            // Encrypt the list of logs
            var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

            return Ok(new EncryptedPayload
            {
                EncryptedData = encryptedData.EncryptedData,
                Iv = encryptedData.Iv
            });
        }

        // PUT: api/ModerationLogs/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult<EncryptedPayload>> PutModerationLog(Guid id, EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true // Enable case-insensitive matching
                };
                var model = JsonSerializer.Deserialize<ModerationLogDto>(decryptedData, options);

                if (model == null) { return NotFound(); }

                if (id != model.ModerationUuid)
                {
                    return BadRequest();
                }

                var log = await _context.ModerationLogs.FindAsync(id);

                if (log != null)
                {
                    log.ModerationId = model.ModerationId;
                    log.ModerationUuid = model.ModerationUuid;
                    log.TargetType = model.TargetType;
                    log.TargetUuid = model.TargetUuid;
                    log.TriggerReason = model.TriggerReason;
                    log.ModerationType = model.ModerationType;
                    log.ModerationLevel = model.ModerationLevel;
                    log.Action = model.Action;
                    log.ModerationStatus = model.ModerationStatus;
                    log.ModerationComment = model.ModerationComment;
                    log.DetectedBy = model.DetectedBy;
                    log.CreatedAt = model.CreatedAt;
                    log.UpdatedAt = DateTimeOffset.UtcNow;
                    log.Resolved = model.Resolved;
                }

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ModerationLogExists(id))
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

        // POST: api/ModerationLogs
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<EncryptedPayload>> PostModerationLog(EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var model = JsonSerializer.Deserialize<ModerationLogDto>(decryptedData);

                if (model == null)
                {
                    return NoContent();
                }

                var log = new ModerationLog()
                {
                    TargetType = model.TargetType,
                    TargetUuid = model.TargetUuid,
                    TriggerReason = model.TriggerReason,
                    ModerationType = model.ModerationType,
                    ModerationLevel = model.ModerationLevel,
                    Action = model.Action,
                    ModerationStatus = model.ModerationStatus,
                    ModerationComment = model.ModerationComment,
                    DetectedBy = model.DetectedBy,
                    CreatedAt = DateTimeOffset.UtcNow,
                    UpdatedAt = DateTimeOffset.UtcNow,
                    Resolved = model.Resolved,
                };

                _context.ModerationLogs.Add(log);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetModerationLog", new { id = model.ModerationUuid }, model);
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

        // DELETE: api/ModerationLogs/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteModerationLog(int id)
        {
            var log = await _context.ModerationLogs.FindAsync(id);
            if (log == null)
            {
                return NotFound();
            }

            _context.ModerationLogs.Remove(log);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ModerationLogExists(Guid id)
        {
            return _context.ModerationLogs.Any(e => e.ModerationUuid == id);
        }
    }
}

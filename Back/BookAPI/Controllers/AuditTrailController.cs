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
    public class AuditTrailController : ControllerBase
    {
        private readonly BookDbContext _context;

        public AuditTrailController(BookDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<EncryptedPayload>>> GetAuditTrails()
        {
            var auditTrails = await _context.AuditTrails.ToListAsync();

            if (auditTrails.Count >= 1)
            {
                var model = auditTrails.Select(x => new AuditTrailDto()
                {
                    AuditId = x.AuditId,
                    AuditUuid = x.AuditUuid,
                    EntityTablename = x.EntityTablename,
                    ActionType = x.ActionType,
                    ActionDate = x.ActionDate,
                    PreviousData = x.PreviousData,
                    NewData = x.NewData,
                    Source = x.Source,
                    EntityUuid = x.EntityUuid,
                    ActionUserUuid  = x.ActionUserUuid,

                }).ToList();

                // Encrypt the list of audit trails
                var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

                return Ok(new EncryptedPayload
                {
                    EncryptedData = encryptedData.EncryptedData,
                    Iv = encryptedData.Iv
                });
            }

            return NoContent();
        }

        // GET: api/AuditTrails/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EncryptedPayload>> GetAuditTrail(int id)
        {
            var auditTrail = await _context.AuditTrails.FindAsync(id);

            if (auditTrail == null)
            {
                return NotFound();
            }

            var model = new AuditTrailDto()
            {
                AuditId = auditTrail.AuditId,
                AuditUuid = auditTrail.AuditUuid,
                EntityTablename = auditTrail.EntityTablename,
                ActionType = auditTrail.ActionType,
                ActionDate = auditTrail.ActionDate,
                PreviousData = auditTrail.PreviousData,
                NewData = auditTrail.NewData,
                Source = auditTrail.Source,
                EntityUuid = auditTrail.EntityUuid,
                ActionUserUuid = auditTrail.ActionUserUuid,
            };

            // Encrypt the activity type data
            var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

            return Ok(new EncryptedPayload
            {
                EncryptedData = encryptedData.EncryptedData,
                Iv = encryptedData.Iv
            });
        }

        // PUT: api/AuditTrails/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpPut("{id}")]
        public async Task<ActionResult<EncryptedPayload>> PutAuditTrail(Guid id, EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true // Enable case-insensitive matching
                };
                var model = JsonSerializer.Deserialize<AuditTrailDto>(decryptedData, options);

                if (model == null) { return NotFound(); }

                if (id != model.AuditUuid)
                {
                    return BadRequest();
                }

                var auditTrail = await _context.AuditTrails.FindAsync(id);

                if (auditTrail == null)
                {
                    return NotFound();
                }

                auditTrail.AuditId = model.AuditId;
                auditTrail.AuditUuid = model.AuditUuid;
                auditTrail.EntityTablename = model.EntityTablename;
                auditTrail.ActionType = model.ActionType;
                auditTrail.ActionDate = model.ActionDate;
                auditTrail.PreviousData = model.PreviousData;
                auditTrail.NewData = model.NewData;
                auditTrail.Source = model.Source;
                auditTrail.EntityUuid = model.EntityUuid;
                auditTrail.ActionUserUuid = model.ActionUserUuid;


                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!AuditTrailExists(model.AuditId))
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

        // POST: api/AuditTrails
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpPost]
        public async Task<ActionResult<EncryptedPayload>> PostAuditTrail(EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true // Enable case-insensitive matching
                };
                var model = JsonSerializer.Deserialize<AuditTrailDto>(decryptedData, options);


                if (model == null)
                {
                    return NoContent();
                }

                var auditTrail = new AuditTrail()
                {
                    AuditId = model.AuditId,
                    AuditUuid = model.AuditUuid,
                    EntityTablename = model.EntityTablename,
                    ActionType = model.ActionType,
                    ActionDate = model.ActionDate,
                    PreviousData = model.PreviousData,
                    NewData = model.NewData,
                    Source = model.Source,
                    EntityUuid = model.EntityUuid,
                    ActionUserUuid = model.ActionUserUuid,
                };

                _context.AuditTrails.Add(auditTrail);
                await _context.SaveChangesAsync();

                model.AuditId = auditTrail.AuditId;

                return CreatedAtAction("GetBook", new { id = model.AuditId }, model);
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

        // DELETE: api/AuditTrails/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAuditTrail(int id)
        {
            var auditTrail = await _context.AuditTrails.FindAsync(id);
            if (auditTrail == null)
            {
                return NotFound();
            }

            _context.AuditTrails.Remove(auditTrail);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AuditTrailExists(int id)
        {
            return _context.AuditTrails.Any(e => e.AuditId == id);
        }
    }
}

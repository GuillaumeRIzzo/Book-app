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
    public class UserRightsController : ControllerBase
    {
        private readonly BookDbContext _context;

        public UserRightsController(BookDbContext context)
        {
            _context = context;
        }

        // GET: api/UserRights
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EncryptedPayload>>> GetUserRights()
        {
            var rights = await _context.UserRights.ToListAsync();

            if (rights.Count >= 1)
            {
                var model = rights.Select(x => new UserRightDto()
                {
                    UserRightId = x.UserRightId,
                    UserRightUuid = x.UserRightUuid,
                    UserRightName = x.UserRightName,
                }).ToList();
                // Encrypt the list of rights
                var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

                return Ok(new EncryptedPayload
                {
                    EncryptedData = encryptedData.EncryptedData,
                    Iv = encryptedData.Iv
                });
            }

            return NoContent();
        }

        // GET: api/UserRights/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EncryptedPayload>> GetUserRights(Guid id)
        {
            var right = await _context.UserRights.FindAsync(id);

            if (right == null)
            {
                return NotFound();
            }

            var model = new UserRightDto()
            {
                UserRightId = right.UserRightId,
                UserRightUuid = right.UserRightUuid,
                UserRightName = right.UserRightName,
            };

            // Encrypt the list of rights
            var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

            return Ok(new EncryptedPayload
            {
                EncryptedData = encryptedData.EncryptedData,
                Iv = encryptedData.Iv
            });
        }

        // PUT: api/UserRights/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult<EncryptedPayload>> PutUserRights(Guid id, EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true // Enable case-insensitive matching
                };
                var model = JsonSerializer.Deserialize<UserRightDto>(decryptedData, options);

                if (model == null) { return NotFound(); }

                if (id != model.UserRightUuid)
                {
                    return BadRequest();
                }

                if (UserRightNameExists(model.UserRightName, id))
                {
                    return BadRequest("Name already exists");
                }

                var right = await _context.UserRights.FindAsync(id);

                if (right != null)
                {
                    right.UserRightId = model.UserRightId;
                    right.UserRightUuid = model.UserRightUuid;
                    right.UserRightName = model.UserRightName;
                }

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!UserRightsExists(id))
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

        // POST: api/UserRights
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<EncryptedPayload>> PostUserRights(EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var model = JsonSerializer.Deserialize<UserRightDto>(decryptedData);

                if (model == null)
                {
                    return NoContent();
                }

                if (UserRightNameExists(model.UserRightName, Guid.Empty))
                {
                    return BadRequest("Name already exists");
                }

                var right = new UserRight()
                {
                    UserRightName = model.UserRightName,
                };

                _context.UserRights.Add(right);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetUserRights", new { id = model.UserRightUuid }, model);
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

        // DELETE: api/UserRights/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserRights(int id)
        {
            var right = await _context.UserRights.FindAsync(id);
            if (right == null)
            {
                return NotFound();
            }

            _context.UserRights.Remove(right);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserRightsExists(Guid id)
        {
            return _context.UserRights.Any(e => e.UserRightUuid == id);
        }

        private bool UserRightNameExists(string name, Guid id)
        {
            return _context.UserRights.Any(p => p.UserRightName == name && p.UserRightUuid != id);
        }
    }
}

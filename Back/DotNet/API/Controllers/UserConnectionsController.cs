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
    public class UserConnectionsController : ControllerBase
    {
        private readonly BookDbContext _context;

        public UserConnectionsController(BookDbContext context)
        {
            _context = context;
        }

        // GET: api/UserConnections
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EncryptedPayload>>> GetUserConnections()
        {
            var connections = await _context.UserConnections.ToListAsync();

            if (connections.Count >= 1)
            {
                var model = connections.Select(x => new UserConnectionDto()
                {
                    ConnectionId = x.ConnectionId,
                    ConnectionUuid = x.ConnectionUuid,
                    UserUuid = x.UserUuid,
                    ConnectionDate = x.ConnectionDate,
                    ConnectionIp = x.ConnectionIp,
                    ConnectionDevice = x.ConnectionDevice
                }).ToList();

                // Encrypt the list of connections
                var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

                return Ok(new EncryptedPayload
                {
                    EncryptedData = encryptedData.EncryptedData,
                    Iv = encryptedData.Iv
                });
            }

            return NoContent();
        }

        // GET: api/UserConnections/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EncryptedPayload>> GetUserConnection(Guid id)
        {
            var connection = await _context.UserConnections.FindAsync(id);

            if (connection == null)
            {
                return NotFound();
            }

            var model = new UserConnectionDto()
            {
                ConnectionId = connection.ConnectionId,
                ConnectionUuid = connection.ConnectionUuid,
                UserUuid = connection.UserUuid,
                ConnectionDate = connection.ConnectionDate,
                ConnectionIp = connection.ConnectionIp,
                ConnectionDevice = connection.ConnectionDevice,
            };


            // Encrypt the list of publishers
            var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

            return Ok(new EncryptedPayload
            {
                EncryptedData = encryptedData.EncryptedData,
                Iv = encryptedData.Iv
            });
        }

        // PUT: api/UserConnections/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUserConnection(Guid ip, EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true // Enable case-insensitive matching
                };
                var model = JsonSerializer.Deserialize<UserConnectionDto>(decryptedData, options);

                if (model == null) { return NotFound(); }

                if (ip != model.ConnectionUuid)
                {
                    return BadRequest();
                }

                var connection = await _context.UserConnections.FindAsync(ip);
                if (connection != null)
                {
                    connection.ConnectionIp = model.ConnectionIp;
                    connection.ConnectionUuid = model.ConnectionUuid;
                    connection.UserUuid = model.UserUuid;
                    connection.ConnectionDate = model.ConnectionDate;
                    connection.ConnectionIp = model.ConnectionIp;
                    connection.ConnectionDevice = model.ConnectionDevice;
                }

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!UserConnectionExists(ip))
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

        // POST: api/UserConnections
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpPost]
        public async Task<ActionResult<EncryptedPayload>> PostUserConnection(EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var model = JsonSerializer.Deserialize<UserConnectionDto>(decryptedData);

                if (model == null)
                {
                    return NoContent();
                }

                var connection = new UserConnection()
                {
                    UserUuid = model.UserUuid,
                    ConnectionDate = DateTime.UtcNow,
                    ConnectionIp = model.ConnectionIp,
                    ConnectionDevice = model.ConnectionDevice,
                };

                _context.UserConnections.Add(connection);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetUserConnection", new { ip = connection.ConnectionUuid}, model);
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

        // DELETE: api/UserConnections/5
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserConnection(int id)
        {
            var UserConnection = await _context.UserConnections.FindAsync(id);
            if (UserConnection == null)
            {
                return NotFound();
            }

            _context.UserConnections.Remove(UserConnection);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserConnectionExists(Guid ip)
        {
            return _context.UserConnections.Any(e => e.UserUuid == ip);
        }
    }
}

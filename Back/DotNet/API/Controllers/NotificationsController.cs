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
    public class NotificationsController : ControllerBase
    {
        private readonly BookDbContext _context;

        public NotificationsController(BookDbContext context)
        {
            _context = context;
        }

        // GET: api/Notifications
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EncryptedPayload>>> GetNotifications()
        {
            var notifs = await _context.Notifications.ToListAsync();

            if (notifs.Count >= 1)
            {
                var model = notifs.Select(x => new NotificationDto()
                {
                    NotificationId = x.NotificationId,
                    NotificationUuid = x.NotificationUuid,
                    UserUuid = x.UserUuid,
                    NotificationTitle = x.NotificationTitle,
                    NotificationMessage = x.NotificationMessage,
                    IsRead = x.IsRead,
                    NotificationDate = x.NotificationDate,
                }).ToList();
                // Encrypt the list of notifs
                var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

                return Ok(new EncryptedPayload
                {
                    EncryptedData = encryptedData.EncryptedData,
                    Iv = encryptedData.Iv
                });
            }

            return NoContent();
        }

        // GET: api/Notifications/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EncryptedPayload>> GetNotification(Guid id)
        {
            var notif = await _context.Notifications.FindAsync(id);

            if (notif == null)
            {
                return NotFound();
            }

            var model = new NotificationDto()
            {
                NotificationId = notif.NotificationId,
                NotificationUuid = notif.NotificationUuid,
                UserUuid = notif.UserUuid,
                NotificationTitle = notif.NotificationTitle,
                NotificationMessage = notif.NotificationMessage,
                IsRead = notif.IsRead,
                NotificationDate = notif.NotificationDate,
            };

            // Encrypt the list of notifs
            var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

            return Ok(new EncryptedPayload
            {
                EncryptedData = encryptedData.EncryptedData,
                Iv = encryptedData.Iv
            });
        }

        // PUT: api/Notifications/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult<EncryptedPayload>> PutNotification(Guid id, EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true // Enable case-insensitive matching
                };
                var model = JsonSerializer.Deserialize<NotificationDto>(decryptedData, options);

                if (model == null) { return NotFound(); }

                if (id != model.NotificationUuid)
                {
                    return BadRequest();
                }

                var notif = await _context.Notifications.FindAsync(id);

                if (notif != null)
                {
                    notif.NotificationId = model.NotificationId;
                    notif.NotificationUuid = model.NotificationUuid;
                    notif.UserUuid = model.UserUuid;
                    notif.NotificationTitle = model.NotificationTitle;
                    notif.NotificationMessage = model.NotificationMessage;
                    notif.IsRead = model.IsRead;
                    notif.NotificationDate = model.NotificationDate;
                }

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!NotificationExists(id))
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

        // POST: api/Notifications
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<EncryptedPayload>> PostNotification(EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var model = JsonSerializer.Deserialize<NotificationDto>(decryptedData);

                if (model == null)
                {
                    return NoContent();
                }

                var notif = new Notification()
                {
                    UserUuid = model.UserUuid,
                    NotificationTitle = model.NotificationTitle,
                    NotificationMessage = model.NotificationMessage,
                    IsRead = false,
                    NotificationDate = DateTime.UtcNow,
                };

                _context.Notifications.Add(notif);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetNotification", new { id = model.NotificationUuid }, model);
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

        // DELETE: api/Notifications/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNotification(int id)
        {
            var notif = await _context.Notifications.FindAsync(id);
            if (notif == null)
            {
                return NotFound();
            }

            _context.Notifications.Remove(notif);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool NotificationExists(Guid id)
        {
            return _context.Notifications.Any(e => e.NotificationUuid == id);
        }
    }
}

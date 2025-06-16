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
    public class PreferencesController : ControllerBase
    {
        private readonly BookDbContext _context;

        public PreferencesController(BookDbContext context)
        {
            _context = context;
        }

        // GET: api/Preferences
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EncryptedPayload>>> GetPreferences()
        {
            var preferences = await _context.Preferences.ToListAsync();

            if (preferences.Count >= 1)
            {
                var model = preferences.Select(x => new PreferenceDto()
                {
                    PreferenceId = x.PreferenceId,
                    PreferenceUuid = x.PreferenceUuid,
                    UserUuid = x.UserUuid,
                    LanguageUuid = x.LanguageUuid,
                    ThemeUuid = x.ThemeUuid,
                    PrimaryColorUuid = x.PrimaryColorUuid,
                    SecondaryColorUuid = x.SecondaryColorUuid,
                    BackgroundColorUuid = x.BackgroundColorUuid,
                    CreatedAt = x.CreatedAt,
                    UpdatedAt = x.UpdatedAt,
                }).ToList();
                // Encrypt the list of preferences
                var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

                return Ok(new EncryptedPayload
                {
                    EncryptedData = encryptedData.EncryptedData,
                    Iv = encryptedData.Iv
                });
            }

            return NoContent();
        }

        // GET: api/Preferences/5
        [HttpGet("{uuid}")]
        public async Task<ActionResult<EncryptedPayload>> GetPreference(Guid uuid)
        {
            var preference = await _context.Preferences.FirstOrDefaultAsync(p => p.PreferenceUuid == uuid);

            if (preference == null)
            {
                return NotFound();
            }

            var model = new PreferenceDto()
            {
                PreferenceId = preference.PreferenceId,
                PreferenceUuid = preference.PreferenceUuid,
                UserUuid = preference.UserUuid,
                LanguageUuid = preference.LanguageUuid,
                ThemeUuid = preference.ThemeUuid,
                PrimaryColorUuid = preference.PrimaryColorUuid,
                SecondaryColorUuid= preference.SecondaryColorUuid,
                BackgroundColorUuid = preference.BackgroundColorUuid,
                CreatedAt = preference.CreatedAt,
                UpdatedAt = preference.UpdatedAt,
            };

            // Encrypt the list of preferences
            var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

            return Ok(new EncryptedPayload
            {
                EncryptedData = encryptedData.EncryptedData,
                Iv = encryptedData.Iv
            });
        }

        // PUT: api/Preferences/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPut("{uuid}")]
        public async Task<ActionResult<EncryptedPayload>> PutPreference(Guid uuid, EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true // Enable case-insensitive matching
                };
                var model = JsonSerializer.Deserialize<PreferenceDto>(decryptedData, options);

                if (model == null) { return NotFound(); }

                if (uuid != model.PreferenceUuid)
                {
                    return BadRequest();
                }

                var preference = await _context.Preferences.FirstOrDefaultAsync(p => p.PreferenceUuid == uuid);

                if (preference != null)
                {
                    preference.PreferenceId = model.PreferenceId;
                    preference.PreferenceUuid = model.PreferenceUuid;
                    preference.UserUuid = model.UserUuid;
                    preference.LanguageUuid = model.LanguageUuid;
                    preference.ThemeUuid = model.ThemeUuid;
                    preference.PrimaryColorUuid = model.PrimaryColorUuid;
                    preference.SecondaryColorUuid = model.SecondaryColorUuid;
                    preference.BackgroundColorUuid = model.BackgroundColorUuid;
                    preference.CreatedAt = model.CreatedAt;
                    preference.UpdatedAt = DateTimeOffset.UtcNow;
                }

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!PreferenceExists(uuid))
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

        // POST: api/Preferences
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<EncryptedPayload>> PostPreference(EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var model = JsonSerializer.Deserialize<PreferenceDto>(decryptedData);

                if (model == null)
                {
                    return NoContent();
                }

                var preference = new Preference()
                {
                    UserUuid = model.UserUuid,
                    LanguageUuid = model.LanguageUuid,
                    ThemeUuid = model.ThemeUuid,
                    PrimaryColorUuid = model.PrimaryColorUuid,
                    SecondaryColorUuid = model.SecondaryColorUuid,
                    BackgroundColorUuid = model.BackgroundColorUuid,
                    CreatedAt = DateTimeOffset.UtcNow,
                    UpdatedAt = DateTimeOffset.UtcNow,
                };

                _context.Preferences.Add(preference);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetPreference", new { uuid = model.PreferenceUuid }, model);
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

        // DELETE: api/Preferences/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePreference(int id)
        {
            var preference = await _context.Preferences.FindAsync(id);
            if (preference == null)
            {
                return NotFound();
            }

            _context.Preferences.Remove(preference);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PreferenceExists(Guid uuid)
        {
            return _context.Preferences.Any(e => e.PreferenceUuid == uuid);
        }
    }
}

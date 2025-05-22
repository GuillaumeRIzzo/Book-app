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
    public class ThemesController : ControllerBase
    {
        private readonly BookDbContext _context;

        public ThemesController(BookDbContext context)
        {
            _context = context;
        }

        // GET: api/Themes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EncryptedPayload>>> GetThemes()
        {
            var themes = await _context.Themes.ToListAsync();

            if (themes.Count >= 1)
            {
                var model = themes.Select(x => new ThemeDto()
                {
                    ThemeId = x.ThemeId,
                    ThemeUuid = x.ThemeUuid,
                    ThemeName = x.ThemeName,
                }).ToList();
                // Encrypt the list of themes
                var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

                return Ok(new EncryptedPayload
                {
                    EncryptedData = encryptedData.EncryptedData,
                    Iv = encryptedData.Iv
                });
            }

            return NoContent();
        }

        // GET: api/Themes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EncryptedPayload>> GetThemes(Guid id)
        {
            var theme = await _context.Themes.FindAsync(id);

            if (theme == null)
            {
                return NotFound();
            }

            var model = new ThemeDto()
            {
                ThemeId = theme.ThemeId,
                ThemeUuid = theme.ThemeUuid,
                ThemeName = theme.ThemeName,
            };

            // Encrypt the list of themes
            var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

            return Ok(new EncryptedPayload
            {
                EncryptedData = encryptedData.EncryptedData,
                Iv = encryptedData.Iv
            });
        }

        // PUT: api/Themes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult<EncryptedPayload>> PutThemes(Guid id, EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true // Enable case-insensitive matching
                };
                var model = JsonSerializer.Deserialize<ThemeDto>(decryptedData, options);

                if (model == null) { return NotFound(); }

                if (id != model.ThemeUuid)
                {
                    return BadRequest();
                }

                if (ThemeNameExists(model.ThemeName, id))
                {
                    return BadRequest("Name already exists");
                }

                var theme = await _context.Themes.FindAsync(id);

                if (theme != null)
                {
                    theme.ThemeId = model.ThemeId;
                    theme.ThemeUuid = model.ThemeUuid;
                    theme.ThemeName = model.ThemeName;
                }

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ThemesExists(id))
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

        // POST: api/Themes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<EncryptedPayload>> PostThemes(EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var model = JsonSerializer.Deserialize<ThemeDto>(decryptedData);

                if (model == null)
                {
                    return NoContent();
                }

                if (ThemeNameExists(model.ThemeName, Guid.Empty))
                {
                    return BadRequest("Name already exists");
                }

                var theme = new Theme()
                {
                    ThemeName = model.ThemeName,
                };

                _context.Themes.Add(theme);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetThemes", new { id = model.ThemeUuid }, model);
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

        // DELETE: api/Themes/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteThemes(int id)
        {
            var theme = await _context.Themes.FindAsync(id);
            if (theme == null)
            {
                return NotFound();
            }

            _context.Themes.Remove(theme);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ThemesExists(Guid id)
        {
            return _context.Themes.Any(e => e.ThemeUuid == id);
        }

        private bool ThemeNameExists(string name, Guid id)
        {
            return _context.Themes.Any(p => p.ThemeName == name && p.ThemeUuid != id);
        }
    }
}

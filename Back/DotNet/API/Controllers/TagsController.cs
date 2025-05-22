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
    public class TagsController : ControllerBase
    {
        private readonly BookDbContext _context;

        public TagsController(BookDbContext context)
        {
            _context = context;
        }

        // GET: api/Tags
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EncryptedPayload>>> GetTags()
        {
            var tags = await _context.Tags.ToListAsync();

            if (tags.Count >= 1)
            {
                var model = tags.Select(x => new TagDto()
                {
                    TagId = x.TagId,
                    TagUuid = x.TagUuid,
                    TagLabel = x.TagLabel,
                }).ToList();
                // Encrypt the list of tags
                var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

                return Ok(new EncryptedPayload
                {
                    EncryptedData = encryptedData.EncryptedData,
                    Iv = encryptedData.Iv
                });
            }

            return NoContent();
        }

        // GET: api/Tags/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EncryptedPayload>> GetTags(Guid id)
        {
            var tag = await _context.Tags.FindAsync(id);

            if (tag == null)
            {
                return NotFound();
            }

            var model = new TagDto()
            {
                TagId = tag.TagId,
                TagUuid = tag.TagUuid,
                TagLabel = tag.TagLabel,
            };

            // Encrypt the list of tags
            var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

            return Ok(new EncryptedPayload
            {
                EncryptedData = encryptedData.EncryptedData,
                Iv = encryptedData.Iv
            });
        }

        // PUT: api/Tags/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult<EncryptedPayload>> PutTags(Guid id, EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true // Enable case-insensitive matching
                };
                var model = JsonSerializer.Deserialize<TagDto>(decryptedData, options);

                if (model == null) { return NotFound(); }

                if (id != model.TagUuid)
                {
                    return BadRequest();
                }

                if (TagLabelExists(model.TagLabel, id))
                {
                    return BadRequest("Name already exists");
                }

                var tag = await _context.Tags.FindAsync(id);

                if (tag != null)
                {
                    tag.TagId = model.TagId;
                    tag.TagUuid = model.TagUuid;
                    tag.TagLabel = model.TagLabel;
                }

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!TagsExists(id))
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

        // POST: api/Tags
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<EncryptedPayload>> PostTags(EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var model = JsonSerializer.Deserialize<TagDto>(decryptedData);

                if (model == null)
                {
                    return NoContent();
                }

                if (TagLabelExists(model.TagLabel, Guid.Empty))
                {
                    return BadRequest("Name already exists");
                }

                var tag = new Tag()
                {
                    TagLabel = model.TagLabel,
                };

                _context.Tags.Add(tag);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetTags", new { id = model.TagUuid }, model);
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

        // DELETE: api/Tags/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTags(int id)
        {
            var tag = await _context.Tags.FindAsync(id);
            if (tag == null)
            {
                return NotFound();
            }

            _context.Tags.Remove(tag);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TagsExists(Guid id)
        {
            return _context.Tags.Any(e => e.TagUuid == id);
        }

        private bool TagLabelExists(string name, Guid id)
        {
            return _context.Tags.Any(p => p.TagLabel == name && p.TagUuid != id);
        }
    }
}

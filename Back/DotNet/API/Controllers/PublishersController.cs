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
    public class PublishersController : ControllerBase
    {
        private readonly BookDbContext _context;

        public PublishersController(BookDbContext context)
        {
            _context = context;
        }

        // GET: api/Publishers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EncryptedPayload>>> GetPublishers()
        {
            var publishers = await _context.Publishers.ToListAsync();

            if (publishers.Count >= 1)
            {
                var model = publishers.Select(x => new PublisherDto()
                {
                    PublisherId = x.PublisherId,
                    PublisherUuid = x.PublisherUuid,
                    PublisherName = x.PublisherName,
                    ImageUrl = x.ImageUrl,
                    CreatedAt = x.CreatedAt,
                    UpdatedAt = x.UpdatedAt,
                }).ToList();
                // Encrypt the list of publishers
                var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

                return Ok(new EncryptedPayload
                {
                    EncryptedData = encryptedData.EncryptedData,
                    Iv = encryptedData.Iv
                });
            }

            return NoContent();
        }

        // GET: api/Publishers/5
        [HttpGet("{uuid}")]
        public async Task<ActionResult<EncryptedPayload>> GetPublisher(Guid uuid)
        {
            var publisher = await _context.Publishers.FirstOrDefaultAsync(p => p.PublisherUuid == uuid);

            if (publisher == null)
            {
                return NotFound();
            }

            var model = new PublisherDto()
            {
                PublisherId = publisher.PublisherId,
                PublisherUuid = publisher.PublisherUuid,
                PublisherName = publisher.PublisherName,
                ImageUrl= publisher.ImageUrl,
                CreatedAt = publisher.CreatedAt,
                UpdatedAt = publisher.UpdatedAt,
            };

            // Encrypt the list of publishers
            var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

            return Ok(new EncryptedPayload
            {
                EncryptedData = encryptedData.EncryptedData,
                Iv = encryptedData.Iv
            });
        }

        // PUT: api/Publishers/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult<EncryptedPayload>> PutPublisher(Guid id, EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true // Enable case-insensitive matching
                };
                var model = JsonSerializer.Deserialize<PublisherDto>(decryptedData, options);

                if (model == null) { return NotFound(); }

                if (id != model.PublisherUuid)
                {
                    return BadRequest();
                }

                if (PublisherNameExists(model.PublisherName, id))
                {
                    return BadRequest("Name already exists");
                }

                var publisher = await _context.Publishers.FindAsync(id);

                if (publisher != null)
                {
                    publisher.PublisherId = model.PublisherId;
                    publisher.PublisherUuid = model.PublisherUuid;
                    publisher.PublisherName = model.PublisherName;
                    publisher.ImageUrl = model.ImageUrl;
                    publisher.CreatedAt = model.CreatedAt;
                    publisher.UpdatedAt = DateTimeOffset.UtcNow;

                }

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!PublisherExists(id))
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

        // POST: api/Publishers
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<EncryptedPayload>> PostPublisher(EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var model = JsonSerializer.Deserialize<PublisherDto>(decryptedData);

                if (model == null)
                {
                    return NoContent();
                }

                if (PublisherNameExists(model.PublisherName, Guid.Empty))
                {
                    return BadRequest("Name already exists");
                }

                var publisher = new Publisher()
                {
                    PublisherName = model.PublisherName,
                    ImageUrl = model.ImageUrl,
                    CreatedAt = DateTimeOffset.UtcNow,
                    UpdatedAt = DateTimeOffset.UtcNow,
                };

                _context.Publishers.Add(publisher);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetPublisher", new { id = model.PublisherUuid }, model);
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

        // DELETE: api/Publishers/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePublisher(int id)
        {
            var publisher = await _context.Publishers.FindAsync(id);
            if (publisher == null)
            {
                return NotFound();
            }

            _context.Publishers.Remove(publisher);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PublisherExists(Guid id)
        {
            return _context.Publishers.Any(e => e.PublisherUuid == id);
        }

        private bool PublisherNameExists(string name, Guid id)
        {
            return _context.Publishers.Any(p => p.PublisherName == name && p.PublisherUuid != id);
        }
    }
}

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BookAPI.Models;
using Microsoft.AspNetCore.Authorization;
using BookAPI.Utils;
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
                var model = publishers.Select(x => new ModelViewPublisher()
                {
                    PublisherId = x.PublisherId,
                    PublisherName = x.PublisherName
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
        [HttpGet("{id}")]
        public async Task<ActionResult<EncryptedPayload>> GetPublisher(int id)
        {
            var publisher = await _context.Publishers.FindAsync(id);

            if (publisher == null)
            {
                return NotFound();
            }

            var model = new ModelViewPublisher()
            {
                PublisherId = publisher.PublisherId,
                PublisherName = publisher.PublisherName
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
        public async Task<IActionResult> PutPublisher(int id, EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true // Enable case-insensitive matching
                };
                var model = JsonSerializer.Deserialize<ModelViewPublisher>(decryptedData, options);

                if (id != model.PublisherId)
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
                    publisher.PublisherName = model.PublisherName;

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
        public async Task<ActionResult<ModelViewPublisher>> PostPublisher(ModelViewPublisher model)
        {
            if (model == null)
            {
                return NoContent();
            }

            if (PublisherNameExists(model.PublisherName, 0))
            {
                return BadRequest("Name already exists");
            }

            var publisher = new Publisher()
            {
                PublisherName = model.PublisherName
            };

            _context.Publishers.Add(publisher);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPublisher", new { id = model.PublisherId }, model);
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

        private bool PublisherExists(int id)
        {
            return _context.Publishers.Any(e => e.PublisherId == id);
        }

        private bool PublisherNameExists(string name, int id)
        {
            return _context.Publishers.Any(p => p.PublisherName == name && p.PublisherId != id);
        }
    }
}

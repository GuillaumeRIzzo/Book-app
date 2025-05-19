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
    public class BookImagesController : ControllerBase
    {
        private readonly BookDbContext _context;

        public BookImagesController(BookDbContext context)
        {
            _context = context;
        }

        // GET: api/BookImages
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EncryptedPayload>>> GetBookImages()
        {
            var bookImages = await _context.BookImages.ToListAsync();

            if (bookImages.Count >= 1)
            {
                var model = bookImages.Select(x => new BookImageDto()
                {
                    ImageId = x.ImageId,
                    ImageUuid = x.ImageUuid,
                    BookUuid = x.BookUuid,
                    ImageUrl = x.ImageUrl,
                    ImageAlt = x.ImageAlt,
                    IsCover = x.IsCover,
                    ImageOrder = x.ImageOrder,
                    CreatedAt = x.CreatedAt,
                    UpdatedAt = x.UpdatedAt,
                    ImageTypeUuid = x.ImageTypeUuid,

                }).ToList();

                // Encrypt the list of bookImages
                var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

                return Ok(new EncryptedPayload
                {
                    EncryptedData = encryptedData.EncryptedData,
                    Iv = encryptedData.Iv
                });
            }
            return NoContent();
        }

        // GET: api/BookImages/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EncryptedPayload>> GetBookImage(Guid id)
        {
            var bookImage = await _context.BookImages.FindAsync(id);

            if (bookImage == null)
            {
                return NotFound();
            }

            var model = new BookImageDto()
            {
                ImageId= bookImage.ImageId,
                ImageUuid = bookImage.ImageUuid,
                BookUuid = bookImage.BookUuid,
                ImageUrl = bookImage.ImageUrl,
                ImageAlt = bookImage.ImageAlt,
                IsCover = bookImage.IsCover,
                ImageOrder = bookImage.ImageOrder,
                CreatedAt = bookImage.CreatedAt,
                UpdatedAt = bookImage.UpdatedAt,
                ImageTypeUuid = bookImage.ImageTypeUuid,
            };

            // Encrypt the bookImage data
            var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

            return Ok(new EncryptedPayload
            {
                EncryptedData = encryptedData.EncryptedData,
                Iv = encryptedData.Iv
            });
        }

        // PUT: api/BookImages/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBookImage(Guid id, EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true // Enable case-insensitive matching
                };
                var model = JsonSerializer.Deserialize<BookImageDto>(decryptedData, options);

                if (model == null) { return NotFound(); }

                if (id != model.ImageUuid)
                {
                    return BadRequest();
                }

                var bookImage = await _context.BookImages.FindAsync(id);

                if (bookImage != null)
                {
                    bookImage.ImageId = model.ImageId;
                    bookImage.ImageUuid = model.ImageUuid;
                    bookImage.BookUuid = model.BookUuid;
                    bookImage.ImageUrl = model.ImageUrl;
                    bookImage.ImageAlt = model.ImageAlt;
                    bookImage.IsCover = model.IsCover;
                    bookImage.CreatedAt = model.CreatedAt;
                    bookImage.UpdatedAt = DateTimeOffset.UtcNow; 
                    bookImage.ImageTypeUuid = model.ImageTypeUuid;
                }

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!BookImageExists(id))
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

        // POST: api/BookImages
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpPost]
        public async Task<ActionResult<EncryptedPayload>> PostBookImage(EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var model = JsonSerializer.Deserialize<BookImageDto>(decryptedData);

                if (model == null)
                {
                    return NoContent();
                }

                var bookImage = new BookImage()
                {
                    ImageId = model.ImageId,
                    ImageUuid = model.ImageUuid,
                    BookUuid = model.BookUuid,
                    ImageUrl = model.ImageUrl,
                    ImageAlt = model.ImageAlt,
                    IsCover = model.IsCover,
                    ImageOrder = model.ImageOrder,
                    CreatedAt = DateTimeOffset.UtcNow,
                    UpdatedAt = DateTimeOffset.UtcNow,
                    ImageTypeUuid = model.ImageTypeUuid,
                    
                };

                _context.BookImages.Add(bookImage);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetBookImage", model);
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

        // DELETE: api/BookImages/5
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBookImage(int id)
        {
            var bookImage = await _context.BookImages.FindAsync(id);
            if (bookImage == null)
            {
                return NotFound();
            }

            _context.BookImages.Remove(bookImage);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BookImageExists(Guid id)
        {
            return _context.BookImages.Any(e => e.ImageUuid == id);
        }
    }
}

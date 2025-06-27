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
    public class WishlistBooksController : ControllerBase
    {
        private readonly BookDbContext _context;

        public WishlistBooksController(BookDbContext context)
        {
            _context = context;
        }

        // GET: api/WishlistBooks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EncryptedPayload>>> GetWishlistBooks()
        {
            var wishlists = await _context.WishlistBooks.ToListAsync();

            if (wishlists.Count >= 1)
            {
                var model = wishlists.Select(x => new WishlistBookDto()
                {
                    WishlistId = x.WishlistId,
                    WishlistUuid = x.WishlistUuid,
                    UserUuid = x.UserUuid,
                    BookUuid = x.BookUuid,
                    WishlistDateAdd = x.WishlistDateAdd,
                }).ToList();
                // Encrypt the list of wishlists
                var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

                return Ok(new EncryptedPayload
                {
                    EncryptedData = encryptedData.EncryptedData,
                    Iv = encryptedData.Iv
                });
            }

            return NoContent();
        }

        // GET: api/WishlistBooks/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EncryptedPayload>> GetWishlistBook(Guid id)
        {
            var wishlist = await _context.WishlistBooks.FindAsync(id);

            if (wishlist == null)
            {
                return NotFound();
            }

            var model = new WishlistBookDto()
            {
                WishlistId = wishlist.WishlistId,
                WishlistUuid = wishlist.WishlistUuid,
                UserUuid = wishlist.UserUuid,
                BookUuid = wishlist.BookUuid,
                WishlistDateAdd = wishlist.WishlistDateAdd,
            };

            // Encrypt the list of wishlists
            var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

            return Ok(new EncryptedPayload
            {
                EncryptedData = encryptedData.EncryptedData,
                Iv = encryptedData.Iv
            });
        }

        // PUT: api/WishlistBooks/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult<EncryptedPayload>> PutWishlistBook(Guid id, EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true // Enable case-insensitive matching
                };
                var model = JsonSerializer.Deserialize<WishlistBookDto>(decryptedData, options);

                if (model == null) { return NotFound(); }

                if (id != model.WishlistUuid)
                {
                    return BadRequest();
                }

                var wishlist = await _context.WishlistBooks.FindAsync(id);

                if (wishlist != null)
                {
                    wishlist.WishlistId = model.WishlistId;
                    wishlist.WishlistUuid = model.WishlistUuid;
                    wishlist.UserUuid = model.UserUuid;
                    wishlist.BookUuid = model.BookUuid;
                    wishlist.WishlistDateAdd = model.WishlistDateAdd;
                }

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!WishlistBookExists(id))
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

        // POST: api/WishlistBooks
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<EncryptedPayload>> PostWishlistBook(EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var model = JsonSerializer.Deserialize<WishlistBookDto>(decryptedData);

                if (model == null)
                {
                    return NoContent();
                }

                var wishlist = new WishlistBook()
                {
                    UserUuid = model.UserUuid,
                    BookUuid = model.BookUuid,
                    WishlistDateAdd = DateTimeOffset.UtcNow,
                };

                _context.WishlistBooks.Add(wishlist);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetWishlistBook", new { id = model.WishlistUuid }, model);
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

        // DELETE: api/WishlistBooks/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWishlistBook(int id)
        {
            var wishlist = await _context.WishlistBooks.FindAsync(id);
            if (wishlist == null)
            {
                return NotFound();
            }

            _context.WishlistBooks.Remove(wishlist);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool WishlistBookExists(Guid id)
        {
            return _context.WishlistBooks.Any(e => e.WishlistUuid == id);
        }
    }
}

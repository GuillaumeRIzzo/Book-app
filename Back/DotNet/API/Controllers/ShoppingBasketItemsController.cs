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
    public class ShoppingBasketItemsController : ControllerBase
    {
        private readonly BookDbContext _context;

        public ShoppingBasketItemsController(BookDbContext context)
        {
            _context = context;
        }

        // GET: api/ShoppingBasketItems
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EncryptedPayload>>> GetShoppingBasketItems()
        {
            var items = await _context.ShoppingBasketItems.ToListAsync();

            if (items.Count >= 1)
            {
                var model = items.Select(x => new ShoppingBasketItemDto()
                {
                    BasketUuid = x.BasketUuid,
                    BookUuid = x.BookUuid,
                    Quantity = x.Quantity,
                    UnitPrice = x.UnitPrice,
                }).ToList();
                // Encrypt the list of items
                var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

                return Ok(new EncryptedPayload
                {
                    EncryptedData = encryptedData.EncryptedData,
                    Iv = encryptedData.Iv
                });
            }

            return NoContent();
        }

        // GET: api/ShoppingBasketItems/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EncryptedPayload>> GetShoppingBasketItem(Guid id)
        {
            var item = await _context.ShoppingBasketItems.FindAsync(id);

            if (item == null)
            {
                return NotFound();
            }

            var model = new ShoppingBasketItemDto()
            {
                BasketUuid = item.BasketUuid,
                BookUuid = item.BookUuid,
                Quantity = item.Quantity,
                UnitPrice = item.UnitPrice
            };

            // Encrypt the list of items
            var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

            return Ok(new EncryptedPayload
            {
                EncryptedData = encryptedData.EncryptedData,
                Iv = encryptedData.Iv
            });
        }

        // PUT: api/ShoppingBasketItems/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult<EncryptedPayload>> PutShoppingBasketItem(Guid id, EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true // Enable case-insensitive matching
                };
                var model = JsonSerializer.Deserialize<ShoppingBasketItemDto>(decryptedData, options);

                if (model == null) { return NotFound(); }

                if (id != model.BasketUuid)
                {
                    return BadRequest();
                }

                var item = await _context.ShoppingBasketItems.FindAsync(id);

                if (item != null)
                {
                    item.BasketUuid = model.BasketUuid;
                    item.BookUuid = model.BookUuid;
                    item.Quantity = model.Quantity;
                    item.UnitPrice = model.UnitPrice;
                }

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ShoppingBasketItemExists(id))
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

        // POST: api/ShoppingBasketItems
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<EncryptedPayload>> PostShoppingBasketItem(EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var model = JsonSerializer.Deserialize<ShoppingBasketItemDto>(decryptedData);

                if (model == null)
                {
                    return NoContent();
                }

                var item = new ShoppingBasketItem()
                {
                    BookUuid = model.BookUuid,
                    Quantity = model.Quantity,
                    UnitPrice = model.UnitPrice,
                };

                _context.ShoppingBasketItems.Add(item);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetShoppingBasketItem", new { id = model.BasketUuid }, model);
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

        // DELETE: api/ShoppingBasketItems/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteShoppingBasketItem(int id)
        {
            var item = await _context.ShoppingBasketItems.FindAsync(id);
            if (item == null)
            {
                return NotFound();
            }

            _context.ShoppingBasketItems.Remove(item);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ShoppingBasketItemExists(Guid id)
        {
            return _context.ShoppingBasketItems.Any(e => e.BasketUuid == id);
        }
    }
}

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
    public class ShoppingBasketsController : ControllerBase
    {
        private readonly BookDbContext _context;

        public ShoppingBasketsController(BookDbContext context)
        {
            _context = context;
        }

        // GET: api/ShoppingBaskets
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EncryptedPayload>>> GetShoppingBaskets()
        {
            var baskets = await _context.ShoppingBaskets.ToListAsync();

            if (baskets.Count >= 1)
            {
                var model = baskets.Select(x => new ShoppingBasketDto()
                {
                    BasketId = x.BasketId,
                    BasketUuid = x.BasketUuid,
                    UserUuid = x.UserUuid,
                    BasketDateCreated = x.BasketDateCreated,
                    IsFinalized = x.IsFinalized,
                }).ToList();
                // Encrypt the list of baskets
                var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

                return Ok(new EncryptedPayload
                {
                    EncryptedData = encryptedData.EncryptedData,
                    Iv = encryptedData.Iv
                });
            }

            return NoContent();
        }

        // GET: api/ShoppingBaskets/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EncryptedPayload>> GetShoppingBasket(Guid id)
        {
            var basket = await _context.ShoppingBaskets.FindAsync(id);

            if (basket == null)
            {
                return NotFound();
            }

            var model = new ShoppingBasketDto()
            {
                BasketId = basket.BasketId,
                BasketUuid= basket.BasketUuid,
                UserUuid = basket.UserUuid,
                BasketDateCreated = basket.BasketDateCreated,
                IsFinalized = basket.IsFinalized
            };

            // Encrypt the list of baskets
            var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

            return Ok(new EncryptedPayload
            {
                EncryptedData = encryptedData.EncryptedData,
                Iv = encryptedData.Iv
            });
        }

        // PUT: api/ShoppingBaskets/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult<EncryptedPayload>> PutShoppingBasket(Guid id, EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true // Enable case-insensitive matching
                };
                var model = JsonSerializer.Deserialize<ShoppingBasketDto>(decryptedData, options);

                if (model == null) { return NotFound(); }

                if (id != model.BasketUuid)
                {
                    return BadRequest();
                }

                var basket = await _context.ShoppingBaskets.FindAsync(id);

                if (basket != null)
                {
                    basket.BasketId = model.BasketId;
                    basket.BasketUuid = model.BasketUuid;
                    basket.UserUuid = model.UserUuid;
                    basket.BasketDateCreated = model.BasketDateCreated;
                    basket.IsFinalized = model.IsFinalized;
                }

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ShoppingBasketExists(id))
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

        // POST: api/ShoppingBaskets
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<EncryptedPayload>> PostShoppingBasket(EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var model = JsonSerializer.Deserialize<ShoppingBasketDto>(decryptedData);

                if (model == null)
                {
                    return NoContent();
                }

                var basket = new ShoppingBasket()
                {
                    UserUuid = model.UserUuid,
                    BasketDateCreated = DateTimeOffset.UtcNow,
                    IsFinalized = model.IsFinalized,
                };

                _context.ShoppingBaskets.Add(basket);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetShoppingBasket", new { id = model.BasketUuid }, model);
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

        // DELETE: api/ShoppingBaskets/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteShoppingBasket(int id)
        {
            var basket = await _context.ShoppingBaskets.FindAsync(id);
            if (basket == null)
            {
                return NotFound();
            }

            _context.ShoppingBaskets.Remove(basket);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ShoppingBasketExists(Guid id)
        {
            return _context.ShoppingBaskets.Any(e => e.BasketUuid == id);
        }
    }
}

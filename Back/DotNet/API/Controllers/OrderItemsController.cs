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
    public class OrderItemsController : ControllerBase
    {
        private readonly BookDbContext _context;

        public OrderItemsController(BookDbContext context)
        {
            _context = context;
        }

        // GET: api/OrderItems
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EncryptedPayload>>> GetOrderItems()
        {
            var items = await _context.OrderItems.ToListAsync();

            if (items.Count >= 1)
            {
                var model = items.Select(x => new OrderItemDto()
                {
                    OrderUuid = x.OrderUuid,
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

        // GET: api/OrderItems/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EncryptedPayload>> GetOrderItem(Guid orderUuid, Guid bookUuid)
        {
            var item = await _context.OrderItems.FindAsync(orderUuid, bookUuid);

            if (item == null)
            {
                return NotFound();
            }

            var model = new OrderItemDto()
            {
                OrderUuid = item.OrderUuid,
                BookUuid = item.BookUuid,
                Quantity = item.Quantity,
                UnitPrice = item.UnitPrice,
            };

            // Encrypt the list of items
            var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

            return Ok(new EncryptedPayload
            {
                EncryptedData = encryptedData.EncryptedData,
                Iv = encryptedData.Iv
            });
        }

        // PUT: api/OrderItems/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult<EncryptedPayload>> PutOrderItem(Guid orderUuid, Guid bookUuid, EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true // Enable case-insensitive matching
                };
                var model = JsonSerializer.Deserialize<OrderItemDto>(decryptedData, options);

                if (model == null) { return NotFound(); }

                if (orderUuid != model.OrderUuid && bookUuid != model.BookUuid)
                {
                    return BadRequest();
                }

                var item = await _context.OrderItems.FindAsync(orderUuid, bookUuid);

                if (item != null)
                {
                    item.OrderUuid = model.OrderUuid;
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
                    if (!OrderItemExists(orderUuid))
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

        // POST: api/OrderItems
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<EncryptedPayload>> PostOrderItem(EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var model = JsonSerializer.Deserialize<OrderItemDto>(decryptedData);

                if (model == null)
                {
                    return NoContent();
                }

                var item = new OrderItem()
                {
                    OrderUuid = model.OrderUuid,
                    BookUuid = model.BookUuid,
                    Quantity = model.Quantity,
                    UnitPrice = model.UnitPrice,
                };

                _context.OrderItems.Add(item);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetOrderItem", new { orderUuid = model.OrderUuid, bookUuid = model.BookUuid }, model);
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

        // DELETE: api/OrderItems/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrderItem(int id)
        {
            var item = await _context.OrderItems.FindAsync(id);
            if (item == null)
            {
                return NotFound();
            }

            _context.OrderItems.Remove(item);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool OrderItemExists(Guid id)
        {
            return _context.OrderItems.Any(e => e.OrderUuid == id);
        }
    }
}

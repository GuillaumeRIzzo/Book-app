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
    public class OrderHistoriesController : ControllerBase
    {
        private readonly BookDbContext _context;

        public OrderHistoriesController(BookDbContext context)
        {
            _context = context;
        }

        // GET: api/OrderHistories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EncryptedPayload>>> GetOrderHistories()
        {
            var orders = await _context.OrderHistories.ToListAsync();

            if (orders.Count >= 1)
            {
                var model = orders.Select(x => new OrderHistoryDto()
                {
                    OrderId = x.OrderId,
                    OrderUuid = x.OrderUuid,
                    UserUuid = x.UserUuid,
                    OrderDate = x.OrderDate,
                    TotalAmount = x.TotalAmount
                }).ToList();
                // Encrypt the list of orders
                var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

                return Ok(new EncryptedPayload
                {
                    EncryptedData = encryptedData.EncryptedData,
                    Iv = encryptedData.Iv
                });
            }

            return NoContent();
        }

        // GET: api/OrderHistories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EncryptedPayload>> GetOrderHistorie(Guid id)
        {
            var order = await _context.OrderHistories.FindAsync(id);

            if (order == null)
            {
                return NotFound();
            }

            var model = new OrderHistoryDto()
            {
                OrderId= order.OrderId,
                OrderUuid = order.OrderUuid,
                UserUuid = order.UserUuid,
                OrderDate = order.OrderDate,
                TotalAmount = order.TotalAmount
            };

            // Encrypt the list of orders
            var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

            return Ok(new EncryptedPayload
            {
                EncryptedData = encryptedData.EncryptedData,
                Iv = encryptedData.Iv
            });
        }

        // PUT: api/OrderHistories/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult<EncryptedPayload>> PutOrderHistorie(Guid id, EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true // Enable case-insensitive matching
                };
                var model = JsonSerializer.Deserialize<OrderHistoryDto>(decryptedData, options);

                if (model == null) { return NotFound(); }

                if (id != model.OrderUuid)
                {
                    return BadRequest();
                }

                var order = await _context.OrderHistories.FindAsync(id);

                if (order != null)
                {
                    order.OrderId = model.OrderId;
                    order.OrderUuid = model.OrderUuid;
                    order.UserUuid = model.UserUuid;
                    order.OrderDate = model.OrderDate;
                    order.TotalAmount = model.TotalAmount;
                }

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!OrderHistorieExists(id))
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

        // POST: api/OrderHistories
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<EncryptedPayload>> PostOrderHistorie(EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var model = JsonSerializer.Deserialize<OrderHistoryDto>(decryptedData);

                if (model == null)
                {
                    return NoContent();
                }

                var order = new OrderHistory()
                {
                    UserUuid = model.UserUuid,
                    OrderDate = DateTimeOffset.UtcNow,
                    TotalAmount = model.TotalAmount,
                };

                _context.OrderHistories.Add(order);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetOrderHistorie", new { id = model.OrderUuid }, model);
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

        // DELETE: api/OrderHistories/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrderHistorie(int id)
        {
            var order = await _context.OrderHistories.FindAsync(id);
            if (order == null)
            {
                return NotFound();
            }

            _context.OrderHistories.Remove(order);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool OrderHistorieExists(Guid id)
        {
            return _context.OrderHistories.Any(e => e.OrderUuid == id);
        }
    }
}

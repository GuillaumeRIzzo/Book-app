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
    public class ReadListsController : ControllerBase
    {
        private readonly BookDbContext _context;

        public ReadListsController(BookDbContext context)
        {
            _context = context;
        }

        // GET: api/ReadLists
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EncryptedPayload>>> GetReadLists()
        {
            var readLists = await _context.ReadLists.ToListAsync();

            if (readLists.Count >= 1)
            {
                var model = readLists.Select(x => new ReadListDto()
                {
                    ReadListId = x.ReadListId,
                    ReadListUuid = x.ReadListUuid,
                    UserUuid = x.UserUuid,
                    ReadListName = x.ReadListName,
                    CreatedAt = x.CreatedAt,
                    UpdatedAt = x.UpdatedAt,
                }).ToList();
                // Encrypt the list of readLists
                var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

                return Ok(new EncryptedPayload
                {
                    EncryptedData = encryptedData.EncryptedData,
                    Iv = encryptedData.Iv
                });
            }

            return NoContent();
        }

        // GET: api/ReadLists/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EncryptedPayload>> GetReadList(Guid id)
        {
            var readList = await _context.ReadLists.FindAsync(id);

            if (readList == null)
            {
                return NotFound();
            }

            var model = new ReadListDto()
            {
                ReadListId = readList.ReadListId,
                ReadListUuid = readList.ReadListUuid,
                UserUuid = readList.UserUuid,
                ReadListName = readList.ReadListName,
                CreatedAt = readList.CreatedAt,
                UpdatedAt = readList.UpdatedAt,
            };

            // Encrypt the list of readLists
            var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

            return Ok(new EncryptedPayload
            {
                EncryptedData = encryptedData.EncryptedData,
                Iv = encryptedData.Iv
            });
        }

        // PUT: api/ReadLists/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult<EncryptedPayload>> PutReadList(Guid id, EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true // Enable case-insensitive matching
                };
                var model = JsonSerializer.Deserialize<ReadListDto>(decryptedData, options);

                if (model == null) { return NotFound(); }

                if (id != model.ReadListUuid)
                {
                    return BadRequest();
                }

                if (ReadListNameExists(model.ReadListName, id, model.UserUuid))
                {
                    return BadRequest("Name already exists");
                }

                var readList = await _context.ReadLists.FindAsync(id);

                if (readList != null)
                {
                    readList.ReadListId = model.ReadListId;
                    readList.ReadListUuid = model.ReadListUuid;
                    readList.UserUuid = model.UserUuid;
                    readList.ReadListName = model.ReadListName;
                    readList.CreatedAt = model.CreatedAt;
                    readList.UpdatedAt = DateTimeOffset.UtcNow;

                }

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ReadListExists(id))
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

        // POST: api/ReadLists
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<EncryptedPayload>> PostReadList(EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var model = JsonSerializer.Deserialize<ReadListDto>(decryptedData);

                if (model == null)
                {
                    return NoContent();
                }

                if (ReadListNameExists(model.ReadListName, Guid.Empty, Guid.Empty))
                {
                    return BadRequest("Name already exists");
                }

                var readList = new ReadList()
                {
                    UserUuid = model.ReadListUuid,
                    ReadListName = model.ReadListName,
                    CreatedAt = DateTimeOffset.UtcNow,
                    UpdatedAt = DateTimeOffset.UtcNow,
                };

                _context.ReadLists.Add(readList);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetReadList", new { id = model.ReadListUuid }, model);
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

        // DELETE: api/ReadLists/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReadList(int id)
        {
            var readList = await _context.ReadLists.FindAsync(id);
            if (readList == null)
            {
                return NotFound();
            }

            _context.ReadLists.Remove(readList);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ReadListExists(Guid id)
        {
            return _context.ReadLists.Any(e => e.ReadListUuid == id);
        }

        private bool ReadListNameExists(string name, Guid preferenceUuid, Guid userUuid)
        {
            return _context.ReadLists.Any(p => p.ReadListName == name && p.ReadListUuid != preferenceUuid && p.UserUuid != userUuid);
        }
    }
}

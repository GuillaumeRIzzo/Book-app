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
    public class CategoriesController : ControllerBase
    {
        private readonly BookDbContext _context;

        public CategoriesController(BookDbContext context)
        {
            _context = context;
        }

        // GET: api/Categories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EncryptedPayload>>> GetCategories()
        {
            var categories = await _context.Categories.ToListAsync();

            if (categories.Count >= 1)
            {
                var model = categories.Select(x => new CategoryDto()
                {
                    CategoryId = x.CategoryId,
                    CategoryUuid = x.CategoryUuid,
                    CategoryName = x.CategoryName,
                    CategoryDescription = x.CategoryDescription,
                    ImageUrl = x.ImageUrl,
                    ImageAlt = x.ImageAlt,
                    CreatedAt = x.CreatedAt,
                    UpdatedAt = x.UpdatedAt
                }).ToList();

                // Encrypt the list of categories
                var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

                return Ok(new EncryptedPayload
                {
                    EncryptedData = encryptedData.EncryptedData,
                    Iv = encryptedData.Iv
                });
            }

            return NoContent();
        }

        // GET: api/Categories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EncryptedPayload>> GetCategory(Guid id)
        {
            var category = await _context.Categories.FindAsync(id);

            if (category == null)
            {
                return NotFound();
            }

            var model = new CategoryDto()
            {
                CategoryId = category.CategoryId,
                CategoryUuid = category.CategoryUuid,
                CategoryName= category.CategoryName,
                CategoryDescription = category.CategoryDescription,
                ImageUrl = category.ImageUrl,
                ImageAlt = category.ImageAlt,
                CreatedAt = category.CreatedAt,
                UpdatedAt = category.UpdatedAt
            };


            // Encrypt the list of publishers
            var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

            return Ok(new EncryptedPayload
            {
                EncryptedData = encryptedData.EncryptedData,
                Iv = encryptedData.Iv
            });
        }

        // PUT: api/Categories/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCategory(Guid id, EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true // Enable case-insensitive matching
                };
                var model = JsonSerializer.Deserialize<CategoryDto>(decryptedData, options);

                if (model == null) { return NotFound(); }

                if (id != model.CategoryUuid)
                {
                    return BadRequest();
                }

                if (CategoryNameExists(model.CategoryName, id))
                {
                    return BadRequest("Name already exists");
                }

                var category = await _context.Categories.FindAsync(id);
                if (category != null)
                {
                    category.CategoryId = model.CategoryId;
                    category.CategoryUuid = model.CategoryUuid;
                    category.CategoryName = model.CategoryName;
                    category.CategoryDescription = model.CategoryDescription;
                    category.ImageUrl = model.ImageUrl;
                    category.ImageAlt = model.ImageAlt;
                    category.CreatedAt = model.CreatedAt;
                    category.UpdatedAt = model.UpdatedAt;
                }

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!CategoryExists(id))
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

        // POST: api/Categories
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpPost]
        public async Task<ActionResult<EncryptedPayload>> PostCategory(EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var model = JsonSerializer.Deserialize<CategoryDto>(decryptedData);

                if (model == null)
                {
                    return NoContent();
                }

                if (CategoryNameExists(model.CategoryName, Guid.Empty))
                {
                    return BadRequest("Name already exists");
                }

                var category = new Category()
                {
                    CategoryName = model.CategoryName,
                    CategoryDescription = model.CategoryDescription
                };

                _context.Categories.Add(category);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetCategory", new { id = category.CategoryUuid }, model);
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

        // DELETE: api/Categories/5
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var Category = await _context.Categories.FindAsync(id);
            if (Category == null)
            {
                return NotFound();
            }

            _context.Categories.Remove(Category);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CategoryExists(Guid id)
        {
            return _context.Categories.Any(e => e.CategoryUuid == id);
        }

        private bool CategoryNameExists(string name, Guid id)
        {
            return _context.Categories.Any(bc => bc.CategoryName == name && bc.CategoryUuid != id);
        }
    }
}

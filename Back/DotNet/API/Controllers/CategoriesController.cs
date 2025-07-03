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
    public class CategoriesController : ControllerBase
    {
        private readonly BookDbContext _context;

        public CategoriesController(BookDbContext context)
        {
            _context = context;
        }

        // GET: api/Categories?languageUuid=...
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EncryptedPayload>>> GetCategories([FromQuery] Guid? languageUuid = null)
        {
            var categories = await _context.Categories
                .Include(c => c.CategoryTranslations) // inclure les traductions
                .ToListAsync();

            if (categories.Count < 1)
                return NoContent();

            var model = categories.Select(c =>
            {
                // Chercher la traduction correspondant à languageUuid s’il est fourni
                var translation = languageUuid.HasValue
                    ? c.CategoryTranslations.FirstOrDefault(t => t.LanguageUuid == languageUuid.Value)
                    : null;

                return new CategoryDto()
                {
                    CategoryId = c.CategoryId,
                    CategoryUuid = c.CategoryUuid,
                    // Si traduction dispo et non nulle, utiliser la traduction sinon la valeur par défaut
                    CategoryName = translation?.TranslatedName ?? c.CategoryName,
                    CategoryDescription = translation?.TranslatedDescription ?? c.CategoryDescription,
                    ImageUrl = c.ImageUrl,
                    ImageAlt = c.ImageAlt,
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt
                };
            }).ToList();

            var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

            return Ok(new EncryptedPayload
            {
                EncryptedData = encryptedData.EncryptedData,
                Iv = encryptedData.Iv
            });
        }

        // GET: api/Categories/{uuid}?languageUuid=...
        [HttpGet("{uuid}")]
        public async Task<ActionResult<EncryptedPayload>> GetCategory(Guid uuid, [FromQuery] Guid? languageUuid = null)
        {
            var category = await _context.Categories
                .Include(c => c.CategoryTranslations)
                .FirstOrDefaultAsync(c => c.CategoryUuid == uuid);

            if (category == null)
                return NotFound();

            var translation = languageUuid.HasValue
                ? category.CategoryTranslations.FirstOrDefault(t => t.LanguageUuid == languageUuid.Value)
                : null;

            var model = new CategoryDto()
            {
                CategoryId = category.CategoryId,
                CategoryUuid = category.CategoryUuid,
                CategoryName = translation?.TranslatedName ?? category.CategoryName,
                CategoryDescription = translation?.TranslatedDescription ?? category.CategoryDescription,
                ImageUrl = category.ImageUrl,
                ImageAlt = category.ImageAlt,
                CreatedAt = category.CreatedAt,
                UpdatedAt = category.UpdatedAt
            };

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

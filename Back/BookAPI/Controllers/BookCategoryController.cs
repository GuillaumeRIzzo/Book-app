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
    public class BookCategoryController : ControllerBase
    {
        private readonly BookDbContext _context;

        public BookCategoryController(BookDbContext context)
        {
            _context = context;
        }

        // GET: api/BookCategories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EncryptedPayload>>> GetBookCategories()
        {
            var categories = await _context.BookCategories.ToListAsync();

            if (categories.Count >= 1)
            {
                var model = categories.Select(x => new ModelViewBookCategory()
                {
                    BookCategoId = x.BookCategoId,
                    BookCategoName = x.BookCategoName,
                    BookCategoDescription = x.BookCategoDescription
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

        // GET: api/BookCategories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ModelViewBookCategory>> GetBookCategory(int id)
        {
            var bookCategory = await _context.BookCategories.FindAsync(id);

            if (bookCategory == null)
            {
                return NotFound();
            }

            var model = new ModelViewBookCategory()
            {
                BookCategoId= bookCategory.BookCategoId,
                BookCategoName= bookCategory.BookCategoName,
                BookCategoDescription = bookCategory.BookCategoDescription
            };

            return model;
        }

        // PUT: api/BookCategories/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBookCategory(int id, ModelViewBookCategory model)
        {
            if (id != model.BookCategoId)
            {
                return BadRequest();
            }

            if (BookCategoryNameExists(model.BookCategoName, id))
            {
                return BadRequest("Name already exists");
            }

            var bookCategory = await _context.BookCategories.FindAsync(id);
            if (bookCategory != null)
            {
                bookCategory.BookCategoId = model.BookCategoId;
                bookCategory.BookCategoName = model.BookCategoName;
                bookCategory.BookCategoDescription = model.BookCategoDescription;
                
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BookCategoryExists(id))
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

        // POST: api/BookCategories
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpPost]
        public async Task<ActionResult<ModelViewBookCategory>> PostBookCategory(ModelViewBookCategory model)
        {
            if (model == null)
            {
                return NoContent();
            }

            if (BookCategoryNameExists(model.BookCategoName, 0))
            {
                return BadRequest("Name already exists");
            }

            var bookCategory = new BookCategory()
            {
                BookCategoName = model.BookCategoName,
                BookCategoDescription = model.BookCategoDescription
            };

            _context.BookCategories.Add(bookCategory);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetBookCategory", new { id = bookCategory.BookCategoId }, model);
        }

        // DELETE: api/BookCategories/5
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBookCategory(int id)
        {
            var bookCategory = await _context.BookCategories.FindAsync(id);
            if (bookCategory == null)
            {
                return NotFound();
            }

            _context.BookCategories.Remove(bookCategory);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BookCategoryExists(int id)
        {
            return _context.BookCategories.Any(e => e.BookCategoId == id);
        }

        private bool BookCategoryNameExists(string name, int id)
        {
            return _context.BookCategories.Any(bc => bc.BookCategoName == name && bc.BookCategoId != id);
        }
    }
}

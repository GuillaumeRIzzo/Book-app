using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BookAPI.Models;
using Microsoft.AspNetCore.Authorization;

namespace BookAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryListsController : ControllerBase
    {
        private readonly BookDbContext _context;

        public CategoryListsController(BookDbContext context)
        {
            _context = context;
        }

        // GET: api/CategoryLists
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ModelViewCategoryList>>> GetCategoryLists()
        {
            var list = await _context.CategoryLists.ToListAsync();

            if (list.Count >= 1)
            {
                var model = list.Select(x => new ModelViewCategoryList()
                {
                    BookCategoId = x.BookCategoId,
                    BookId = x.BookId
                }).ToList();
                return model;
            }
            return NoContent();
        }

        // GET: api/CategoryLists/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ModelViewCategoryList>> GetCategoryList(int id)
        {
            var categorieList = await _context.CategoryLists.FindAsync(id);

            if (categorieList == null)
            {
                return NotFound();
            }

            var model = new ModelViewCategoryList()
            {
                BookId = categorieList.BookId,
                BookCategoId = categorieList.BookCategoId
            };

            return model;
        }

        // PUT: api/CategoryLists/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpPut("{id}")]
        public async Task PutCategoryList(int bookId, IEnumerable<ModelViewBookCategory> categories)
        {
            // Get existing categories associated with the book
            var existingCategories = await _context.CategoryLists
                .Where(cl => cl.BookId == bookId)
                .ToListAsync();

            // Get list of category IDs associated with the book
            var existingCategoryIds = existingCategories.Select(cl => cl.BookCategoId).ToList();
            var newCategoryIds = categories.Select(c => c.BookCategoId).ToList();

            // Remove categories not in the new list
            var categoriesToRemove = existingCategories
                .Where(cl => !newCategoryIds.Contains(cl.BookCategoId))
                .ToList();

            foreach (var categoryToRemove in categoriesToRemove)
            {
                _context.CategoryLists.Remove(categoryToRemove);
            }

            // Add new categories
            var categoriesToAdd = newCategoryIds
                .Where(id => !existingCategoryIds.Contains(id))
                .Select(id => new CategoryList { BookId = bookId, BookCategoId = id })
                .ToList();

            _context.CategoryLists.AddRange(categoriesToAdd);

            await _context.SaveChangesAsync();
        }
        // POST: api/CategoryLists
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpPost]
        public async Task<ActionResult<IEnumerable<ModelViewCategoryList>>> PostCategorieList(IEnumerable<ModelViewCategoryList> models)
        {
            if (models == null || !models.Any())
            {
                return BadRequest("No data provided.");
            }

            foreach (var model in models)
            {
                if (model == null || model.BookId == 0)
                {
                    return BadRequest("Invalid data provided.");
                }

                var categorieList = new CategoryList()
                {
                    BookCategoId = model.BookCategoId,
                    BookId = model.BookId
                };

                _context.CategoryLists.Add(categorieList);
                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateException)
                {
                    if (CategorieListExists(categorieList.BookId))
                    {
                        return Conflict($"Conflict occurred for BookId: {categorieList.BookId}");
                    }
                    else
                    {
                        throw;
                    }
                }
            }

            return CreatedAtAction("GetCategorieList", models);
        }

        // DELETE: api/CategoryLists/5
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategoryList(int id)
        {
            var categorieList = await _context.CategoryLists.FindAsync(id);
            if (categorieList == null)
            {
                return NotFound();
            }

            _context.CategoryLists.Remove(categorieList);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CategorieListExists(int id)
        {
            return _context.CategoryLists.Any(e => e.BookId == id);
        }
    }
}

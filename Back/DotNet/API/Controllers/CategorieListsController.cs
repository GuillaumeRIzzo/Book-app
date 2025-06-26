using API.Data;
using API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryListsController : ControllerBase
    {
        //private readonly BookDbContext _context;

        //public CategoryListsController(BookDbContext context)
        //{
        //    _context = context;
        //}

        //// GET: api/CategoryLists
        //[HttpGet]
        //public async Task<ActionResult<IEnumerable<ModelViewCategoryList>>> GetCategoryLists()
        //{
        //    var list = await _context.CategoryLists.ToListAsync();

        //    if (list.Count >= 1)
        //    {
        //        var model = list.Select(x => new ModelViewCategoryList()
        //        {
        //            BookCategoId = x.BookCategoId,
        //            BookId = x.BookId
        //        }).ToList();
        //        return model;
        //    }
        //    return NoContent();
        //}

        //// GET: api/CategoryLists/5
        //[HttpGet("{id}")]
        //public async Task<ActionResult<ModelViewCategoryList>> GetCategoryList(int id)
        //{
        //    var categorieList = await _context.CategoryLists.FindAsync(id);

        //    if (categorieList == null)
        //    {
        //        return NotFound();
        //    }

        //    var model = new ModelViewCategoryList()
        //    {
        //        BookId = categorieList.BookId,
        //        BookCategoId = categorieList.BookCategoId
        //    };

        //    return model;
        //}

        //// PUT: api/CategoryLists/5
        //// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        //[Authorize(Policy = IdentityData.UserPolicyName)]
        //[HttpPut("{id}")]
        //public async Task<IActionResult> PutCategoryList(int bookId, IEnumerable<ModelViewBookCategory> categories)
        //{
        //    if (categories == null)
        //    {
        //        return BadRequest("Categories cannot be null");
        //    }

        //    // Get existing categories associated with the book
        //    var existingCategories = await _context.CategoryLists
        //     .Where(cl => cl.BookId == bookId)
        //     .ToListAsync();

        //    if (existingCategories == null)
        //    {
        //        return NotFound();
        //    }

        //    // Get list of category IDs associated with the book
        //    var existingCategoryIds = existingCategories.Select(cl => cl.BookCategoId).ToList();
        //    var newCategoryIds = categories.Select(c => c.BookCategoId).ToList();

        //    // Remove categories not in the new list
        //    var categoriesToRemove = existingCategories
        //        .Where(cl => !newCategoryIds.Contains(cl.BookCategoId))
        //        .ToList();

        //    foreach (var categoryToRemove in categoriesToRemove)
        //    {
        //        _context.CategoryLists.Remove(categoryToRemove);
        //    }

        //    // Add new categories
        //    var categoriesToAdd = newCategoryIds
        //        .Where(id => !existingCategoryIds.Contains(id))
        //        .Select(id => new CategoryList { BookId = bookId, BookCategoId = id })
        //        .ToList();

        //    _context.CategoryLists.AddRange(categoriesToAdd);

        //    try
        //    {
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!CategoryListExists(bookId))
        //        {
        //            return NotFound();
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return NoContent();
        //}

        //private bool CategoryListExists(int bookId)
        //{
        //    return _context.CategoryLists.Any(e => e.BookId == bookId);
        //}

        //// POST: api/CategoryLists
        //// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        //[Authorize(Policy = IdentityData.UserPolicyName)]
        //[HttpPost]
        //public async Task<ActionResult<IEnumerable<ModelViewCategoryList>>> PostCategorieList(IEnumerable<ModelViewCategoryList> models)
        //{
        //    if (models == null || !models.Any())
        //    {
        //        return BadRequest("No data provided.");
        //    }

        //    foreach (var model in models)
        //    {
        //        if (model == null || model.BookId == 0)
        //        {
        //            return BadRequest("Invalid data provided.");
        //        }

        //        var bookCategory = await _context.BookCategories.FindAsync(model.BookCategoId);
        //        if (bookCategory == null)
        //        {
        //            return BadRequest($"BookCategory with ID {model.BookCategoId} does not exist.");
        //        }

        //        var categorieList = new CategoryList()
        //        {
        //            BookCategoId = model.BookCategoId,
        //            BookId = model.BookId
        //        };

        //        _context.CategoryLists.Add(categorieList);
        //    }

        //    try
        //    {
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (DbUpdateException ex)
        //    {
        //        return Conflict($"Database update failed: {ex.Message}");
        //    }

        //    return CreatedAtAction("GetCategoryList", models);
        //}

        //// DELETE: api/CategoryLists/5
        //[Authorize(Policy = IdentityData.UserPolicyName)]
        //[HttpDelete("{id}")]
        //public async Task<IActionResult> DeleteCategoryList(int id)
        //{
        //    var categorieList = await _context.CategoryLists.FindAsync(id);
        //    if (categorieList == null)
        //    {
        //        return NotFound();
        //    }

        //    _context.CategoryLists.Remove(categorieList);
        //    await _context.SaveChangesAsync();

        //    return NoContent();
        //}
    }
}

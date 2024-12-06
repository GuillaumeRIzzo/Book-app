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
    public class BooksController : ControllerBase
    {
        private readonly BookDbContext _context;
        private readonly CategoryListsController _categoryListsController;

        public BooksController(BookDbContext context, CategoryListsController categoryListsController)
        {
            _context = context;
            _categoryListsController = categoryListsController ?? throw new ArgumentNullException(nameof(categoryListsController));
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<EncryptedPayload>>> GetBooks(int? userId)
        {
            var books = await _context.Books.ToListAsync();

            if (books.Count >= 1)
            {
                var model = books.Select(x => new ModelViewBook()
                {
                    BookId = x.BookId,
                    BookTitle = x.BookTitle,
                    BookDescription = x.BookDescription,
                    BookPublishDate = x.BookPublishDate,
                    BookPageCount = x.BookPageCount,
                    BookAverageRating = x.BookAverageRating,
                    BookRatingCount = x.BookRatingCount,
                    BookImageLink = x.BookImageLink,
                    BookLanguage = x.BookLanguage,
                    PublisherId = x.PublisherId,
                    AuthorId = x.AuthorId
                }).ToList();

                foreach (var item in model)
                {
                    var p = await _context.Readlists.FirstOrDefaultAsync(p =>
                                p.UserId == userId && p.BookId == item.BookId);
                    if (p != null)
                    {
                        item.InList = true;
                        item.Read = p.ReadListRead;
                    }

                    // Fetch and populate categories for each book
                    var categories = await _context.CategoryLists
                        .Where(cl => cl.BookId == item.BookId)
                        .Select(cl => new ModelViewBookCategory()
                        {
                            BookCategoId = cl.BookCategoId,
                            BookCategoName = cl.BookCategory.BookCategoName,
                            BookCategoDescription = cl.BookCategory.BookCategoDescription
                        })
                        .ToListAsync();

                    item.Categories = categories;
                }
                // Encrypt the list of books
                var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

                return Ok(new EncryptedPayload
                {
                    EncryptedData = encryptedData.EncryptedData,
                    Iv = encryptedData.Iv
                });
            }

            return NoContent();
        }

        // GET: api/Books/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EncryptedPayload>> GetBook(int id)
        {
            var book = await _context.Books.FindAsync(id);

            if (book == null)
            {
                return NotFound();
            }

            var model = new ModelViewBook()
            {
                BookId = book.BookId,
                BookTitle = book.BookTitle,
                BookDescription = book.BookDescription,
                BookPublishDate = book.BookPublishDate,
                BookPageCount = book.BookPageCount,
                BookAverageRating = book.BookAverageRating,
                BookRatingCount = book.BookRatingCount,
                BookImageLink = book.BookImageLink,
                BookLanguage = book.BookLanguage,
                PublisherId = book.PublisherId,
                AuthorId = book.AuthorId
            };

            // Fetch and populate categories for each book
            var categories = await _context.CategoryLists
                .Where(cl => cl.BookId == model.BookId)
                .Select(cl => new ModelViewBookCategory()
                {
                    BookCategoId = cl.BookCategoId,
                    BookCategoName = cl.BookCategory.BookCategoName,
                    BookCategoDescription = cl.BookCategory.BookCategoDescription
                })
                .ToListAsync();

            model.Categories = categories;

            // Encrypt the book data
            var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

            return Ok(new EncryptedPayload
            {
                EncryptedData = encryptedData.EncryptedData,
                Iv = encryptedData.Iv
            });
        }

        // PUT: api/Books/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBook(int id, EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true // Enable case-insensitive matching
                };
                var model = JsonSerializer.Deserialize<ModelViewBook>(decryptedData, options);

                if (id != model.BookId)
                {
                    return BadRequest();
                }

                var book = await _context.Books.FindAsync(id);

                if (book == null)
                {
                    return NotFound();
                }

                book.BookId = model.BookId;
                book.BookTitle = model.BookTitle;
                book.BookDescription = model.BookDescription;
                book.BookPublishDate = model.BookPublishDate;
                book.BookPageCount = model.BookPageCount;
                book.BookAverageRating = model.BookAverageRating;
                book.BookRatingCount = model.BookRatingCount;
                book.BookImageLink = model.BookImageLink;
                book.BookLanguage = model.BookLanguage;
                book.PublisherId = model.PublisherId;
                book.AuthorId = model.AuthorId;

                try
                {
                    await _context.SaveChangesAsync();
                    await _categoryListsController.PutCategoryList(model.BookId, model.Categories);
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!BookExists(id))
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

        // POST: api/Books
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpPost]
        public async Task<ActionResult<ModelViewBook>> PostBook(ModelViewBook model)
        {
            if (model == null)
            {
                return NoContent();
            }

            var book = new Book()
            {
                BookTitle = model.BookTitle,
                BookDescription = model.BookDescription,
                BookPublishDate = model.BookPublishDate,
                BookPageCount = model.BookPageCount,
                BookAverageRating = model.BookAverageRating,
                BookRatingCount = model.BookRatingCount,
                BookImageLink = model.BookImageLink,
                BookLanguage = model.BookLanguage,
                PublisherId = model.PublisherId,
                AuthorId = model.AuthorId
            };

            _context.Books.Add(book);
            await _context.SaveChangesAsync();

            model.BookId = book.BookId;

            var categoryModels = model.Categories.Select(categoId => new ModelViewCategoryList
            {
                BookId = model.BookId,
                BookCategoId = categoId.BookCategoId
            }).ToList();

            await _categoryListsController.PostCategorieList(categoryModels);
            return CreatedAtAction("GetBook", new { id = model.BookId }, model);
        }

        // DELETE: api/Books/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound();
            }

            _context.Books.Remove(book);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BookExists(int id)
        {
            return _context.Books.Any(e => e.BookId == id);
        }
    }
}

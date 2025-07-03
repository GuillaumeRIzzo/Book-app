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
    public class BooksController : ControllerBase
    {
        private readonly BookDbContext _context;

        public BooksController(BookDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<EncryptedPayload>> GetBooks([FromQuery] Guid? languageUuid)
        {
            var books = await _context.Books
                .Include(b => b.AuthorUus)
                .Include(b => b.CategoryUus)
                .Include(b => b.PublisherUus)
                .Include(b => b.TagUus)
                .Include(b => b.BookImages)
                .Include(b => b.BookLanguages)
                .Include(b => b.BookTranslations)
                .ToListAsync();

            if (!books.Any())
                return NoContent();

            var model = books.Select(x =>
            {
                var translation = languageUuid.HasValue
                    ? x.BookTranslations.FirstOrDefault(t => t.LanguageUuid == languageUuid.Value)
                    : null;

                return new BookDto
                {
                    BookId = x.BookId,
                    BookUuid = x.BookUuid,
                    BookTitle = translation?.BookTitle ?? x.BookTitle,
                    BookSubtitle = translation?.BookSubtitle ?? x.BookSubtitle,
                    BookDescription = translation?.BookDescription ?? x.BookDescription,
                    BookPageCount = x.BookPageCount,
                    BookPublishDate = x.BookPublishDate,
                    BookIsbn = x.BookIsbn,
                    BookPrice = x.BookPrice,
                    IsDeleted = x.IsDeleted,
                    CreatedAt = x.CreatedAt,
                    UpdatedAt = x.UpdatedAt,
                    BookSeriesUuid = x.BookSeriesUuid,
                    AuthorUuids = x.AuthorUus.Select(a => a.AuthorUuid).ToList(),
                    CategoryUuids = x.CategoryUus.Select(c => c.CategoryUuid).ToList(),
                    PublisherUuids = x.PublisherUus.Select(p => p.PublisherUuid).ToList(),
                    TagUuids = x.TagUus.Select(t => t.TagUuid).ToList(),
                    LanguageUuids = x.BookLanguages.Select(l => l.LanguageUuid).ToList(),

                    Images = x.BookImages.Select(i => new BookImageDto
                    {
                        ImageId = i.ImageId,
                        ImageUuid = i.ImageUuid,
                        BookUuid = i.BookUuid,
                        ImageUrl = i.ImageUrl,
                        ImageAlt = i.ImageAlt,
                        IsCover = i.IsCover,
                        ImageOrder = i.ImageOrder,
                        CreatedAt = i.CreatedAt,
                        UpdatedAt = i.UpdatedAt,
                        ImageTypeUuid = i.ImageTypeUuid
                    }).ToList()
                };
            }).ToList();

            var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

            return Ok(new EncryptedPayload
            {
                EncryptedData = encryptedData.EncryptedData,
                Iv = encryptedData.Iv
            });
        }

        // GET: api/Books/5
        [HttpGet("{uuid}")]
        public async Task<ActionResult<EncryptedPayload>> GetBook(Guid uuid, [FromQuery] Guid? languageUuid)
        {
            var book = await _context.Books
                .Include(b => b.AuthorUus)
                .Include(b => b.CategoryUus)
                .Include(b => b.PublisherUus)
                .Include(b => b.TagUus)
                .Include(b => b.BookImages)
                .Include(b => b.BookLanguages)
                .Include(b => b.BookTranslations)
                .FirstOrDefaultAsync(b => b.BookUuid == uuid);

            if (book == null)
                return NotFound();

            var translation = languageUuid.HasValue
                ? book.BookTranslations.FirstOrDefault(t => t.LanguageUuid == languageUuid.Value)
                : null;

            var model = new BookDto
            {
                BookId = book.BookId,
                BookUuid = book.BookUuid,
                BookTitle = translation?.BookTitle ?? book.BookTitle,
                BookSubtitle = translation?.BookSubtitle ?? book.BookSubtitle,
                BookDescription = translation?.BookDescription ?? book.BookDescription,
                BookPageCount = book.BookPageCount,
                BookPublishDate = book.BookPublishDate,
                BookIsbn = book.BookIsbn,
                BookPrice = book.BookPrice,
                IsDeleted = book.IsDeleted,
                CreatedAt = book.CreatedAt,
                UpdatedAt = book.UpdatedAt,
                BookSeriesUuid = book.BookSeriesUuid,
                AuthorUuids = book.AuthorUus.Select(a => a.AuthorUuid).ToList(),
                CategoryUuids = book.CategoryUus.Select(c => c.CategoryUuid).ToList(),
                PublisherUuids = book.PublisherUus.Select(p => p.PublisherUuid).ToList(),
                TagUuids = book.TagUus.Select(t => t.TagUuid).ToList(),
                LanguageUuids = book.BookLanguages.Select(l => l.LanguageUuid).ToList(),

                Images = book.BookImages.Select(i => new BookImageDto
                {
                    ImageId = i.ImageId,
                    ImageUuid = i.ImageUuid,
                    BookUuid = i.BookUuid,
                    ImageUrl = i.ImageUrl,
                    ImageAlt = i.ImageAlt,
                    IsCover = i.IsCover,
                    ImageOrder = i.ImageOrder,
                    CreatedAt = i.CreatedAt,
                    UpdatedAt = i.UpdatedAt,
                    ImageTypeUuid = i.ImageTypeUuid
                }).ToList()
            };

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
        public async Task<ActionResult<EncryptedPayload>> PutBook(Guid id, EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true // Enable case-insensitive matching
                };
                var model = JsonSerializer.Deserialize<BookDto>(decryptedData, options);

                if (model == null) return NoContent();

                if (id != model.BookUuid)
                {
                    return BadRequest();
                }

                var book = await _context.Books.FindAsync(id);

                if (book == null)
                {
                    return NotFound();
                }

                book.BookId = model.BookId;
                book.BookUuid = model.BookUuid;
                book.BookTitle = model.BookTitle;
                book.BookSubtitle = model.BookSubtitle;
                book.BookDescription = model.BookDescription;
                book.BookPageCount = model.BookPageCount;
                book.BookPublishDate = model.BookPublishDate;
                book.BookIsbn = model.BookIsbn;
                book.BookPrice = model.BookPrice;
                book.IsDeleted = model.IsDeleted;
                book.CreatedAt = model.CreatedAt;
                book.UpdatedAt = model.UpdatedAt;
                book.BookSeriesUuid = model.BookSeriesUuid;

                try
                {
                    await _context.SaveChangesAsync();
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
        public async Task<ActionResult<EncryptedPayload>> PostBook(EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true // Enable case-insensitive matching
                };
                var model = JsonSerializer.Deserialize<BookDto>(decryptedData, options);


                if (model == null)
                {
                    return NoContent();
                }

                var book = new Book()
                {
                    BookTitle = model.BookTitle,
                    BookSubtitle = model.BookSubtitle,
                    BookDescription = model.BookDescription,
                    BookPageCount = model.BookPageCount,
                    BookPublishDate = model.BookPublishDate,
                    BookIsbn = model.BookIsbn,
                    BookPrice = model.BookPrice,
                    IsDeleted = model.IsDeleted,
                    CreatedAt = model.CreatedAt,
                    UpdatedAt = model.UpdatedAt,
                    BookSeriesUuid = model.BookSeriesUuid,
                };

                _context.Books.Add(book);
                await _context.SaveChangesAsync();

                model.BookId = book.BookId;

                return CreatedAtAction("GetBook", new { id = model.BookUuid }, model);
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

        private bool BookExists(Guid id)
        {
            return _context.Books.Any(e => e.BookUuid == id);
        }
    }
}

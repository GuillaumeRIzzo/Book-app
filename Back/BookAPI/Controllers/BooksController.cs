using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BookAPI.Models;
using BookAPI.Models;

namespace BookAPI.Controllers
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

        // GET: api/Books
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ModelViewBook>>> GetBooks(int? userId)
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
                }
                return model;
            }


            return NoContent();
        }

        // GET: api/Books/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ModelViewBook>> GetBook(int id)
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

            return model;
        }

        // PUT: api/Books/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBook(int id, ModelViewBook model)
        {
            if (id != model.BookId)
            {
                return BadRequest();
            }

            var book = new Book()
            {
                BookId = model.BookId,
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

            _context.Entry(book).State = EntityState.Modified;

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

        // POST: api/Books
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
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

            return CreatedAtAction("GetBook", new { id = model.BookId }, model);
        }

        // DELETE: api/Books/5
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

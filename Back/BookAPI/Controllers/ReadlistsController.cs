using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BookAPI.Models;
using BookAPI.Models;

namespace BookAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReadlistsController : ControllerBase
    {
        private readonly BookDbContext _context;

        public ReadlistsController(BookDbContext context)
        {
            _context = context;
        }

        [HttpGet]

        // GET: api/Readlists
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ModelViewReadlist>>> GetReadlists(int? userId)
        {
            var readLists = await _context.Readlists.ToListAsync();

            if (userId != null)
            {
                var readlists = _context.Readlists.Select(x => x.UserId == userId);
            }

            if (readLists != null)
            {
                var model = readLists.Select(x => new ModelViewReadlist()
                {
                    BookId = x.BookId,
                    UserId = x.UserId,
                    ReadListRead = x.ReadListRead,
                    ReadListDateAdd = x.ReadListDateAdd,
                    ReadListDateUpdate = x.ReadListDateUpdate,
                    Read = x.ReadListRead
                }).ToList();

                return model;
            }
            return NoContent();
        }

        // GET: api/Readlists/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ModelViewReadlist>> GetReadlist(int id)
        {
            var readlist = await _context.Readlists.FindAsync(id);

            if (readlist == null)
            {
                return NotFound();
            }

            var model = new ModelViewReadlist()
            {
                BookId = readlist.BookId,
                UserId = readlist.UserId,
                ReadListRead = readlist.ReadListRead,
                ReadListDateAdd= readlist.ReadListDateAdd,
                ReadListDateUpdate = readlist.ReadListDateUpdate
            };

            return model;
        }

        // PUT: api/Readlists/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutReadlist(int id, ModelViewReadlist model)
        {
            if (id != model.BookId)
            {
                return BadRequest();
            }

            var readlist = new Readlist()
            {
                BookId = model.BookId,
                UserId = model.UserId,
                ReadListRead = model.ReadListRead,
                ReadListDateAdd = model.ReadListDateAdd,
                ReadListDateUpdate = model.ReadListDateUpdate
            };

            _context.Entry(readlist).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ReadlistExists(id))
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

        // POST: api/Readlists
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ModelViewReadlist>> PostReadlist(ModelViewReadlist model)
        {
            if (model == null)
            {
                return NoContent();
            }

            var readlist = new Readlist()
            {
                UserId = model.UserId,
                ReadListRead = false,
                ReadListDateAdd = new DateTime(),
                ReadListDateUpdate = new DateTime()
            };

            _context.Readlists.Add(readlist);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (ReadlistExists(readlist.BookId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetReadlist", new { id = model.BookId }, model);
        }

        // DELETE: api/Readlists/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReadlist(int id)
        {
            var readlist = await _context.Readlists.FindAsync(id);
            if (readlist == null)
            {
                return NotFound();
            }

            _context.Readlists.Remove(readlist);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ReadlistExists(int id)
        {
            return _context.Readlists.Any(e => e.BookId == id);
        }
    }
}

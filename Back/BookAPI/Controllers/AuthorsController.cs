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
    public class AuthorsController : ControllerBase
    {
        private readonly BookDbContext _context;

        public AuthorsController(BookDbContext context)
        {
            _context = context;
        }

        // GET: api/Authors
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EncryptedPayload>>> GetAuthors()
        {
            var authors = await _context.Authors.ToListAsync();

            if (authors.Count >= 1)
            {
                var model = authors.Select(x => new ModelViewAuthor()
                {
                    AuthorId = x.AuthorId,
                    AuthorName = x.AuthorName

                }).ToList();

                // Encrypt the list of authors
                var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

                return Ok(new EncryptedPayload
                {
                    EncryptedData = encryptedData.EncryptedData,
                    Iv = encryptedData.Iv
                });
            }
            return NoContent();
        }

        // GET: api/Authors/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EncryptedPayload>> GetAuthor(int id)
        {
            var author = await _context.Authors.FindAsync(id);

            if (author == null)
            {
                return NotFound();
            }

            var model = new ModelViewAuthor()
            {
                AuthorId = author.AuthorId,
                AuthorName = author.AuthorName
            };

            // Encrypt the author data
            var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

            return Ok(new EncryptedPayload
            {
                EncryptedData = encryptedData.EncryptedData,
                Iv = encryptedData.Iv
            });
        }

        // PUT: api/Authors/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAuthor(int id, ModelViewAuthor model)
        {
            if (id != model.AuthorId)
            {
                return BadRequest();
            }

            if (AuthorNameExists(model.AuthorName, id))
            {
                return BadRequest("Name already exists");
            }

            var author = await _context.Authors.FindAsync(id);

            if (author != null)
            {
                author.AuthorId = model.AuthorId;
                author.AuthorName = model.AuthorName;
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AuthorExists(id))
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

        // POST: api/Authors
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpPost]
        public async Task<ActionResult<ModelViewAuthor>> PostAuthor(ModelViewAuthor model)
        {
            if (model == null)
            {
                return NoContent();
            }

            if (AuthorNameExists(model.AuthorName, 0))
            {
                return BadRequest("Name already exists");
            }

            var author = new Author()
            {
                AuthorName = model.AuthorName
            };

            _context.Authors.Add(author);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAuthor", new { id = model.AuthorId }, model);
        }

        // DELETE: api/Authors/5
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAuthor(int id)
        {
            var author = await _context.Authors.FindAsync(id);
            if (author == null)
            {
                return NotFound();
            }

            _context.Authors.Remove(author);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AuthorExists(int id)
        {
            return _context.Authors.Any(e => e.AuthorId == id);
        }

        private bool AuthorNameExists(string name, int id)
        {
            return _context.Authors.Any(a => a.AuthorName == name && a.AuthorId != id);
        }
    }
}

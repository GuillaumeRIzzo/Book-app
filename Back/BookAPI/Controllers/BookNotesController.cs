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
    public class BookNotesController : ControllerBase
    {
        private readonly BookDbContext _context;

        public BookNotesController(BookDbContext context)
        {
            _context = context;
        }

        // GET: api/BookNotes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EncryptedPayload>>> GetBookNotes()
        {
            var notes = await _context.BookNotes.ToListAsync();

            if (notes.Count >= 1)
            {
                var model = notes.Select(x => new BookNoteDto()
                {
                    NoteId = x.NoteId,
                    NoteUuid = x.NoteUuid,
                    NoteValue = x.NoteValue,
                    NoteComment = x.NoteComment,
                    NoteDate = x.NoteDate,
                    IsModerated = x.IsModerated,
                    IsDeleted = x.IsDeleted,
                    CreatedAt = x.CreatedAt,
                    UpdatedAt = x.UpdatedAt,
                    BookUuid = x.BookUuid,
                    UserUuid = x.UserUuid,

                }).ToList();

                // Encrypt the list of notes
                var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

                return Ok(new EncryptedPayload
                {
                    EncryptedData = encryptedData.EncryptedData,
                    Iv = encryptedData.Iv
                });
            }
            return NoContent();
        }

        // GET: api/BookNotes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EncryptedPayload>> GetBookNote(int id)
        {
            var note = await _context.BookNotes.FindAsync(id);

            if (note == null)
            {
                return NotFound();
            }

            var model = new BookNoteDto()
            {
                NoteId = note.NoteId,
                NoteUuid = note.NoteUuid,
                NoteValue = note.NoteValue,
                NoteComment = note.NoteComment,
                NoteDate = note.NoteDate,
                IsModerated = note.IsModerated,
                CreatedAt = note.CreatedAt,
                UpdatedAt = note.UpdatedAt,
                BookUuid = note.BookUuid,
                UserUuid = note.UserUuid,
            };

            // Encrypt the note data
            var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

            return Ok(new EncryptedPayload
            {
                EncryptedData = encryptedData.EncryptedData,
                Iv = encryptedData.Iv
            });
        }

        // PUT: api/BookNotes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBookNote(Guid id, EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true // Enable case-insensitive matching
                };
                var model = JsonSerializer.Deserialize<BookNoteDto>(decryptedData, options);

                if (model == null) { return NotFound(); }

                if (id != model.NoteUuid)
                {
                    return BadRequest();
                }

                var note = await _context.BookNotes.FindAsync(id);

                if (note != null)
                {
                    note.NoteId = model.NoteId;
                    note.NoteUuid = model.NoteUuid;
                    note.NoteValue = model.NoteValue;
                    note.NoteComment = model.NoteComment;
                    note.NoteDate = model.NoteDate;
                    note.IsModerated = model.IsModerated;
                    note.IsDeleted = model.IsDeleted;
                    note.CreatedAt = model.CreatedAt;
                    note.UpdatedAt = DateTimeOffset.UtcNow;
                    note.BookUuid = model.BookUuid;
                    note.UserUuid = model.UserUuid;
                }

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!BookNoteExists(id))
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

        // POST: api/BookNotes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpPost]
        public async Task<ActionResult<EncryptedPayload>> PostBookNote(EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var model = JsonSerializer.Deserialize<BookNoteDto>(decryptedData);

                if (model == null)
                {
                    return NoContent();
                }

                var note = new BookNote()
                {
                    NoteId = model.NoteId,
                    NoteUuid = model.NoteUuid,
                    NoteValue = model.NoteValue,
                    NoteComment = model.NoteComment,
                    NoteDate = DateTimeOffset.UtcNow,
                    IsModerated = model.IsModerated,
                    IsDeleted = false,
                    CreatedAt = DateTimeOffset.UtcNow,
                    UpdatedAt = DateTimeOffset.UtcNow,
                    BookUuid = model.BookUuid,
                    UserUuid = model.UserUuid,
                };

                _context.BookNotes.Add(note);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetBookNote", new { id = model.NoteUuid }, model);
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

        // DELETE: api/BookNotes/5
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBookNote(int id)
        {
            var note = await _context.BookNotes.FindAsync(id);
            if (note == null)
            {
                return NotFound();
            }

            _context.BookNotes.Remove(note);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BookNoteExists(Guid id)
        {
            return _context.BookNotes.Any(e => e.NoteUuid == id);
        }
    }
}

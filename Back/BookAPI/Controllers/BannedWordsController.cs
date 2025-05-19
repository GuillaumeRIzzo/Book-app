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
    public class BannedWordsController : ControllerBase
    {
        private readonly BookDbContext _context;

        public BannedWordsController(BookDbContext context)
        {
            _context = context;
        }

        // GET: api/BannedWords
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EncryptedPayload>>> GetBannedWords()
        {
            var bannedWords = await _context.BannedWords.ToListAsync();

            if (bannedWords.Count >= 1)
            {
                var model = bannedWords.Select(x => new BannedWordDto()
                {
                    BannedWordId = x.BannedWordId,
                    BannedWordUuid = x.BannedWordUuid,
                    Word = x.Word,
                    CreatedAt = x.CreatedAt,
                    UpdatedAt = x.UpdatedAt,
                    LanguageUuid = x.LanguageUuid,

                }).ToList();

                // Encrypt the list of bannedWords
                var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

                return Ok(new EncryptedPayload
                {
                    EncryptedData = encryptedData.EncryptedData,
                    Iv = encryptedData.Iv
                });
            }
            return NoContent();
        }

        // GET: api/BannedWords/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EncryptedPayload>> GetBannedWord(Guid id)
        {
            var bannedWord = await _context.BannedWords.FindAsync(id);

            if (bannedWord == null)
            {
                return NotFound();
            }

            var model = new BannedWordDto()
            {
                BannedWordId = bannedWord.BannedWordId,
                BannedWordUuid = bannedWord.BannedWordUuid,
                Word = bannedWord.Word,
                CreatedAt = bannedWord.CreatedAt,
                UpdatedAt = bannedWord.UpdatedAt,
                LanguageUuid = bannedWord.LanguageUuid,
            };

            // Encrypt the bannedWord data
            var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

            return Ok(new EncryptedPayload
            {
                EncryptedData = encryptedData.EncryptedData,
                Iv = encryptedData.Iv
            });
        }

        // PUT: api/BannedWords/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBannedWord(Guid id, EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true // Enable case-insensitive matching
                };
                var model = JsonSerializer.Deserialize<BannedWordDto>(decryptedData, options);

                if (model == null) { return NotFound(); }

                if (id != model.BannedWordUuid)
                {
                    return BadRequest();
                }

                var bannedWord = await _context.BannedWords.FindAsync(id);

                if (bannedWord != null)
                {
                    bannedWord.BannedWordId = model.BannedWordId;
                    bannedWord.BannedWordUuid = model.BannedWordUuid;
                    bannedWord.Word = model.Word;
                    bannedWord.CreatedAt = model.CreatedAt;
                    bannedWord.UpdatedAt = DateTimeOffset.UtcNow;
                    bannedWord.IsDeleted = model.IsDeleted;
                    bannedWord.LanguageUuid = model.LanguageUuid;
                }

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!BannedWordExists(id))
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

        // POST: api/BannedWords
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpPost]
        public async Task<ActionResult<EncryptedPayload>> PostBannedWord(EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var model = JsonSerializer.Deserialize<BannedWordDto>(decryptedData);

                if (model == null)
                {
                    return NoContent();
                }

                var bannedWord = new BannedWord()
                {
                    BannedWordId = model.BannedWordId,
                    BannedWordUuid = model.BannedWordUuid,
                    Word = model.Word,
                    CreatedAt = DateTimeOffset.UtcNow,
                    UpdatedAt = DateTimeOffset.UtcNow,
                    IsDeleted = false,
                    LanguageUuid = model.LanguageUuid,
                    
                };

                _context.BannedWords.Add(bannedWord);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetBannedWord", model);
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

        // DELETE: api/BannedWords/5
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBannedWord(int id)
        {
            var bannedWord = await _context.BannedWords.FindAsync(id);
            if (bannedWord == null)
            {
                return NotFound();
            }

            _context.BannedWords.Remove(bannedWord);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BannedWordExists(Guid id)
        {
            return _context.BannedWords.Any(e => e.BannedWordUuid == id);
        }
    }
}

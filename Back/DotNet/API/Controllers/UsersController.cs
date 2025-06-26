using API.Services;
using API.Data;
using API.Models;
using API.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly BookDbContext _context;
        private readonly Regex hasUpperCase = new Regex(@"[A-Z]");
        private readonly Regex hasLowerCase = new Regex(@"[a-z]");
        private readonly Regex hasNumber = new Regex(@"\d");
        private readonly Regex hasSpecialChar = new Regex(@"[@$!%*?&\-_]");

        public UsersController(BookDbContext context)
        {
            _context = context;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<EncryptedPayload>> GetUsers()
        {
            var users = await _context.Users
                .Include(u => u.UserEmailsUu)
                .ToListAsync();

            if (users.Count >= 1)
            {
                var model = users.Select(x => new UserDto
                {
                    UserId = x.UserId,
                    UserUuid = x.UserUuid,
                    UserFirstname = x.UserFirstname,
                    UserLastname = x.UserLastname,
                    UserLogin = x.UserLogin,
                    UserBirthDate = x.UserBirthDate,
                    IsDeleted = x.IsDeleted,
                    CreatedAt = x.CreatedAt,
                    UpdatedAt = x.UpdatedAt,
                    UserRightUuid = x.UserRightUuid,
                    GenderUuid = x.GenderUuid,
                    UserEmail = x.UserEmailsUu?
                        .FirstOrDefault(e => e.IsPrimary)?.EmailAddress // optional logic
                }).ToList();

                var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

                return Ok(new EncryptedPayload
                {
                    EncryptedData = encryptedData.EncryptedData,
                    Iv = encryptedData.Iv
                });
            }

            return NoContent();
        }


        // GET: api/Users/5
        [Authorize]
        [HttpGet("{uuid}")]
        public virtual async Task<ActionResult<EncryptedPayload>> GetUser(Guid uuid, string? identifier)
        {
            var user = new User();

            if (string.IsNullOrWhiteSpace(identifier))
            {
                user = await _context.Users.FirstOrDefaultAsync(u => u.UserUuid == uuid);
            }
            else
            {
                user = await _context.Users
                .Where(u => u.UserLogin == identifier)
                .FirstOrDefaultAsync();

                // If not found by login, try to find user by primary email
                if (user == null)
                {
                    var userEmail = await _context.UserEmails
                        .Where(e => e.EmailAddress == identifier && e.IsPrimary)
                        .FirstOrDefaultAsync();

                    if (userEmail != null)
                    {
                        user = await _context.Users.FirstOrDefaultAsync(u => u.UserUuid == userEmail.UserUuid);
                    }
                }
            }

            if (user == null)
            {
                return NotFound();
            }

            var primaryEmail = await _context.UserEmails
                .Where(e => e.UserUuid == user.UserUuid && e.IsPrimary)
                .Select(e => e.EmailAddress)
                .FirstOrDefaultAsync();

            var model = new UserDto
            {
                UserId = user.UserId,
                UserUuid = user.UserUuid,
                UserFirstname = user.UserFirstname,
                UserLastname = user.UserLastname,
                UserLogin = user.UserLogin,
                UserBirthDate = user.UserBirthDate,
                IsDeleted = user.IsDeleted,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt,
                UserRightUuid = user.UserRightUuid,
                GenderUuid = user.GenderUuid,
                UserEmail = primaryEmail ?? string.Empty
            };

            // Encrypt the user data
            var encryptedData = EncryptionHelper.EncryptData(JsonSerializer.Serialize(model));

            return Ok(new EncryptedPayload
            {
                EncryptedData = encryptedData.EncryptedData,
                Iv = encryptedData.Iv
            });
        }

        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpPut("{uuid}/infos")]
        public async Task<IActionResult> UpdateUserInfos(Guid uuid, [FromBody] EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true // Enable case-insensitive matching
                };
                var userData = JsonSerializer.Deserialize<ChangeUserInfosRequest>(decryptedData, options);

                if (userData != null)
                {
                    if (uuid != userData.UserUuid)
                    {
                        var errorResponse = new { name = "userId", message = "userId doesn't match."};
                        return BadRequest(errorResponse);
                    }

                    if (LoginExists(userData.UserLogin, uuid))
                    {
                        var errorResponse = new { name = "Login", message = "Login already exists." };
                        return BadRequest(errorResponse);
                    }

                    var user = await _context.Users.FirstOrDefaultAsync(u => u.UserUuid == uuid);
                    if (user == null)
                    {
                        return NotFound("User not found.");
                    }

                    user.UserFirstname = userData.UserFirstname;
                    user.UserLastname = userData.UserLastname;
                    user.UserLogin = userData.UserLogin;
                    user.UserBirthDate = userData.UserBirthDate;
                    user.IsDeleted = userData.IsDeleted;
                    user.UpdatedAt = DateTimeOffset.UtcNow;
                    user.UserRightUuid = userData.UserRightUuid;
                    user.GenderUuid = userData.GenderUuid;

                    try
                    {
                        await _context.SaveChangesAsync();
                    }
                    catch (DbUpdateConcurrencyException)
                    {
                        if (!UserExists(uuid))
                        {
                            return NotFound();
                        }
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

        // POST: api/Users
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<EncryptedPayload>> PostUser(EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true // Enable case-insensitive matching
                };
                var model = JsonSerializer.Deserialize<CreateUserRequest>(decryptedData, options);

                    if (model == null)
                {
                    var errorResponse = new { name = "", message = "Model cannot be null." };
                    return BadRequest(errorResponse);
                }

                var validationError = ValidateUser(model);
                if (!string.IsNullOrEmpty(validationError.name))
                {
                    return BadRequest(validationError);
                }

                // Check if login already exists
                if (LoginExists(model.UserLogin, Guid.Empty))
                {
                    var errorResponse = new { name = "Login", message = "Login already exists." };
                    return BadRequest(errorResponse);
                }

                var user = new User()
                {
                    UserFirstname = model.UserFirstname,
                    UserLastname = model.UserLastname,
                    UserBirthDate = model.UserBirthDate,
                    IsDeleted = false,
                    CreatedAt = DateTimeOffset.UtcNow,
                    UpdatedAt = DateTimeOffset.UtcNow,
                    UserRightUuid = model.UserRightUuid,
                    GenderUuid = model.GenderUuid,
                };
                _context.Users.Add(user);

                if (!ValidatePassword(model.UserPassword, out var validationMessage))
                {
                    return BadRequest(new { name = "Password", message = validationMessage });
                }

                // Now create UserPassword record
                var userPassword = new UserPassword
                {
                    UserUuid = user.UserUuid,
                    HashedPassword = HashPassword(model.UserPassword),
                    MustChange = false,
                    LastChangedAt = DateTimeOffset.UtcNow,
                };
                _context.UserPasswords.Add(userPassword);

                // Now create UserEmail record (assuming model.UserEmail is provided)
                var userEmail = new UserEmail
                {
                    UserUuid = user.UserUuid,
                    EmailAddress = model.UserEmail,
                    IsPrimary = true,
                    IsValidated = false,
                    CreatedAt = DateTimeOffset.UtcNow,
                };
                _context.UserEmails.Add(userEmail);

                await _context.SaveChangesAsync();

                return CreatedAtAction("GetUser", new { uuid = user.UserUuid }, model);
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

        // DELETE: api/Users/5
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(Guid id)
        {
            return _context.Users.Any(e => e.UserUuid == id);
        }

        private (string name, string message) ValidateUser(CreateUserRequest model)
        {
            if (model.UserLogin.Contains('@'))
            {
                return (name: "Login", message: "Invalid, User login should not contain '@' symbol.");
            }

            return (name: "", message: "");
        }
        private bool ValidatePassword(string password, out string message)
        {
            message = "";
            if (password.Length < 8 ||
                !hasUpperCase.IsMatch(password) ||
                !hasLowerCase.IsMatch(password) ||
                !hasNumber.IsMatch(password) ||
                !hasSpecialChar.IsMatch(password))
            {
                message = "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.";
                return false;
            }
            return true;
        }
        private string HashPassword(string password)
        {
            // Generate a random salt
            string salt = BCrypt.Net.BCrypt.GenerateSalt();

            // Hash the password using the salt
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(password, salt);

            return hashedPassword;
        }

        private bool LoginExists(string login, Guid userUuid)
        {
            return _context.Users.Any(u => u.UserLogin == login && u.UserUuid != userUuid);
        }
    }
}

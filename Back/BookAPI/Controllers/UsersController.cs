using BookAPI.Models;
using BookAPI.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace BookAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly BookDbContext _context;
        private readonly Regex emailRegex = new Regex(@"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$");
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
        public async Task<ActionResult<IEnumerable<EncryptedPayload>>> GetUsers()
        {
            var users = await _context.Users.ToListAsync();

            if (users.Count >= 1)
            {
                var model = users.Select(x => new ModelViewUser
                {
                    UserId = x.UserId,
                    UserFirstname = x.UserFirstname,
                    UserLastname = x.UserLastname,
                    UserPassword = x.UserPassword,
                    UserLogin = x.UserLogin,
                    UserEmail = x.UserEmail,
                    UserRight = x.UserRight
                }).ToList();

                // Encrypt the list of users
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
        [HttpGet("{id}")]
        public virtual async Task<ActionResult<EncryptedPayload>> GetUser(int id, string? identifier)
        {
            var user = new User();

            if (string.IsNullOrWhiteSpace(identifier))
            {
                user = await _context.Users.FindAsync(id);

            }
            else
            {
                user = await _context.Users.FirstAsync(u => u.UserLogin == identifier || u.UserEmail == identifier);
            }

            if (user == null)
            {
                return NotFound();
            }
            var model = new ModelViewUser()
            {
                UserId = user.UserId,
                UserFirstname = user.UserFirstname,
                UserLastname = user.UserLastname,
                UserPassword = user.UserPassword,
                UserLogin = user.UserLogin,
                UserEmail = user.UserEmail,
                UserRight = user.UserRight
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
        [HttpPut("{id}/infos")]
        public async Task<IActionResult> UpdateUserInfos(int id, [FromBody] EncryptedPayload payload)
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
                    if (id != userData.UserId)
                    {
                        var errorResponse = new { name = "userId", message = "userId doesn't match."};
                        return BadRequest(errorResponse);
                    }

                    if (EmailExists(userData.UserEmail, id))
                    {
                        var errorResponse = new { name = "Email", message = "Email already exists." };
                        return BadRequest(errorResponse);
                    }

                    if (LoginExists(userData.UserLogin, id))
                    {
                        var errorResponse = new { name = "Login", message = "Login already exists." };
                        return BadRequest(errorResponse);
                    }

                    var user = await _context.Users.FindAsync(id);
                    if (user == null)
                    {
                        return NotFound("User not found.");
                    }

                    user.UserFirstname = userData.UserFirstname;
                    user.UserLastname = userData.UserLastname;
                    user.UserEmail = userData.UserEmail;
                    user.UserLogin = userData.UserLogin;
                    user.UserRight = userData.UserRight;

                    try
                    {
                        await _context.SaveChangesAsync();
                    }
                    catch (DbUpdateConcurrencyException)
                    {
                        if (!UserExists(id))
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

        [Authorize]
        [HttpPut("{id}/password")]
        public async Task<IActionResult> ChangePassword(int id, [FromBody] EncryptedPayload payload)
        {
            try
            {
                string decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var userData = JsonSerializer.Deserialize<ChangePasswordRequest>(decryptedData);

                if (userData != null)
                {
                    if (string.IsNullOrWhiteSpace(userData.CurrentPassword) || string.IsNullOrWhiteSpace(userData.NewPassword))
                    {
                        return BadRequest(new { name = "Password", message = "Passwords cannot be empty." });
                    }

                    var user = await _context.Users.FindAsync(id);
                    if (user == null)
                    {
                        return NotFound("User not found.");
                    }

                    // Verify current password
                    if (!VerifyPassword(userData.CurrentPassword, user.UserPassword))
                    {
                        return BadRequest(new { name = "CurrentPassword", message = "Incorrect current password." });
                    }

                    // Validate new password
                    if (userData.NewPassword.Length < 8 ||
                        !hasUpperCase.IsMatch(userData.NewPassword) ||
                        !hasLowerCase.IsMatch(userData.NewPassword) ||
                        !hasNumber.IsMatch(userData.NewPassword) ||
                        !hasSpecialChar.IsMatch(userData.NewPassword))
                    {
                        return BadRequest(new
                        {
                            name = "NewPassword",
                            message = "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character."
                        });
                    }

                    // Hash and update password
                    user.UserPassword = HashPassword(userData.NewPassword);

                    try
                    {
                        await _context.SaveChangesAsync();
                    }
                    catch (DbUpdateConcurrencyException)
                    {
                        if (!UserExists(id))
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
        public async Task<ActionResult<ModelViewUser>> PostUser(ModelViewUser model)
        {
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

            // Check if email already exists
            if (EmailExists(model.UserEmail, 0))
            {
                var errorResponse = new { name = "Email", message = "Email already exists." };
                return BadRequest(errorResponse);
            }

            // Check if login already exists
            if (LoginExists(model.UserLogin, 0))
            {
                var errorResponse = new { name = "Login", message = "Login already exists." };
                return BadRequest(errorResponse);
            }

            if (!IsUserRightValid(model.UserRight))
            {
                var errorResponse = new { name = "Right", message = "Invalid userRight value." };
                return BadRequest(errorResponse);
            }

            var user = new User()
            {
                UserFirstname = model.UserFirstname,
                UserLastname = model.UserLastname,
                UserPassword = HashPassword(model.UserPassword),
                UserLogin = model.UserLogin,
                UserEmail = model.UserEmail,
                UserRight = model.UserRight
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUser", new { id = user.UserId }, new ModelViewUser(user));
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

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.UserId == id);
        }

        private bool IsUserRightValid(string userRight)
        {
            // Check if the userRight parameter is within the allowed values
            return userRight == "Super Admin" || userRight == "Admin" || userRight == "User";
        }

        private string HashPassword(string password)
        {
            // Generate a random salt
            string salt = BCrypt.Net.BCrypt.GenerateSalt();

            // Hash the password using the salt
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(password, salt);

            return hashedPassword;
        }

        private bool VerifyPassword(string password, string hashedPassword)
        {
            // Check if the provided password matches the hashed password
            return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
        }

        private (string name, string message) ValidateUser(ModelViewUser model)
        {
            if (model.UserLogin.Contains('@'))
            {
                return (name: "Login", message: "Invalid, User login should not contain '@' symbol.");
            }

            if (!emailRegex.IsMatch(model.UserEmail))
            {
                return (name: "Email", message: "Invalid email address.");
            }

            if (model.UserPassword.Length < 8 ||
                !hasUpperCase.IsMatch(model.UserPassword) ||
                !hasLowerCase.IsMatch(model.UserPassword) ||
                !hasNumber.IsMatch(model.UserPassword) ||
                !hasSpecialChar.IsMatch(model.UserPassword))
            {
                return (name: "Password", message: "Invalid, Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.");
            }

            return (name: "", message: "");
        }

        private bool EmailExists(string email, int userId)
        {
            return _context.Users.Any(u => u.UserEmail == email && u.UserId != userId);
        }

        private bool LoginExists(string login, int userId)
        {
            return _context.Users.Any(u => u.UserLogin == login && u.UserId != userId);
        }
    }
    public class EncryptedPayload
    {
        public string EncryptedData { get; set; }
        public string Iv { get; set; }
    }
}

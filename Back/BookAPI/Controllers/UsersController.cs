using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BookAPI.Models;
using Microsoft.AspNetCore.Authorization;
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
        public async Task<ActionResult<IEnumerable<ModelViewUser>>> GetUsers()
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

                return model;
            }
            return NoContent();
        }

        // GET: api/Users/5
        [Authorize]
        [HttpGet("{id}")]
        public virtual async Task<ActionResult<ModelViewUser>> GetUser(int id, string? identifier)
        {
            var user = new User();

            if (string.IsNullOrWhiteSpace(identifier))
            {
                user = await _context.Users.FindAsync(id);

            }
            else { 
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

            return model;
        }

        // PUT: api/Users/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, ModelViewUser model)
        {
            if (id != model.UserId)
            {
                return BadRequest();
            }

            var validationError = ValidateUser(model);
            if (!string.IsNullOrEmpty(validationError))
            {
                return BadRequest(validationError);
            }

            if (EmailExists(model.UserEmail, id))
            {
                return BadRequest("Email already exists.");
            }

            // Check if login already exists
            if (LoginExists(model.UserLogin, id))
            {
                return BadRequest("Login already exists.");
            }

            var user = await _context.Users.FindAsync(id);

            if (user != null)
            {
                var check = VerifyPassword(model.UserPassword, user.UserPassword);

                if (check)
                {
                    return BadRequest();
                }

                var pass = (model.UserPassword == user.UserPassword) ? user.UserPassword : HashPassword(model.UserPassword);

                user.UserFirstname = model.UserFirstname;
                user.UserLastname = model.UserLastname;
                user.UserPassword = pass;
                user.UserLogin = model.UserLogin;
                user.UserEmail = model.UserEmail;
                user.UserRight = model.UserRight;
            }

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
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Users
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ModelViewUser>> PostUser(ModelViewUser model)
        {
            if (model == null)
            {
                return BadRequest("Model cannot be null.");
            }

            var validationError = ValidateUser(model);
            if (!string.IsNullOrEmpty(validationError))
            {
                return BadRequest(validationError);
            }

            // Check if email already exists
            if (EmailExists(model.UserEmail, 0))
            {
                return BadRequest("Email already exists.");
            }

            // Check if login already exists
            if (LoginExists(model.UserLogin, 0))
            {
                return BadRequest("Login already exists.");
            }

            if (!IsUserRightValid(model.UserRight))
            {
                return BadRequest("Invalid userRight value.");
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
        [Authorize (Policy = IdentityData.UserPolicyName)]
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

        private string ValidateUser(ModelViewUser model)
        {
            if (model.UserLogin.Contains('@'))
            {
                return "Invalid, User login should not contain '@' symbol.";
            }

            if (!emailRegex.IsMatch(model.UserEmail))
            {
                return "Invalid email address.";
            }

            if (model.UserPassword.Length < 8 ||
                !hasUpperCase.IsMatch(model.UserPassword) ||
                !hasLowerCase.IsMatch(model.UserPassword) ||
                !hasNumber.IsMatch(model.UserPassword) ||
                !hasSpecialChar.IsMatch(model.UserPassword))
            {
                return "Invalid, Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.";
            }

            return null;
        }

        private bool EmailExists(string email, int userId)
        {
            return _context.Users.Any(u => u.UserEmail == email && u.UserId != userId);
        }

        private bool LoginExists(string login, int userId)
        {
            return  _context.Users.Any(u => u.UserLogin == login && u.UserId != userId);
        }
    }
}

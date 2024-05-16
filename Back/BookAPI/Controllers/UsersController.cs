using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BookAPI.Models;
using Microsoft.AspNetCore.Authorization;

namespace BookAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly BookDbContext _context;

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
        public async Task<ActionResult<ModelViewUser>> GetUser(int? id, string? identifier)
        {
            var user = new User();

            if (identifier == null)
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
            var oldHashResult = await GetUser(id, null);

            var oldHash = oldHashResult.Value;

            if (oldHash != null)
            {
                var check = VerifyPassword(model.UserPassword, oldHash.UserPassword);

                if (check)
                {
                    return BadRequest();
                }

                var pass = (model.UserPassword == oldHash.UserPassword) ? oldHash.UserPassword : HashPassword(model.UserPassword);

                var user = new User()
                {
                    UserId = model.UserId,
                    UserFirstname = model.UserFirstname,
                    UserLastname = model.UserLastname,
                    UserPassword = pass,
                    UserLogin = model.UserLogin,
                    UserEmail = model.UserEmail,
                    UserRight = model.UserRight
                };

                // Detach the existing entity with the same key from the context
                var existingUser = _context.Users.Local.FirstOrDefault(e => e.UserId == model.UserId);
                if (existingUser != null)
                {
                    _context.Entry(existingUser).State = EntityState.Detached;
                }

                // Attach the modified entity
                _context.Entry(user).State = EntityState.Modified;
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
                return NoContent();
            }

            if (!IsUserRightValid(model.UserRight))
            {
                // Handle the case where the userRight parameter is invalid
                throw new ArgumentException("Invalid userRight value");
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

            return CreatedAtAction("GetUser", new { id = model.UserId }, model);
        }

        // DELETE: api/Users/5
        [Authorize]
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
    }
}

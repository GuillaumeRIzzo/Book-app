using BookAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BookAPI.Identity;
using BookAPI.Utils;
using System.Text.Json;


namespace BookAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IdentityController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly BookDbContext _context;
        private readonly UsersController _usersController;
        private static readonly TimeSpan tokenLifetime = TimeSpan.FromDays(7);

        public IdentityController(IConfiguration configuration, BookDbContext context, UsersController usersController)
        {
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _usersController = usersController ?? throw new ArgumentNullException(nameof(usersController));
        }

        [AllowAnonymous]
        [HttpPost("GenerateToken")]
        public string GenerateToken(ModelViewUser model)
        {
            // Retrieve security key from appsettings.json
            string securityKey = _configuration["Jwt:SecurityKey"];

            var tokenHandler = new JwtSecurityTokenHandler();
            // Create symmetric security key from the string
            var symmetricSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(securityKey));

            // Create signing credentials using the security key
            var signingCredentials = new SigningCredentials(symmetricSecurityKey, SecurityAlgorithms.HmacSha256);

            // Create claims with user information (for demonstration purposes)
            var claims = new List<Claim>
            {
                new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new(JwtRegisteredClaimNames.Sub, model.UserEmail),
                new(JwtRegisteredClaimNames.Email, model.UserEmail),
                new(JwtRegisteredClaimNames.UniqueName, model.UserFirstname + model.UserLastname),
                new("UserId", model.UserId.ToString()),
                new("Login", model.UserLogin.ToString()),
                new("Right", model.UserRight.ToString()),
            };

            if (model.UserRight == "Super Admin")
            {
                claims.Add(new Claim("Right", "super admin"));
            }
            else if (model.UserRight == "Admin")
            {
                claims.Add(new Claim("Right", "admin"));
            }
            else claims.Add(new Claim("Right", "user"));

            var tokenDescription = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.Add(tokenLifetime),
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"],
                SigningCredentials = signingCredentials,
            };
            // Create JWT token

            var token = tokenHandler.CreateToken(tokenDescription);

            var jwt = tokenHandler.WriteToken(token);
            return jwt;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<EncryptedPayload>> Login([FromBody] EncryptedPayload payload)
        {
            // Step 0: Decrypt the payload data
            var encryptedPayload = payload;
            var decryptedPayloadJson = EncryptionHelper.DecryptData(encryptedPayload.EncryptedData, encryptedPayload.Iv);
            var model = JsonSerializer.Deserialize<LoginViewModel>(decryptedPayloadJson);

            if (model == null)
            {
                return NotFound();
            }

            // Step 1: Call GetUser to retrieve the encrypted user data
            var encryptedUserResult = await _usersController.GetUser(0, model.Identifier);

            if (encryptedUserResult.Result is ObjectResult objectResult && objectResult.Value is EncryptedPayload encryptedUser)
            {
                // Step 2: Decrypt the user data
                var decryptedUserJson = EncryptionHelper.DecryptData(encryptedUser.EncryptedData, encryptedUser.Iv);
                var user = JsonSerializer.Deserialize<ModelViewUser>(decryptedUserJson);

                if (user == null)
                {
                    return NotFound();
                }

                // Step 3: Validate the credentials
                if ((user.UserLogin == model.Identifier || user.UserEmail == model.Identifier) && VerifyPassword(model.Password, user.UserPassword))
                {
                    // Generate the JWT token
                    var token = GenerateToken(user);

                    // Prepare the login response
                    var response = new LoginResponseDto
                    {
                        Token = token,
                        id = user.UserId,
                        login = user.UserLogin,
                        right = user.UserRight,
                        email = user.UserEmail
                    };

                    // Step 4: Encrypt the login response
                    var encryptedResponse = EncryptionHelper.EncryptData(JsonSerializer.Serialize(response));

                    // Return the encrypted payload
                    return Ok(new EncryptedPayload
                    {
                        EncryptedData = encryptedResponse.EncryptedData,
                        Iv = encryptedResponse.Iv
                    });
                }

                return Unauthorized();
            }

            return NotFound();
        }




        // Verifies if a password matches its hashed version
        private bool VerifyPassword(string password, string hashedPassword)
        {
            // Check if the provided password matches the hashed password
            return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
        }
    }

}
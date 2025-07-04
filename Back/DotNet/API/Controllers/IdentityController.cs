﻿using API.Data;
using API.Identity;
using API.Models;
using API.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;


namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IdentityController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly BookDbContext _context;
        private readonly UsersController _usersController;
        private static readonly TimeSpan tokenLifetime = TimeSpan.FromDays(1);

        public IdentityController(IConfiguration configuration, BookDbContext context, UsersController usersController)
        {
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _usersController = usersController ?? throw new ArgumentNullException(nameof(usersController));
        }

        [AllowAnonymous]
        [HttpPost("GenerateToken")]
        public string GenerateToken(UserDto model, string userRight)
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
                new("UserUuid", model.UserUuid.ToString()),
                new("Login", model.UserLogin.ToString()),
                new("Right", userRight),
            };

            if (userRight == "Super Admin")
            {
                claims.Add(new Claim("Right", "super admin"));
            }
            else if (userRight == "Admin")
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
            var model = JsonSerializer.Deserialize<LoginDto>(decryptedPayloadJson);

            if (model == null)
            {
                return NotFound();
            }

            // Step 1: Call GetUser to retrieve the encrypted user data
            var encryptedUserResult = await _usersController.GetUser(Guid.Empty, model.Identifier);

            if (encryptedUserResult.Result is ObjectResult objectResult && objectResult.Value is EncryptedPayload encryptedUser)
            {
                // Step 2: Decrypt the user data
                var decryptedUserJson = EncryptionHelper.DecryptData(encryptedUser.EncryptedData, encryptedUser.Iv);
                var user = JsonSerializer.Deserialize<UserDto>(decryptedUserJson);

                if (user == null)
                {
                    return NotFound();
                }
                var userPassword = await _context.UserPasswords
                    .FirstOrDefaultAsync(p => p.UserUuid == user.UserUuid);

                if (userPassword == null)
                {
                    return Unauthorized("Password not set");
                }

                if (!VerifyPassword(model.Password, userPassword.HashedPassword))
                {
                    return Unauthorized("Invalid password");
                }

                // Step 3: Validate the credentials
                if ((user.UserLogin == model.Identifier || user.UserEmail == model.Identifier))
                {

                    var userRight = await _context.UserRights
                        .Where(r => r.UserRightUuid == user.UserRightUuid)
                        .Select(r => r.UserRightName)
                        .FirstOrDefaultAsync();

                    if (userRight == null)
                        return Unauthorized();

                    // Generate the JWT token
                    var token = GenerateToken(user, userRight);

                    // Prepare the login response
                    var response = new LoginResponseDto
                    {
                        Token = token,
                        Uuid = user.UserUuid,
                        Id = user.UserId,
                        Login = user.UserLogin,
                        Right = userRight,
                        Email = user.UserEmail
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
using API.Data;
using API.Models;
using API.Services;
using API.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Text.RegularExpressions;
using static API.Controllers.UsersController;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserPasswordsController : ControllerBase
    {
        private readonly BookDbContext _context;
        private readonly IEmailService _emailService;
        private readonly Regex hasUpperCase = new Regex(@"[A-Z]");
        private readonly Regex hasLowerCase = new Regex(@"[a-z]");
        private readonly Regex hasNumber = new Regex(@"\d");
        private readonly Regex hasSpecialChar = new Regex(@"[@$!%*?&\-_]");

        public UserPasswordsController(BookDbContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        [Authorize(Policy = IdentityData.UserPolicyName)]
        [HttpPut("{uuid}/change-password")]
        public async Task<IActionResult> ChangePassword(Guid uuid, [FromBody] EncryptedPayload payload)
        {
            try
            {
                var decryptedData = EncryptionHelper.DecryptData(payload.EncryptedData, payload.Iv);
                var request = JsonSerializer.Deserialize<ChangePasswordRequest>(decryptedData);

                if (request == null || string.IsNullOrWhiteSpace(request.CurrentPassword) || string.IsNullOrWhiteSpace(request.NewPassword))
                {
                    return BadRequest(new { name = "Password", message = "Passwords cannot be empty." });
                }

                var userPassword = await _context.UserPasswords.FirstOrDefaultAsync(p => p.UserUuid == uuid);
                if (userPassword == null) return NotFound("Password record not found.");

                if (!BCrypt.Net.BCrypt.Verify(request.CurrentPassword, userPassword.HashedPassword))
                {
                    return BadRequest(new { name = "CurrentPassword", message = "Incorrect current password." });
                }

                if (!ValidatePassword(request.NewPassword, out var validationMessage))
                {
                    return BadRequest(new { name = "NewPassword", message = validationMessage });
                }

                userPassword.HashedPassword = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
                userPassword.LastChangedAt = DateTimeOffset.UtcNow;

                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (JsonException ex)
            {
                return BadRequest(new { message = "Invalid JSON format.", details = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred.", details = ex.Message });
            }
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email))
                return BadRequest("Email is required.");

            var userEmail = await _context.UserEmails
                .Include(ue => ue.UserUu)
                .FirstOrDefaultAsync(ue =>
                    ue.EmailAddress == request.Email &&
                    ue.IsPrimary &&
                    ue.IsValidated);

            if (userEmail == null)
                return NotFound("Email address not found or not validated.");

            var userPassword = await _context.UserPasswords
                .FirstOrDefaultAsync(p => p.UserUuid == userEmail.UserUuid);

            if (userPassword == null)
                return NotFound("Password record not found.");

            var cooldownMinutes = 2;
            if (userPassword.LastPasswordResetRequestAt != null &&
                DateTimeOffset.UtcNow < userPassword.LastPasswordResetRequestAt.Value.AddMinutes(cooldownMinutes))
            {
                return BadRequest($"Please wait {cooldownMinutes} minutes before requesting again.");
            }

            // Generate token and update password entity
            var token = Guid.NewGuid().ToString();
            userPassword.LastPasswordResetRequestAt = DateTimeOffset.UtcNow;
            userPassword.ResetToken = token;
            userPassword.ResetExpiresAt = DateTimeOffset.UtcNow.AddHours(1);

            var link = $"localhost:3000/reset-password?token={token}";

            // Send the email
            await _emailService.SendEmailAsync(request.Email, "Reset your password", $"Click here: <a href='{link}'>Reset your password</a>");

            await _context.SaveChangesAsync();
            return Ok("Reset email sent.");
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest dto)
        {
            var userPassword = await _context.UserPasswords
                .FirstOrDefaultAsync(p => p.ResetToken == dto.Token && p.ResetExpiresAt > DateTimeOffset.UtcNow);

            if (userPassword == null) return BadRequest("Invalid or expired token");

            if (!ValidatePassword(dto.NewPassword, out var validationMessage))
            {
                return BadRequest(new { name = "NewPassword", message = validationMessage });
            }

            userPassword.HashedPassword = HashPassword(dto.NewPassword);
            userPassword.ResetToken = null;
            userPassword.ResetExpiresAt = null;
            userPassword.LastChangedAt = DateTimeOffset.UtcNow;
            userPassword.MustChange = false;

            await _context.SaveChangesAsync();
            return Ok("Password reset successfully.");
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
    }
}

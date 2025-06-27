using API.Services;
using API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserEmailsController : ControllerBase
    {
        private readonly BookDbContext _context;
        private readonly IEmailService _emailService;
        private readonly Regex emailRegex = new Regex(@"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$");

        public UserEmailsController(BookDbContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        [HttpPost("confirm")]
        public async Task<IActionResult> ConfirmEmail([FromQuery] string token)
        {
            var userEmail = await _context.UserEmails
                .Include(e => e.UserUu)
                .FirstOrDefaultAsync(e => e.ValidationToken == token);

            if (userEmail == null || userEmail.UserUu == null)
                return NotFound("Invalid token or user not found.");

            userEmail.IsValidated = true;
            userEmail.ValidationToken = null;
            userEmail.UpdatedAt = DateTimeOffset.UtcNow;

            await _context.SaveChangesAsync();
            return Ok("Email validated");
        }

        [HttpPut("request-update")]
        public async Task<IActionResult> RequestEmailUpdate([FromQuery] Guid userUuid, [FromBody] string newEmail)
        {
            var userEmail = await _context.UserEmails.FirstOrDefaultAsync(e => e.UserUuid == userUuid);
            if (userEmail == null) return NotFound("User record not found.");

            if (!emailRegex.IsMatch(newEmail))
            {
                return BadRequest((name: "Email", message: "Invalid email address."));
            }   

            // Check if email is already used
            if (await _context.UserEmails.AnyAsync(e => e.EmailAddress == newEmail && e.UserUuid != userUuid))
                return BadRequest("Email already in use.");

            var token = Guid.NewGuid().ToString();
            userEmail.NewEmailAddress = newEmail;
            userEmail.ValidationToken = token;
            userEmail.IsValidated = false;
            userEmail.UpdatedAt = DateTimeOffset.UtcNow;

            var confirmationLink = $"https://yourfrontend.com/confirm-email?token={token}";
            await _emailService.SendEmailAsync(newEmail, "Confirm your new email", $"Click to confirm: {confirmationLink}");

            await _context.SaveChangesAsync();
            return Ok("Confirmation email sent.");
        }

        [HttpPost("validate-update")]
        public async Task<IActionResult> ValidateEmailUpdate([FromQuery] string token)
        {
            var userEmail = await _context.UserEmails
                .Include(e => e.UserUu)
                .FirstOrDefaultAsync(e => e.ValidationToken == token);

            if (userEmail == null || userEmail.NewEmailAddress == null)
                return NotFound("Invalid or expired token.");

            // Apply email change
            userEmail.EmailAddress = userEmail.EmailAddress;
            userEmail.NewEmailAddress = null;
            userEmail.ValidationToken = null;
            userEmail.IsValidated = true;
            userEmail.UpdatedAt = DateTimeOffset.UtcNow;

            await _context.SaveChangesAsync();
            return Ok("Email updated successfully.");
        }

        [HttpPost("{emailUuid}/resend-validation")]
        public async Task<IActionResult> ResendValidationEmail(Guid emailUuid)
        {
            var email = await _context.UserEmails.FirstOrDefaultAsync(e => e.EmailUuid == emailUuid);
            if (email == null)
                return NotFound("Email not found.");

            if (email.IsValidated)
                return BadRequest("Email is already validated.");

            var cooldownMinutes = 2;
            if (email.LastValidationEmailSentAt.HasValue &&
                DateTimeOffset.UtcNow < email.LastValidationEmailSentAt.Value.AddMinutes(cooldownMinutes))
            {
                return BadRequest($"Please wait {cooldownMinutes} minutes before requesting again.");
            }

            // Generate new token and send email
            email.ValidationToken = Guid.NewGuid().ToString();
            email.LastValidationEmailSentAt = DateTimeOffset.UtcNow;

            var validationLink = $"https://yourfrontend.com/validate-email?token={email.ValidationToken}";
            await _emailService.SendEmailAsync(email.EmailAddress, "Validate your email", $"Click here: {validationLink}");

            await _context.SaveChangesAsync();
            return Ok("Validation email resent.");
        }
    }
}

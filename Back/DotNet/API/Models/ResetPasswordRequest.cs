namespace API.Models
{
    public class ResetPasswordRequest
    {
        public string Token { get; set; } = string.Empty;          // Reset token sent by email
        public string NewPassword { get; set; } = string.Empty;    // New password user wants to set
    }
}

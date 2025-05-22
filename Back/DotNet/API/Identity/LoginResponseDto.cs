namespace BookAPI.Identity
{
    public class LoginResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public Guid Useruuid { get; set; }
        public string Login { get; set; } = string.Empty;
        public string UserRight { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }
}

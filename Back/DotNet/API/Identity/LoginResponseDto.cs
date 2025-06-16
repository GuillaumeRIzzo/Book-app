namespace BookAPI.Identity
{
    public class LoginResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public int Id { get; set; }
        public Guid Uuid { get; set; }
        public string Login { get; set; } = string.Empty;
        public string Right { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }
}

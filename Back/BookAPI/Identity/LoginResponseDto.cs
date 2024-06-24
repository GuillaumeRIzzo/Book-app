namespace BookAPI.Identity
{
    public class LoginResponseDto
    {
        public string Token { get; set; }
        public int id { get; set; }
        public string login { get; set; }
        public string right { get; set; }
        public string email { get; set; }
    }
}

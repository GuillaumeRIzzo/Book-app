namespace BookAPI.Models
{
    public class ChangeUserInfosRequest
    {
        public int UserId { get; set; }

        public string? UserFirstname { get; set; }

        public string? UserLastname { get; set; }

        public string? UserLogin { get; set; }

        public string? UserEmail { get; set; }

        public string? UserRight { get; set; }
    }
}

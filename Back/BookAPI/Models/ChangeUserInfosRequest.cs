namespace BookAPI.Models
{
    public class ChangeUserInfosRequest
    {
        public int UserId { get; set; }
        public Guid UserUuid { get; set; }
        public string? UserFirstname { get; set; }
        public string? UserLastname { get; set; }
        public string? UserLogin { get; set; }
        public string? UserEmail { get; set; }
        public Guid? UserRightUuid { get; set; }
    }
}

namespace API.Models
{
    public class ChangeUserInfosRequest
    {
        public int UserId { get; set; }
        public Guid UserUuid { get; set; }
        public string? UserFirstname { get; set; }
        public string? UserLastname { get; set; }
        public string? UserLogin { get; set; }
        public DateOnly? UserBirthDate { get; set; }
        public bool IsDeleted { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }
        public Guid UserRightUuid { get; set; }
        public Guid GenderUuid { get; set; }
    }
}

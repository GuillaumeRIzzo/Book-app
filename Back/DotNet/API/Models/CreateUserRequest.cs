namespace API.Models
{
    public class CreateUserRequest
    {
        public string UserFirstname { get; set; } = null!;
        public string UserLastname { get; set; } = null!;
        public string UserLogin { get; set; } = null!;
        public string UserEmail { get; set; } = null!;
        public string UserPassword { get; set; } = null!;
        public DateOnly? UserBirthDate { get; set; }
        public Guid UserRightUuid { get; set; }
        public Guid? GenderUuid { get; set; }
    }
}

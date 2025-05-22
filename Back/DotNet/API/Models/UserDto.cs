namespace BookAPI.Models
{
    public class UserDto
    {
        public int UserId { get; set; }
        public Guid UserUuid { get; set; }
        public string UserFirstname { get; set; } = null!;
        public string UserLastname { get; set; } = null!;
        public string UserPassword { get; set; } = null!;
        public DateTimeOffset UserPasswordLastChangedAt { get; set; }
        public bool UserMustChangePassword { get; set; }
        public string UserLogin { get; set; } = null!;
        public string UserEmail { get; set; } = null!;
        public DateOnly? UserBirthDate { get; set; }
        public bool IsDeleted { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }
        public Guid UserRightUuid { get; set; }
        public Guid? GenderUuid { get; set; }
    }
}

namespace BookAPI.Models
{
    public class UserRightDto
    {
        public int UserRightId { get; set; }
        public Guid UserRightUuid { get; set; }
        public string UserRightName { get; set; } = string.Empty;
    }
}

namespace BookAPI.Models
{
    public class UserBookActivityDto
    {
        public int ActivityId { get; set; }
        public Guid ActivityUuid { get; set; }
        public Guid UserUuid { get; set; }
        public Guid BookUuid { get; set; }
        public Guid ActivityTypeUuid { get; set; }
        public DateTimeOffset ActivityDate { get; set; }
    }
}

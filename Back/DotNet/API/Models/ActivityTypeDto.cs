namespace API.Models
{
    public class ActivityTypeDto
    {
        public int ActivityTypeId { get; set; }
        public Guid ActivityTypeUuid { get; set; }
        public string Code { get; set; } = string.Empty;
        public string Label { get; set; } = string.Empty;
    }
}

namespace API.Models
{
    public class NotificationDto
    {
        public int NotificationId { get; set; }
        public Guid NotificationUuid { get; set; }
        public Guid UserUuid { get; set; }
        public string? NotificationTitle { get; set; }
        public string NotificationMessage { get; set; } = string.Empty;
        public bool IsRead { get; set; } = false;
        public DateTimeOffset NotificationDate { get; set; }
    }
}

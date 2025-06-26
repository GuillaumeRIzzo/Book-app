namespace API.Models
{
    public class UserConnectionDto
    {
        public int ConnectionId { get; set; }
        public Guid ConnectionUuid { get; set; }
        public Guid UserUuid { get; set; }
        public DateTimeOffset ConnectionDate { get; set; }
        public string? ConnectionIp { get; set; }
        public string? ConnectionDevice { get; set; }
    }
}

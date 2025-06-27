namespace API.Models
{
    public class AuditTrailDto
    {
        public int AuditId { get; set; }
        public Guid AuditUuid { get; set; }
        public string EntityTablename { get; set; } = string.Empty;
        public string ActionType { get; set; } = string.Empty;
        public DateTimeOffset ActionDate { get; set; }
        public string? PreviousData { get; set; }
        public string? NewData { get; set; }
        public string? Source { get; set; }
        public Guid EntityUuid { get; set; }
        public Guid ActionUserUuid { get; set; }
    }
}

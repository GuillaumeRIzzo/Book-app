namespace API.Models
{
    public class ModerationLogDto
    {
        public int ModerationId { get; set; }
        public Guid ModerationUuid { get; set; }
        public string TargetType { get; set; } = string.Empty;
        public Guid TargetUuid { get; set; }
        public string TriggerReason { get; set; } = string.Empty;
        public string ModerationType { get; set; } = string.Empty;
        public string ModerationLevel { get; set; } = string.Empty;
        public string Action { get; set; } = string.Empty;
        public string ModerationStatus { get; set; } = string.Empty;
        public string? ModerationComment { get; set; }
        public string DetectedBy { get; set; } = string.Empty;
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }
        public bool? Resolved { get; set; }
    }
}

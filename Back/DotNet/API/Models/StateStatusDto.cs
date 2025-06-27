namespace API.Models
{
    public class StateStatusDto
    {
        public int StateStatusId { get; set; }
        public Guid StateStatusUuid { get; set; }
        public string Code { get; set; } = string.Empty;
        public string Label { get; set; } = string.Empty;
    }
}

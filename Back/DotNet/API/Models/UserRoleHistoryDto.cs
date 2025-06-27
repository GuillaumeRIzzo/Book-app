namespace API.Models
{
    public class UserRoleHistoryDto
    {
        public int HistoryId { get; set; }
        public Guid HistoryUuid { get; set; }
        public Guid TargetUserUuid { get; set; }
        public Guid ModifiedByUuid { get; set; }
        public Guid PreviousRightUuid { get; set; }
        public Guid NewRightUuid { get; set; }
        public DateTimeOffset ChangeDate { get; set; }
    }
}

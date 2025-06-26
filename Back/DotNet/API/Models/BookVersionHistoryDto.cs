namespace API.Models
{
    public class BookVersionHistoryDto
    {
        public int VersionId { get; set; }
        public Guid VersionUuid { get; set; }
        public Guid BookUuid { get; set; }
        public Guid? UserUuid { get; set; }
        public DateTimeOffset ChangeDate { get; set; }
        public string? VersionDescription { get; set; }
    }
}

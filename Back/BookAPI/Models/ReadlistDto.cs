namespace BookAPI.Models
{
    public class ReadListDto
    {
        public int ReadListId { get; set; }
        public Guid ReadListUuid { get; set; }
        public Guid UserUuid { get; set; }
        public string ReadListName { get; set; } = string.Empty;
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }
    }
}

namespace API.Models
{
    public class ReadListBookDto
    {
        public Guid ReadListUuid { get; set; }
        public Guid BookUuid { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }
    }
}

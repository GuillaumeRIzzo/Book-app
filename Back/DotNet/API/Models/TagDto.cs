namespace BookAPI.Models
{
    public class TagDto
    {
        public int TagId { get; set; }
        public Guid TagUuid { get; set; }
        public string TagLabel { get; set; } = string.Empty;
    }
}

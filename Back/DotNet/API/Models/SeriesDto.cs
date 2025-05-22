namespace BookAPI.Models
{
    public class SeriesDto
    {
        public int SeriesId { get; set; }
        public Guid SeriesUuid { get; set; }
        public string SeriesName { get; set; } = string.Empty;
    }
}

namespace BookAPI.Models
{
    public class BookSeriesOrderDto
    {
        public Guid SeriesUuid { get; set; }
        public Guid BookUuid { get; set; }
        public int SeriesOrder { get; set; }
    }
}

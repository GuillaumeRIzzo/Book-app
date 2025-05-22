namespace BookAPI.Models
{
    public class BookDto
    {
        public int BookId { get; set; }

        public Guid BookUuid { get; set; }

        public string BookTitle { get; set; } = string.Empty;

        public string BookDescription { get; set; } = string.Empty!;

        public int BookPageCount { get; set; } = 10;

        public DateOnly BookPublishDate { get; set; }

        public string? BookIsbn { get; set; }

        public decimal BookPrice { get; set; }

        public bool IsDeleted { get; set; }

        public DateTimeOffset CreatedAt { get; set; }

        public DateTimeOffset UpdatedAt { get; set; }

        public Guid? BookSeriesUuid { get; set; }

    }
}

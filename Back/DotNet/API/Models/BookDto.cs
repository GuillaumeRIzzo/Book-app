namespace API.Models
{
    public class BookDto
    {
        public int BookId { get; set; }
        public Guid BookUuid { get; set; }
        public string BookTitle { get; set; } = string.Empty;
        public string? BookSubtitle { get; set; }
        public string BookDescription { get; set; } = string.Empty!;
        public int BookPageCount { get; set; } = 10;
        public DateOnly BookPublishDate { get; set; }
        public string? BookIsbn { get; set; }
        public decimal BookPrice { get; set; }
        public bool IsDeleted { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }
        public Guid? BookSeriesUuid { get; set; }

        public List<Guid> AuthorUuids { get; set; } = new();
        public List<Guid> CategoryUuids { get; set; } = new();
        public List<Guid> PublisherUuids { get; set; } = new();
        public List<Guid> TagUuids { get; set; } = new();

        public List<BookImageDto>? Images { get; set; } = new();
        public List<Guid>? LanguageUuids { get; set; } = new();
    }
}

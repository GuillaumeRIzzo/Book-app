namespace BookAPI.Models;

public partial class Book
{
    public int BookId { get; set; }

    public Guid BookUuid { get; set; } = Guid.NewGuid();

    public string BookTitle { get; set; } = null!;

    public string? BookSubtitle { get; set; }

    public string BookDescription { get; set; } = null!;

    public DateTime BookPublishDate { get; set; }

    public int BookPageCount { get; set; }

    public string? BookIsbn { get; set; }

    public float BookPrice { get; set; } = 0;

    public bool IsDeleted { get; set; } = false;

    public DateTimeOffset CreatedAt { get; set; }

    public DateTimeOffset UpdateAt { get; set; }

    public ICollection<Series> Series { get; set; } = new List<Series>(); 

    public virtual ICollection<BookCategory> BookCategories { get; set; } = new List<BookCategory>();
}

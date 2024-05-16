namespace BookAPI.Models;

public partial class Book
{
    public int BookId { get; set; }

    public string BookTitle { get; set; } = null!;

    public string BookDescription { get; set; } = null!;

    public DateTime BookPublishDate { get; set; }

    public int BookPageCount { get; set; }

    public int BookAverageRating { get; set; }

    public int BookRatingCount { get; set; }

    public string BookImageLink { get; set; } = null!;

    public string BookLanguage { get; set; } = null!;

    public int PublisherId { get; set; }

    public int AuthorId { get; set; }

    public virtual Author Author { get; set; } = null!;

    public virtual ICollection<BookAction> BookActions { get; set; } = new List<BookAction>();

    public virtual Publisher Publisher { get; set; } = null!;

    public virtual ICollection<Readlist> Readlists { get; set; } = new List<Readlist>();

    public virtual ICollection<CategoryList> CategorieLists { get; set; } = new List<CategoryList>();
}

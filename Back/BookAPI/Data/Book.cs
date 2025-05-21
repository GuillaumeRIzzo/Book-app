using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookAPI.Data;

[Table("BOOK")]
[Index("BookUuid", Name = "UQ__BOOK__AA8FB793DB69C7CB", IsUnique = true)]
public partial class Book
{
    [Key]
    [Column("book_id")]
    public int BookId { get; set; }

    [Column("book_uuid")]
    public Guid BookUuid { get; set; } = Guid.NewGuid();

    [Column("book_title")]
    [StringLength(200)]
    [Unicode(false)]
    public string BookTitle { get; set; } = null!;

    [Column("book_subtitle")]
    [StringLength(200)]
    [Unicode(false)]
    public string? BookSubtitle { get; set; }

    [Column("book_description", TypeName = "text")]
    public string BookDescription { get; set; } = string.Empty;

    [Column("book_pageCount")]
    public int BookPageCount { get; set; }

    [Column("book_publishDate")]
    public DateOnly BookPublishDate { get; set; }

    [Column("book_isbn")]
    [StringLength(20)]
    [Unicode(false)]
    public string? BookIsbn { get; set; }

    [Column("book_price", TypeName = "decimal(10, 2)")]
    public decimal BookPrice { get; set; }

    [Column("book_series_uuid")]
    public Guid? BookSeriesUuid { get; set; }

    [Column("is_deleted")]
    public bool IsDeleted { get; set; } = false;

    [Column("created_at")]
    public DateTimeOffset CreatedAt { get; set; }

    [Column("updated_at")]
    public DateTimeOffset UpdatedAt { get; set; }

    [InverseProperty("BookUu")]
    public virtual ICollection<BookImage> BookImages { get; set; } = new List<BookImage>();

    [InverseProperty("BookUu")]
    public virtual ICollection<BookLanguage> BookLanguages { get; set; } = new List<BookLanguage>();

    [InverseProperty("BookUu")]
    public virtual ICollection<BookNote> BookNotes { get; set; } = new List<BookNote>();

    [InverseProperty("BookUu")]
    public virtual ICollection<BookSeriesOrder> BookSeriesOrders { get; set; } = new List<BookSeriesOrder>();

    [ForeignKey("BookSeriesUuid")]
    [InverseProperty("Books")]
    public virtual Series? BookSeriesUu { get; set; }

    [InverseProperty("BookUu")]
    public virtual ICollection<BookTranslation> BookTranslations { get; set; } = new List<BookTranslation>();

    [InverseProperty("BookUu")]
    public virtual ICollection<BookVersionHistory> BookVersionHistories { get; set; } = new List<BookVersionHistory>();

    [InverseProperty("BookUu")]
    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    [InverseProperty("BookUu")]
    public virtual ICollection<ReadListBook> ReadListBooks { get; set; } = new List<ReadListBook>();

    [InverseProperty("BookUu")]
    public virtual ICollection<ShoppingBasketItem> ShoppingBasketItems { get; set; } = new List<ShoppingBasketItem>();

    [InverseProperty("BookUu")]
    public virtual ICollection<UserBookActivity> UserBookActivities { get; set; } = new List<UserBookActivity>();

    [InverseProperty("BookUu")]
    public virtual ICollection<UserBookState> UserBookStates { get; set; } = new List<UserBookState>();

    [InverseProperty("BookUu")]
    public virtual ICollection<WishlistBook> WishlistBooks { get; set; } = new List<WishlistBook>();

    [ForeignKey("BookUuid")]
    [InverseProperty("BookUus")]
    public virtual ICollection<Author> AuthorUus { get; set; } = new List<Author>();

    [ForeignKey("BookUuid")]
    [InverseProperty("BookUus")]
    public virtual ICollection<Category> CategoryUus { get; set; } = new List<Category>();

    [ForeignKey("BookUuid")]
    [InverseProperty("BookUus")]
    public virtual ICollection<Publisher> PublisherUus { get; set; } = new List<Publisher>();

    [ForeignKey("BookUuid")]
    [InverseProperty("BookUus")]
    public virtual ICollection<Tag> TagUus { get; set; } = new List<Tag>();
}

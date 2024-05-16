namespace BookAPI.Models;
public partial class CategoryList
{
    public int BookCategoId { get; set; }
    public int BookId { get; set; }
    public BookCategory BookCategory { get; set; }
    public Book Book { get; set; }
}


namespace BookAPI.Models;

public partial class BookCategory
{
    public int BookCategoId { get; set; }

    public string BookCategoName { get; set; } = null!;

    public string BookCategoDescription { get; set; } = null!;

    public virtual ICollection<CategoryList> CategorieLists { get; set; } = new List<CategoryList>();
}

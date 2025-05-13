namespace BookAPI.Models;
public partial class BookCategory
{
    public Guid BookUuid { get; set; }

    public int CategoryUuid { get; set; }

    public Book Book { get; set; }

    public Categories Categories { get; set; }
}


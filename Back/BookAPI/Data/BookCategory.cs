using System;
using System.Collections.Generic;

namespace BookAPI.Models;

public partial class BookCategory
{
    public int BookCategoId { get; set; }

    public string BookCategoName { get; set; } = null!;

    public string BookCategoDescription { get; set; } = null!;

    public virtual ICollection<Book> Books { get; set; } = new List<Book>();
}

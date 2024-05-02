using System;
using System.Collections.Generic;

namespace BookAPI.Models;

public partial class BookAction
{
    public int BookId { get; set; }

    public int UserId { get; set; }

    public DateTime BookActionsDateAdd { get; set; }

    public DateTime BookActionsDateUpdate { get; set; }

    public virtual Book Book { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}

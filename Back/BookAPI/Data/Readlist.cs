using System;
using System.Collections.Generic;

namespace BookAPI.Models;

public partial class Readlist
{
    public int BookId { get; set; }

    public int UserId { get; set; }

    public bool ReadListRead { get; set; }

    public DateTime ReadListDateAdd { get; set; }

    public DateTime ReadListDateUpdate { get; set; }

    public virtual Book Book { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}

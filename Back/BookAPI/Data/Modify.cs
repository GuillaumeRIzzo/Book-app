using System;
using System.Collections.Generic;
using BookAPI.Data;

namespace BookAPI.Models;

public partial class Modify
{
    public int UserId { get; set; }

    public int UserIdUsers { get; set; }

    public DateTime ModifyDate { get; set; }

    public virtual User User { get; set; } = null!;

    public virtual User UserIdUsersNavigation { get; set; } = null!;
}

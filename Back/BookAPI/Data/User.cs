using System;
using System.Collections.Generic;

namespace BookAPI.Models;

public partial class User
{
    public int UserId { get; set; }

    public string UserFirstname { get; set; } = null!;

    public string UserLastname { get; set; } = null!;

    public string UserPassword { get; set; } = null!;

    public string UserLogin { get; set; } = null!;

    public string UserEmail { get; set; } = null!;

    public string UserRight { get; set; } = null!;

    public virtual ICollection<BookAction> BookActions { get; set; } = new List<BookAction>();

    public virtual ICollection<Modify> ModifyUserIdUsersNavigations { get; set; } = new List<Modify>();

    public virtual ICollection<Modify> ModifyUsers { get; set; } = new List<Modify>();

    public virtual ICollection<Readlist> Readlists { get; set; } = new List<Readlist>();
}

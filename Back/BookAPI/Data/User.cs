using System;
using System.Collections;
using System.Collections.Generic;

namespace BookAPI.Models;

public partial class User
{
    public int UserId { get; set; }
    public Guid UserUuid { get; set; } = Guid.NewGuid(); 

    public string UserFirstname { get; set; } = null!;

    public string UserLastname { get; set; } = null!;

    public string UserPassword { get; set; } = null!;

    public DateTimeOffset UserPasswordLastChangedAt { get; set; } = new DateTimeOffset();

    public bool UserMustChangePassword { get; set; } = false;

    public string UserLogin { get; set; } = null!;

    public string UserEmail { get; set; } = null!;

    public DateTime UserBirthDate { get; set; } = new DateTime();

    public bool IsDeleted { get; set; } = false;

    public DateTimeOffset CreatedAt { get; set; }

    public DateTimeOffset UpdateAt { get; set; }

    public ICollection<UserRights> UserRight { get; set; } = new List<UserRights>();

    public ICollection<Genders> Genders { get; set; } = new List<Genders>();

}

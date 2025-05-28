using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookAPI.Data;

[Table("USERS")]
[Index("UserUuid", Name = "UQ__USERS__37BE7BB64212B006", IsUnique = true)]
[Index("UserLogin", Name = "UQ__USERS__9EA1B5AF7A9CE0EF", IsUnique = true)]
[Index("UserEmail", Name = "UQ__USERS__B0FBA212A534DC8E", IsUnique = true)]
public partial class User
{
    [Key]
    [Column("user_id")]
    public int UserId { get; set; }

    [Column("user_uuid")]
    public Guid UserUuid { get; set; } = Guid.NewGuid();

    [Column("user_firstname")]
    [StringLength(50)]
    [Unicode(false)]
    public string UserFirstname { get; set; } = string.Empty;

    [Column("user_lastname")]
    [StringLength(50)]
    [Unicode(false)]
    public string UserLastname { get; set; } = string.Empty;

    [Column("user_password")]
    [StringLength(100)]
    [Unicode(false)]
    public string UserPassword { get; set; } = string.Empty;

    [Column("user_password_last_changed_at")]
    public DateTimeOffset UserPasswordLastChangedAt { get; set; }

    [Column("user_must_change_password")]
    public bool UserMustChangePassword { get; set; } = false;

    [Column("user_login")]
    [StringLength(30)]
    [Unicode(false)]
    public string UserLogin { get; set; } = string.Empty;

    [Column("user_email")]
    [StringLength(50)]
    [Unicode(false)]
    public string UserEmail { get; set; } = string.Empty;

    [Column("user_birthDate")]
    public DateOnly? UserBirthDate { get; set; }

    [Column("is_deleted")]
    public bool IsDeleted { get; set; }

    [Column("user_right_uuid")]
    public Guid UserRightUuid { get; set; }

    [Column("gender_uuid")]
    public Guid? GenderUuid { get; set; }

    [Column("created_at")]
    public DateTimeOffset CreatedAt { get; set; }

    [Column("updated_at")]
    public DateTimeOffset UpdatedAt { get; set; }

    [InverseProperty("ActionUserUu")]
    public virtual ICollection<AuditTrail> AuditTrails { get; set; } = new List<AuditTrail>();

    [InverseProperty("UserUu")]
    public virtual ICollection<BookNote> BookNotes { get; set; } = new List<BookNote>();

    [InverseProperty("UserUu")]
    public virtual ICollection<BookVersionHistory> BookVersionHistories { get; set; } = new List<BookVersionHistory>();

    [ForeignKey("GenderUuid")]
    [InverseProperty("Users")]
    public virtual Gender? GenderUu { get; set; }

    [InverseProperty("UserUu")]
    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();

    [InverseProperty("UserUu")]
    public virtual ICollection<OrderHistory> OrderHistories { get; set; } = new List<OrderHistory>();

    [InverseProperty("UserUu")]
    public virtual Preference? Preference { get; set; }

    [InverseProperty("UserUu")]
    public virtual ICollection<ReadList> ReadLists { get; set; } = new List<ReadList>();

    [InverseProperty("UserUu")]
    public virtual ICollection<ShoppingBasket> ShoppingBaskets { get; set; } = new List<ShoppingBasket>();

    [InverseProperty("UserUu")]
    public virtual ICollection<UserBookActivity> UserBookActivities { get; set; } = new List<UserBookActivity>();

    [InverseProperty("UserUu")]
    public virtual ICollection<UserBookState> UserBookStates { get; set; } = new List<UserBookState>();

    [InverseProperty("UserUu")]
    public virtual ICollection<UserConnection> UserConnections { get; set; } = new List<UserConnection>();

    [ForeignKey("UserRightUuid")]
    [InverseProperty("Users")]
    public virtual UserRight UserRightUu { get; set; } = null!;

    [InverseProperty("ModifiedByUu")]
    public virtual ICollection<UserRoleHistory> UserRoleHistoryModifiedByUus { get; set; } = new List<UserRoleHistory>();

    [InverseProperty("TargetUserUu")]
    public virtual ICollection<UserRoleHistory> UserRoleHistoryTargetUserUus { get; set; } = new List<UserRoleHistory>();

    [InverseProperty("UserUu")]
    public virtual ICollection<WishlistBook> WishlistBooks { get; set; } = new List<WishlistBook>();
}

using Microsoft.EntityFrameworkCore;

namespace BookAPI.Data;

public partial class BookDbContext : DbContext
{
    public BookDbContext()
    {
    }

    public BookDbContext(DbContextOptions<BookDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<ActivityType> ActivityTypes { get; set; }

    public virtual DbSet<AuditTrail> AuditTrails { get; set; }

    public virtual DbSet<Author> Authors { get; set; }

    public virtual DbSet<AuthorDistinction> AuthorDistinctions { get; set; }

    public virtual DbSet<AuthorLanguage> AuthorLanguages { get; set; }

    public virtual DbSet<BannedWord> BannedWords { get; set; }

    public virtual DbSet<Book> Books { get; set; }

    public virtual DbSet<BookImage> BookImages { get; set; }

    public virtual DbSet<BookImageType> BookImageTypes { get; set; }

    public virtual DbSet<BookLanguage> BookLanguages { get; set; }

    public virtual DbSet<BookNote> BookNotes { get; set; }

    public virtual DbSet<BookSeriesOrder> BookSeriesOrders { get; set; }

    public virtual DbSet<BookTranslation> BookTranslations { get; set; }

    public virtual DbSet<BookVersionHistory> BookVersionHistories { get; set; }

    public virtual DbSet<Category> Categories { get; set; }

    public virtual DbSet<Color> Colors { get; set; }

    public virtual DbSet<Gender> Genders { get; set; }

    public virtual DbSet<Language> Languages { get; set; }

    public virtual DbSet<ModerationLog> ModerationLogs { get; set; }

    public virtual DbSet<Notification> Notifications { get; set; }

    public virtual DbSet<OrderHistory> OrderHistories { get; set; }

    public virtual DbSet<OrderItem> OrderItems { get; set; }

    public virtual DbSet<Preference> Preferences { get; set; }

    public virtual DbSet<Publisher> Publishers { get; set; }

    public virtual DbSet<ReadList> ReadLists { get; set; }

    public virtual DbSet<ReadListBook> ReadListBooks { get; set; }

    public virtual DbSet<Series> Series { get; set; }

    public virtual DbSet<ShoppingBasket> ShoppingBaskets { get; set; }

    public virtual DbSet<ShoppingBasketItem> ShoppingBasketItems { get; set; }

    public virtual DbSet<StateStatus> StateStatuses { get; set; }

    public virtual DbSet<Tag> Tags { get; set; }

    public virtual DbSet<Theme> Themes { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserBookActivity> UserBookActivities { get; set; }

    public virtual DbSet<UserBookState> UserBookStates { get; set; }

    public virtual DbSet<UserConnection> UserConnections { get; set; }

    public virtual DbSet<UserRight> UserRights { get; set; }

    public virtual DbSet<UserRoleHistory> UserRoleHistories { get; set; }

    public virtual DbSet<WishlistBook> WishlistBooks { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Server=localhost\\SQLEXPRESS;Database=BookDB;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ActivityType>(entity =>
        {
            entity.HasKey(e => e.ActivityTypeId).HasName("PK__ACTIVITY__D2470C875E4F9BAA");
        });

        modelBuilder.Entity<AuditTrail>(entity =>
        {
            entity.HasKey(e => e.AuditId).HasName("PK__AUDIT_TR__5AF33E33A3D198F1");

            entity.HasOne(d => d.ActionUserUu).WithMany(p => p.AuditTrails)
                .HasPrincipalKey(p => p.UserUuid)
                .HasForeignKey(d => d.ActionUserUuid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_AUDIT_TRAIL_USER");
        });

        modelBuilder.Entity<Author>(entity =>
        {
            entity.HasKey(e => e.AuthorId).HasName("PK__AUTHOR__86516BCFC7E45584");
        });

        modelBuilder.Entity<AuthorDistinction>(entity =>
        {
            entity.HasKey(e => e.DistinctionId).HasName("PK__AUTHOR_D__EDA8929578094490");

            entity.HasOne(d => d.AuthorUu).WithMany(p => p.AuthorDistinctions)
                .HasPrincipalKey(p => p.AuthorUuid)
                .HasForeignKey(d => d.AuthorUuid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_AUTHOR_DISTINCTIONS_AUTHOR");
        });

        modelBuilder.Entity<AuthorLanguage>(entity =>
        {
            entity.HasKey(e => new { e.AuthorUuid, e.LanguageUuid }).HasName("PK__AUTHOR_L__A1BA461319EB55ED");

            entity.HasOne(d => d.AuthorUu).WithMany(p => p.AuthorLanguages)
                .HasPrincipalKey(p => p.AuthorUuid)
                .HasForeignKey(d => d.AuthorUuid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_AUTHOR_LANGUAGES_AUTHOR");

            entity.HasOne(d => d.LanguageUu).WithMany(p => p.AuthorLanguages)
                .HasPrincipalKey(p => p.LanguageUuid)
                .HasForeignKey(d => d.LanguageUuid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_AUTHOR_LANGUAGES_LANGUAGE");
        });

        modelBuilder.Entity<BannedWord>(entity =>
        {
            entity.HasKey(e => e.BannedWordId).HasName("PK__BANNED_W__658A9C69BFC7BFC9");

            entity.HasOne(d => d.LanguageUu).WithMany(p => p.BannedWords)
                .HasPrincipalKey(p => p.LanguageUuid)
                .HasForeignKey(d => d.LanguageUuid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BANNED_WORDS_LANGUAGE");
        });

        modelBuilder.Entity<Book>(entity =>
        {
            entity.HasKey(e => e.BookId).HasName("PK__BOOK__490D1AE1EFDE6AFD");

            entity.HasIndex(e => e.BookIsbn, "UQ_BOOK_book_isbn_not_null")
                .IsUnique()
                .HasFilter("([book_isbn] IS NOT NULL)");

            entity.HasOne(d => d.BookSeriesUu).WithMany(p => p.Books)
                .HasPrincipalKey(p => p.SeriesUuid)
                .HasForeignKey(d => d.BookSeriesUuid)
                .HasConstraintName("FK_BOOK_SERIES");

            entity.HasMany(d => d.AuthorUus).WithMany(p => p.BookUus)
                .UsingEntity<Dictionary<string, object>>(
                    "BookAuthor",
                    r => r.HasOne<Author>().WithMany()
                        .HasPrincipalKey("AuthorUuid")
                        .HasForeignKey("AuthorUuid")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK_BOOK_AUTHORS_AUTHOR"),
                    l => l.HasOne<Book>().WithMany()
                        .HasPrincipalKey("BookUuid")
                        .HasForeignKey("BookUuid")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK_BOOK_AUTHORS_BOOK"),
                    j =>
                    {
                        j.HasKey("BookUuid", "AuthorUuid").HasName("PK__BOOK_AUT__C1D367A306BA687F");
                        j.ToTable("BOOK_AUTHORS");
                        j.IndexerProperty<Guid>("BookUuid").HasColumnName("book_uuid").HasColumnType("uniqueidentifier"); ;
                        j.IndexerProperty<Guid>("AuthorUuid").HasColumnName("author_uuid").HasColumnType("uniqueidentifier"); ;
                    });

            entity.HasMany(d => d.CategoryUus).WithMany(p => p.BookUus)
                .UsingEntity<Dictionary<string, object>>(
                    "BookCategory",
                    r => r.HasOne<Category>().WithMany()
                        .HasPrincipalKey("CategoryUuid")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK_BOOK_CATEGORIES_CATEGORY"),
                    l => l.HasOne<Book>().WithMany()
                        .HasPrincipalKey("BookUuid")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK_BOOK_CATEGORIES_BOOK"),
                    j =>
                    {
                        j.HasKey("CategoryUuid", "BookUuid").HasName("PK__BOOK_CAT__EEAACD486BDDB89C");
                        j.ToTable("BOOK_CATEGORIES");
                        j.IndexerProperty<Guid>("CategoryUuid").HasColumnName("category_uuid").HasColumnType("uniqueidentifier");
                        j.IndexerProperty<Guid>("BookUuid").HasColumnName("book_uuid").HasColumnType("uniqueidentifier");
                    });

            entity.HasMany(d => d.PublisherUus).WithMany(p => p.BookUus)
                .UsingEntity<Dictionary<string, object>>(
                    "BookPublisher",
                    r => r.HasOne<Publisher>().WithMany()
                        .HasPrincipalKey("PublisherUuid")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK_BOOK_PUBLISHERS_PUBLISHER"),
                    l => l.HasOne<Book>().WithMany()
                        .HasPrincipalKey("BookUuid")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK_BOOK_PUBLISHERS_BOOK"),
                    j =>
                    {
                        j.HasKey("BookUuid", "PublisherUuid").HasName("PK__BOOK_PUB__35E19F790C3858C5");
                        j.ToTable("BOOK_PUBLISHERS");
                        j.IndexerProperty<Guid>("BookUuid").HasColumnName("book_uuid").HasColumnType("uniqueidentifier"); ;
                        j.IndexerProperty<Guid>("PublisherUuid").HasColumnName("publisher_uuid").HasColumnType("uniqueidentifier"); ;
                    });

            entity.HasMany(d => d.TagUus).WithMany(p => p.BookUus)
                .UsingEntity<Dictionary<string, object>>(
                    "BookTag",
                    r => r.HasOne<Tag>().WithMany()
                        .HasPrincipalKey("TagUuid")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK_BOOK_TAGS_TAG"),
                    l => l.HasOne<Book>().WithMany()
                        .HasPrincipalKey("BookUuid")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK_BOOK_TAGS_BOOK"),
                    j =>
                    {
                        j.HasKey("BookUuid", "TagUuid").HasName("PK__BOOK_TAG__CF915547EFFE727A");
                        j.ToTable("BOOK_TAGS");
                        j.IndexerProperty<Guid>("BookUuid").HasColumnName("book_uuid").HasColumnType("uniqueidentifier"); ;
                        j.IndexerProperty<Guid>("TagUuid").HasColumnName("tag_uuid").HasColumnType("uniqueidentifier"); ;
                    });
        });

        modelBuilder.Entity<BookImage>(entity =>
        {
            entity.HasKey(e => e.ImageId).HasName("PK__BOOK_IMA__336E9B754EAE95AD");

            entity.HasOne(d => d.BookUu).WithMany(p => p.BookImages)
                .HasPrincipalKey(p => p.BookUuid)
                .HasForeignKey(d => d.BookUuid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BOOK_IMAGES_BOOK");

            entity.HasOne(d => d.ImageTypeUu).WithMany(p => p.BookImages)
                .HasPrincipalKey(p => p.ImageTypeUuid)
                .HasForeignKey(d => d.ImageTypeUuid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BOOK_IMAGES_TYPE");
        });

        modelBuilder.Entity<BookImageType>(entity =>
        {
            entity.HasKey(e => e.ImageTypeId).HasName("PK__BOOK_IMA__01284680507E3A52");
        });

        modelBuilder.Entity<BookLanguage>(entity =>
        {
            entity.HasKey(e => new { e.BookUuid, e.LanguageUuid }).HasName("PK__BOOK_LAN__BEF8F296339C65C7");

            entity.HasOne(d => d.BookUu).WithMany(p => p.BookLanguages)
                .HasPrincipalKey(p => p.BookUuid)
                .HasForeignKey(d => d.BookUuid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BOOK_LANGUAGES_BOOK");

            entity.HasOne(d => d.LanguageUu).WithMany(p => p.BookLanguages)
                .HasPrincipalKey(p => p.LanguageUuid)
                .HasForeignKey(d => d.LanguageUuid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BOOK_LANGUAGES_LANGUAGE");
        });

        modelBuilder.Entity<BookNote>(entity =>
        {
            entity.HasKey(e => e.NoteId).HasName("PK__BOOK_NOT__CEDD0FA4626EE0B1");

            entity.HasOne(d => d.BookUu).WithMany(p => p.BookNotes)
                .HasPrincipalKey(p => p.BookUuid)
                .HasForeignKey(d => d.BookUuid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BOOK_NOTES_BOOK");

            entity.HasOne(d => d.UserUu).WithMany(p => p.BookNotes)
                .HasPrincipalKey(p => p.UserUuid)
                .HasForeignKey(d => d.UserUuid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BOOK_NOTES_USER");
        });

        modelBuilder.Entity<BookSeriesOrder>(entity =>
        {
            entity.HasKey(e => new { e.SeriesUuid, e.BookUuid }).HasName("PK__BOOK_SER__A95B0618F5BA10CE");

            entity.HasOne(d => d.BookUu).WithMany(p => p.BookSeriesOrders)
                .HasPrincipalKey(p => p.BookUuid)
                .HasForeignKey(d => d.BookUuid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BOOK_SERIES_ORDER_BOOK");

            entity.HasOne(d => d.SeriesUu).WithMany(p => p.BookSeriesOrders)
                .HasPrincipalKey(p => p.SeriesUuid)
                .HasForeignKey(d => d.SeriesUuid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BOOK_SERIES_ORDER_SERIES");
        });

        modelBuilder.Entity<BookTranslation>(entity =>
        {
            entity.HasKey(e => e.BookTranslationId).HasName("PK__BOOK_TRA__FB9721E14F30C370");

            entity.HasOne(d => d.BookUu).WithMany(p => p.BookTranslations)
                .HasPrincipalKey(p => p.BookUuid)
                .HasForeignKey(d => d.BookUuid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BOOK_TRANSLATIONS_BOOK");

            entity.HasOne(d => d.LanguageUu).WithMany(p => p.BookTranslations)
                .HasPrincipalKey(p => p.LanguageUuid)
                .HasForeignKey(d => d.LanguageUuid)
                .HasConstraintName("FK_BOOK_TRANSLATIONS_LANGUAGE");
        });

        modelBuilder.Entity<BookVersionHistory>(entity =>
        {
            entity.HasKey(e => e.VersionId).HasName("PK__BOOK_VER__07A5886968C4A25E");

            entity.HasOne(d => d.BookUu).WithMany(p => p.BookVersionHistories)
                .HasPrincipalKey(p => p.BookUuid)
                .HasForeignKey(d => d.BookUuid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BOOK_VERSION_HISTORY_BOOK");

            entity.HasOne(d => d.PublisherUu).WithMany(p => p.BookVersionHistories)
                .HasPrincipalKey(p => p.PublisherUuid)
                .HasForeignKey(d => d.PublisherUuid)
                .HasConstraintName("FK_BOOK_VERSION_HISTORY_PUBLISHER");

            entity.HasOne(d => d.UserUu).WithMany(p => p.BookVersionHistories)
                .HasPrincipalKey(p => p.UserUuid)
                .HasForeignKey(d => d.UserUuid)
                .HasConstraintName("FK_BOOK_VERSION_HISTORY_USER");
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PK__CATEGORI__D54EE9B4665AAD6D");
        });

        modelBuilder.Entity<Color>(entity =>
        {
            entity.HasKey(e => e.ColorId).HasName("PK__COLORS__1143CECBE55764CB");
        });

        modelBuilder.Entity<Gender>(entity =>
        {
            entity.HasKey(e => e.GenderId).HasName("PK__GENDERS__9DF18F87CC27AEBF");
        });

        modelBuilder.Entity<Language>(entity =>
        {
            entity.HasKey(e => e.LanguageId).HasName("PK__LANGUAGE__804CF6B305F0F825");
        });

        modelBuilder.Entity<ModerationLog>(entity =>
        {
            entity.HasKey(e => e.ModerationId).HasName("PK__MODERATI__B56E7D6152AB004F");
        });

        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasKey(e => e.NotificationId).HasName("PK__NOTIFICA__E059842F508718C8");

            entity.HasOne(d => d.UserUu).WithMany(p => p.Notifications)
                .HasPrincipalKey(p => p.UserUuid)
                .HasForeignKey(d => d.UserUuid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_NOTIFICATIONS_USER");
        });

        modelBuilder.Entity<OrderHistory>(entity =>
        {
            entity.HasKey(e => e.OrderId).HasName("PK__ORDER_HI__465962297C864BFF");

            entity.HasOne(d => d.UserUu).WithMany(p => p.OrderHistories)
                .HasPrincipalKey(p => p.UserUuid)
                .HasForeignKey(d => d.UserUuid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ORDER_HISTORY_USER");
        });

        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.HasKey(e => new { e.OrderUuid, e.BookUuid }).HasName("PK__ORDER_IT__074B631E9C88B426");

            entity.HasOne(d => d.BookUu).WithMany(p => p.OrderItems)
                .HasPrincipalKey(p => p.BookUuid)
                .HasForeignKey(d => d.BookUuid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ORDER_ITEMS_BOOK");

            entity.HasOne(d => d.OrderUu).WithMany(p => p.OrderItems)
                .HasPrincipalKey(p => p.OrderUuid)
                .HasForeignKey(d => d.OrderUuid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ORDER_ITEMS_ORDER");
        });

        modelBuilder.Entity<Preference>(entity =>
        {
            entity.HasKey(e => e.PreferenceId).HasName("PK__PREFEREN__FB41DBCF8B9195D3");

            entity.HasOne(d => d.ColorUu).WithMany(p => p.Preferences)
                .HasPrincipalKey(p => p.ColorUuid)
                .HasForeignKey(d => d.ColorUuid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PREFERENCES_COLOR");

            entity.HasOne(d => d.LanguageUu).WithMany(p => p.Preferences)
                .HasPrincipalKey(p => p.LanguageUuid)
                .HasForeignKey(d => d.LanguageUuid)
                .HasConstraintName("FK_PREFERENCES_LANGUAGE");

            entity.HasOne(d => d.ThemeUu).WithMany(p => p.Preferences)
                .HasPrincipalKey(p => p.ThemeUuid)
                .HasForeignKey(d => d.ThemeUuid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PREFERENCES_THEME");

            entity.HasOne(d => d.UserUu).WithOne(p => p.Preference)
                .HasPrincipalKey<User>(p => p.UserUuid)
                .HasForeignKey<Preference>(d => d.UserUuid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PREFERENCES_USER");
        });

        modelBuilder.Entity<Publisher>(entity =>
        {
            entity.HasKey(e => e.PublisherId).HasName("PK__PUBLISHE__3263F29D1F52FDE9");
        });

        modelBuilder.Entity<ReadList>(entity =>
        {
            entity.HasKey(e => e.ReadListId).HasName("PK__READ_LIS__D0FDE1BBFCC5CBC6");

            entity.HasOne(d => d.UserUu).WithMany(p => p.ReadLists)
                .HasPrincipalKey(p => p.UserUuid)
                .HasForeignKey(d => d.UserUuid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_READ_LISTS_USER");
        });

        modelBuilder.Entity<ReadListBook>(entity =>
        {
            entity.HasKey(e => new { e.ReadListUuid, e.BookUuid }).HasName("PK__READ_LIS__5D066FA8293326D7");

            entity.HasOne(d => d.BookUu).WithMany(p => p.ReadListBooks)
                .HasPrincipalKey(p => p.BookUuid)
                .HasForeignKey(d => d.BookUuid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_READ_LIST_BOOKS_BOOK");

            entity.HasOne(d => d.ReadListUu).WithMany(p => p.ReadListBooks)
                .HasPrincipalKey(p => p.ReadListUuid)
                .HasForeignKey(d => d.ReadListUuid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_READ_LIST_BOOKS_READ_LIST");
        });

        modelBuilder.Entity<Series>(entity =>
        {
            entity.HasKey(e => e.SeriesId).HasName("PK__SERIES__EA7DCE16DD24B7AA");
        });

        modelBuilder.Entity<ShoppingBasket>(entity =>
        {
            entity.HasKey(e => e.BasketId).HasName("PK__SHOPPING__65E4F9F02B8A59FD");

            entity.HasOne(d => d.UserUu).WithMany(p => p.ShoppingBaskets)
                .HasPrincipalKey(p => p.UserUuid)
                .HasForeignKey(d => d.UserUuid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SHOPPING_BASKETS_USER");
        });

        modelBuilder.Entity<ShoppingBasketItem>(entity =>
        {
            entity.HasKey(e => new { e.BasketUuid, e.BookUuid }).HasName("PK__SHOPPING__03855E182BE2940B");

            entity.HasOne(d => d.BasketUu).WithMany(p => p.ShoppingBasketItems)
                .HasPrincipalKey(p => p.BasketUuid)
                .HasForeignKey(d => d.BasketUuid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SHOPPING_BASKET_ITEMS_BASKET");

            entity.HasOne(d => d.BookUu).WithMany(p => p.ShoppingBasketItems)
                .HasPrincipalKey(p => p.BookUuid)
                .HasForeignKey(d => d.BookUuid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SHOPPING_BASKET_ITEMS_BOOK");
        });

        modelBuilder.Entity<StateStatus>(entity =>
        {
            entity.HasKey(e => e.StateStatusId).HasName("PK__STATE_ST__274BFA96C5EDF2E6");
        });

        modelBuilder.Entity<Tag>(entity =>
        {
            entity.HasKey(e => e.TagId).HasName("PK__TAGS__4296A2B6B70AEAC4");
        });

        modelBuilder.Entity<Theme>(entity =>
        {
            entity.HasKey(e => e.ThemeId).HasName("PK__THEMES__73CEC20A959BEB3B");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__USERS__B9BE370F938CA16C");

            entity.HasOne(d => d.GenderUu).WithMany(p => p.Users)
                .HasPrincipalKey(p => p.GenderUuid)
                .HasForeignKey(d => d.GenderUuid)
                .HasConstraintName("FK_GENDERS");

            entity.HasOne(d => d.UserRightUu).WithMany(p => p.Users)
                .HasPrincipalKey(p => p.UserRightUuid)
                .HasForeignKey(d => d.UserRightUuid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_USER_RIGHTS");
        });

        modelBuilder.Entity<UserBookActivity>(entity =>
        {
            entity.HasKey(e => e.ActivityId).HasName("PK__USER_BOO__482FBD6382505CE0");

            entity.HasOne(d => d.ActivityTypeUu).WithMany(p => p.UserBookActivities)
                .HasPrincipalKey(p => p.ActivityTypeUuid)
                .HasForeignKey(d => d.ActivityTypeUuid)
                .HasConstraintName("FK_USER_BOOK_ACTIVITY_ACTIVITY_TYPE");

            entity.HasOne(d => d.BookUu).WithMany(p => p.UserBookActivities)
                .HasPrincipalKey(p => p.BookUuid)
                .HasForeignKey(d => d.BookUuid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_USER_BOOK_ACTIVITY_BOOK");

            entity.HasOne(d => d.UserUu).WithMany(p => p.UserBookActivities)
                .HasPrincipalKey(p => p.UserUuid)
                .HasForeignKey(d => d.UserUuid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_USER_BOOK_ACTIVITY_USER");
        });

        modelBuilder.Entity<UserBookState>(entity =>
        {
            entity.HasKey(e => e.StateId).HasName("PK__USER_BOO__81A47417422057E3");

            entity.HasOne(d => d.BookUu).WithMany(p => p.UserBookStates)
                .HasPrincipalKey(p => p.BookUuid)
                .HasForeignKey(d => d.BookUuid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_USER_BOOK_STATE_BOOK");

            entity.HasOne(d => d.StateStatusUu).WithMany(p => p.UserBookStates)
                .HasPrincipalKey(p => p.StateStatusUuid)
                .HasForeignKey(d => d.StateStatusUuid)
                .HasConstraintName("FK_USER_BOOK_STATE_STATE_STATUS");

            entity.HasOne(d => d.UserUu).WithMany(p => p.UserBookStates)
                .HasPrincipalKey(p => p.UserUuid)
                .HasForeignKey(d => d.UserUuid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_USER_BOOK_STATE_USER");
        });

        modelBuilder.Entity<UserConnection>(entity =>
        {
            entity.HasKey(e => e.ConnectionId).HasName("PK__USER_CON__E4AA4DD0E558647C");

            entity.HasOne(d => d.UserUu).WithMany(p => p.UserConnections)
                .HasPrincipalKey(p => p.UserUuid)
                .HasForeignKey(d => d.UserUuid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_USER_CONNECTIONS");
        });

        modelBuilder.Entity<UserRight>(entity =>
        {
            entity.HasKey(e => e.UserRightId).HasName("PK__USER_RIG__8B55E73BDA620ADB");
        });

        modelBuilder.Entity<UserRoleHistory>(entity =>
        {
            entity.HasKey(e => e.HistoryId).HasName("PK__USER_ROL__096AA2E98AF58028");

            entity.HasOne(d => d.ModifiedByUu).WithMany(p => p.UserRoleHistoryModifiedByUus)
                .HasPrincipalKey(p => p.UserUuid)
                .HasForeignKey(d => d.ModifiedByUuid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_USER_ROLE_HISTORY_USER_MODIFIED_BY");

            entity.HasOne(d => d.NewRightUu).WithMany(p => p.UserRoleHistoryNewRightUus)
                .HasPrincipalKey(p => p.UserRightUuid)
                .HasForeignKey(d => d.NewRightUuid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_USER_ROLE_HISTORY_USER_RIGHT_NEW");

            entity.HasOne(d => d.PreviousRightUu).WithMany(p => p.UserRoleHistoryPreviousRightUus)
                .HasPrincipalKey(p => p.UserRightUuid)
                .HasForeignKey(d => d.PreviousRightUuid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_USER_ROLE_HISTORY_USER_RIGHT_PREVIOUS");

            entity.HasOne(d => d.TargetUserUu).WithMany(p => p.UserRoleHistoryTargetUserUus)
                .HasPrincipalKey(p => p.UserUuid)
                .HasForeignKey(d => d.TargetUserUuid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_USER_ROLE_HISTORY_USER_TARGET");
        });

        modelBuilder.Entity<WishlistBook>(entity =>
        {
            entity.HasKey(e => e.WishlistId).HasName("PK__WISHLIST__6151514E678061D2");

            entity.HasOne(d => d.BookUu).WithMany(p => p.WishlistBooks)
                .HasPrincipalKey(p => p.BookUuid)
                .HasForeignKey(d => d.BookUuid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_WISHLIST_BOOKS_BOOK");

            entity.HasOne(d => d.UserUu).WithMany(p => p.WishlistBooks)
                .HasPrincipalKey(p => p.UserUuid)
                .HasForeignKey(d => d.UserUuid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_WISHLIST_BOOKS_USER");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}

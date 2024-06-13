using Microsoft.EntityFrameworkCore;

namespace BookAPI.Models;

public partial class BookDbContext : DbContext
{
    public BookDbContext()
    {
    }

    public BookDbContext(DbContextOptions<BookDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Author> Authors { get; set; }

    public virtual DbSet<Book> Books { get; set; }

    public virtual DbSet<BookAction> BookActions { get; set; }

    public virtual DbSet<BookCategory> BookCategories { get; set; }

    public virtual DbSet<Modify> Modifies { get; set; }

    public virtual DbSet<Publisher> Publishers { get; set; }

    public virtual DbSet<Readlist> Readlists { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<CategoryList> CategoryLists { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Name=ConnectionStrings:DevConnection");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Author>(entity =>
        {
            entity.ToTable("AUTHOR");

            entity.Property(e => e.AuthorId).HasColumnName("authorID");
            entity.Property(e => e.AuthorName)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("authorName");
        });

        modelBuilder.Entity<Book>(entity =>
        {
            entity.ToTable("BOOK");

            entity.Property(e => e.BookId).HasColumnName("bookID");
            entity.Property(e => e.AuthorId).HasColumnName("authorID");
            entity.Property(e => e.BookAverageRating).HasColumnName("bookAverageRating");
            entity.Property(e => e.BookDescription)
                .HasColumnType("text")
                .HasColumnName("bookDescription");
            entity.Property(e => e.BookImageLink)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("bookImageLink");
            entity.Property(e => e.BookLanguage)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("bookLanguage");
            entity.Property(e => e.BookPageCount).HasColumnName("bookPageCount");
            entity.Property(e => e.BookPublishDate)
                .HasColumnType("datetime")
                .HasColumnName("bookPublishDate");
            entity.Property(e => e.BookRatingCount).HasColumnName("bookRatingCount");
            entity.Property(e => e.BookTitle)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("bookTitle");
            entity.Property(e => e.PublisherId).HasColumnName("publisherID");

            entity.HasOne(d => d.Author).WithMany(p => p.Books)
                .HasForeignKey(d => d.AuthorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BOOK_AUTHOR0");

            entity.HasOne(d => d.Publisher).WithMany(p => p.Books)
                .HasForeignKey(d => d.PublisherId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BOOK_PUBLISHER");
        });


        modelBuilder.Entity<BookAction>(entity =>
        {
            entity.HasKey(e => new { e.BookId, e.UserId });

            entity.ToTable("BOOK_ACTIONS");

            entity.Property(e => e.BookId).HasColumnName("bookID");
            entity.Property(e => e.UserId).HasColumnName("userID");
            entity.Property(e => e.BookActionsDateAdd)
                .HasColumnType("datetime")
                .HasColumnName("bookActionsDateAdd");
            entity.Property(e => e.BookActionsDateUpdate)
                .HasColumnType("datetime")
                .HasColumnName("bookActionsDateUpdate");

            entity.HasOne(d => d.Book).WithMany(p => p.BookActions)
                .HasForeignKey(d => d.BookId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BOOK_ACTIONS_BOOK");

            entity.HasOne(d => d.User).WithMany(p => p.BookActions)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BOOK_ACTIONS_USERS0");
        });

        modelBuilder.Entity<BookCategory>(entity =>
        {
            entity.HasKey(e => e.BookCategoId);

            entity.ToTable("BOOK_CATEGORIES");

            entity.Property(e => e.BookCategoId).HasColumnName("bookCategoID");
            entity.Property(e => e.BookCategoDescription)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("bookCategoDescription");
            entity.Property(e => e.BookCategoName)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("bookCategoName");
        });


        modelBuilder.Entity<Modify>(entity =>
        {
            entity.HasKey(e => new { e.UserId, e.UserIdUsers });

            entity.ToTable("MODIFY");

            entity.Property(e => e.UserId).HasColumnName("userID");
            entity.Property(e => e.UserIdUsers).HasColumnName("userID_USERS");
            entity.Property(e => e.ModifyDate)
                .HasColumnType("datetime")
                .HasColumnName("modifyDate");

            entity.HasOne(d => d.User).WithMany(p => p.ModifyUsers)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_MODIFY_USERS");

            entity.HasOne(d => d.UserIdUsersNavigation).WithMany(p => p.ModifyUserIdUsersNavigations)
                .HasForeignKey(d => d.UserIdUsers)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_MODIFY_USERS0");
        });

        modelBuilder.Entity<Publisher>(entity =>
        {
            entity.ToTable("PUBLISHER");

            entity.Property(e => e.PublisherId).HasColumnName("publisherID");
            entity.Property(e => e.PublisherName)
                .HasMaxLength(60)
                .IsUnicode(false)
                .HasColumnName("publisherName");
        });

        modelBuilder.Entity<Readlist>(entity =>
        {
            entity.HasKey(e => new { e.BookId, e.UserId });

            entity.ToTable("READLIST");

            entity.Property(e => e.BookId).HasColumnName("bookID");
            entity.Property(e => e.UserId).HasColumnName("userID");
            entity.Property(e => e.ReadListDateAdd)
                .HasColumnType("datetime")
                .HasColumnName("readListDateAdd");
            entity.Property(e => e.ReadListDateUpdate)
                .HasColumnType("datetime")
                .HasColumnName("readListDateUpdate");
            entity.Property(e => e.ReadListRead).HasColumnName("readListRead");

            entity.HasOne(d => d.Book).WithMany(p => p.Readlists)
                .HasForeignKey(d => d.BookId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_READLIST_BOOK");

            entity.HasOne(d => d.User).WithMany(p => p.Readlists)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_READLIST_USERS0");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("USERS");

            entity.Property(e => e.UserId).HasColumnName("userID");
            entity.Property(e => e.UserEmail)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("userEmail");
            entity.Property(e => e.UserFirstname)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("userFirstname");
            entity.Property(e => e.UserLastname)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("userLastname");
            entity.Property(e => e.UserLogin)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("userLogin");
            entity.Property(e => e.UserPassword)
                .HasMaxLength(80)
                .IsUnicode(false)
                .HasColumnName("userPassword");
            entity.Property(e => e.UserRight)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("userRight");
            entity.HasCheckConstraint("CHK_Users_UserRight", "[userRight] IN ('Super Admin', 'Admin', 'User')");
        });

        modelBuilder.Entity<CategoryList>(entity =>
        {
            entity.HasKey(cl => new { cl.BookId, cl.BookCategoId });

            entity.ToTable("CATEGORIE_LIST");

            entity.HasOne(cl => cl.Book)
                .WithMany(b => b.CategorieLists)
                .HasForeignKey(cl => cl.BookId);

            entity.HasOne(cl => cl.BookCategory)
                .WithMany(bc => bc.CategorieLists)
                .HasForeignKey(cl => cl.BookCategoId);
        });



        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}

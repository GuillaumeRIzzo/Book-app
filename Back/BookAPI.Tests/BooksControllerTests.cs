using BookAPI.Controllers;
using BookAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Moq;

namespace BookAPI.Tests
{
    public class BooksControllerTests
    {
        private readonly Mock<BookDbContext> _mockContext;
        private readonly CategoryListsController _mockCategoryListsController;
        private readonly BooksController _controller;

        public BooksControllerTests()
        {
            _mockContext = new Mock<BookDbContext>();
            _mockCategoryListsController = new CategoryListsController(_mockContext.Object);
            _controller = new BooksController(_mockContext.Object, _mockCategoryListsController);
        }

        [Fact]
        public async Task GetBooks_ReturnsListOfBooks_WhenBooksExist()
        {
            // Arrange
            var books = new List<Book>
            {
                new Book { BookId = 1, BookTitle = "Book 1", BookDescription = "Description 1", BookPublishDate = new DateTime(2020, 1, 1), BookPageCount = 100, BookAverageRating = 4.5, BookRatingCount = 10, BookImageLink = "link1", BookLanguage = "EN", PublisherId = 1, AuthorId = 1 },
                new Book { BookId = 2, BookTitle = "Book 2", BookDescription = "Description 2", BookPublishDate = new DateTime(2021, 1, 1), BookPageCount = 200, BookAverageRating = 4.0, BookRatingCount = 20, BookImageLink = "link2", BookLanguage = "EN", PublisherId = 2, AuthorId = 2 }
            }.AsQueryable();

            var readlists = new List<Readlist>
            {
                new Readlist { UserId = 1, BookId = 1, ReadListRead = true }
            }.AsQueryable();

            var categoryLists = new List<CategoryList>
            {
                new CategoryList { BookId = 1, BookCategoId = 1, BookCategory = new BookCategory { BookCategoId = 1, BookCategoName = "Fiction", BookCategoDescription = "Fiction Books" } },
                new CategoryList { BookId = 2, BookCategoId = 2, BookCategory = new BookCategory { BookCategoId = 2, BookCategoName = "Non-Fiction", BookCategoDescription = "Non-Fiction Books" } }
            }.AsQueryable();

            // Mock the DbSet<Book>
            var mockBooksSet = new Mock<DbSet<Book>>();
            mockBooksSet.As<IQueryable<Book>>().Setup(m => m.Provider).Returns(new TestAsyncQueryProvider<Book>(books.Provider));
            mockBooksSet.As<IQueryable<Book>>().Setup(m => m.Expression).Returns(books.Expression);
            mockBooksSet.As<IQueryable<Book>>().Setup(m => m.ElementType).Returns(books.ElementType);
            mockBooksSet.As<IQueryable<Book>>().Setup(m => m.GetEnumerator()).Returns(books.GetEnumerator());
            mockBooksSet.As<IAsyncEnumerable<Book>>().Setup(m => m.GetAsyncEnumerator(It.IsAny<CancellationToken>()))
                .Returns(new TestAsyncEnumerator<Book>(books.GetEnumerator()));

            // Mock the DbSet<Readlist>
            var mockReadlistsSet = new Mock<DbSet<Readlist>>();
            mockReadlistsSet.As<IQueryable<Readlist>>().Setup(m => m.Provider).Returns(new TestAsyncQueryProvider<Readlist>(readlists.Provider));
            mockReadlistsSet.As<IQueryable<Readlist>>().Setup(m => m.Expression).Returns(readlists.Expression);
            mockReadlistsSet.As<IQueryable<Readlist>>().Setup(m => m.ElementType).Returns(readlists.ElementType);
            mockReadlistsSet.As<IQueryable<Readlist>>().Setup(m => m.GetEnumerator()).Returns(readlists.GetEnumerator());
            mockReadlistsSet.As<IAsyncEnumerable<Readlist>>().Setup(m => m.GetAsyncEnumerator(It.IsAny<CancellationToken>()))
                .Returns(new TestAsyncEnumerator<Readlist>(readlists.GetEnumerator()));

            // Mock the DbSet<CategoryList>
            var mockCategoryListsSet = new Mock<DbSet<CategoryList>>();
            mockCategoryListsSet.As<IQueryable<CategoryList>>().Setup(m => m.Provider).Returns(new TestAsyncQueryProvider<CategoryList>(categoryLists.Provider));
            mockCategoryListsSet.As<IQueryable<CategoryList>>().Setup(m => m.Expression).Returns(categoryLists.Expression);
            mockCategoryListsSet.As<IQueryable<CategoryList>>().Setup(m => m.ElementType).Returns(categoryLists.ElementType);
            mockCategoryListsSet.As<IQueryable<CategoryList>>().Setup(m => m.GetEnumerator()).Returns(categoryLists.GetEnumerator());
            mockCategoryListsSet.As<IAsyncEnumerable<CategoryList>>().Setup(m => m.GetAsyncEnumerator(It.IsAny<CancellationToken>()))
                .Returns(new TestAsyncEnumerator<CategoryList>(categoryLists.GetEnumerator()));

            _mockContext.Setup(c => c.Books).Returns(mockBooksSet.Object);
            _mockContext.Setup(c => c.Readlists).Returns(mockReadlistsSet.Object);
            _mockContext.Setup(c => c.CategoryLists).Returns(mockCategoryListsSet.Object);

            // Act
            var result = await _controller.GetBooks(1);

            // Assert
            var actionResult = Assert.IsType<ActionResult<IEnumerable<ModelViewBook>>>(result);
            var returnValue = Assert.IsType<List<ModelViewBook>>(actionResult.Value);
            Assert.Equal(2, returnValue.Count);
            Assert.Contains(returnValue, b => b.BookTitle == "Book 1" && b.InList == true && b.Read == true);
            Assert.Contains(returnValue, b => b.BookTitle == "Book 2" && b.InList == false);
        }

        [Fact]
        public async Task GetBook_ReturnsSingleBook_WhenBookExists()
        {
            // Arrange
            var book = new Book { BookId = 1, BookTitle = "Book 1", BookDescription = "Description 1", BookPublishDate = new DateTime(), BookPageCount = 42, BookRatingCount = 0, BookImageLink = "", BookLanguage = "Français", PublisherId = 1, AuthorId = 1 };
            var mockSet = new Mock<DbSet<Book>>();

            var categoryLists = new List<CategoryList>
            {
                new CategoryList { BookId = 1, BookCategoId = 1, BookCategory = new BookCategory { BookCategoId = 1, BookCategoName = "Fiction", BookCategoDescription = "Fiction Books" } },
                new CategoryList { BookId = 2, BookCategoId = 2, BookCategory = new BookCategory { BookCategoId = 2, BookCategoName = "Non-Fiction", BookCategoDescription = "Non-Fiction Books" } }
            }.AsQueryable();

            mockSet.Setup(m => m.FindAsync(1)).ReturnsAsync(book);

            // Mock the DbSet<CategoryList>
            var mockCategoryListsSet = new Mock<DbSet<CategoryList>>();
            mockCategoryListsSet.As<IQueryable<CategoryList>>().Setup(m => m.Provider).Returns(new TestAsyncQueryProvider<CategoryList>(categoryLists.Provider));
            mockCategoryListsSet.As<IQueryable<CategoryList>>().Setup(m => m.Expression).Returns(categoryLists.Expression);
            mockCategoryListsSet.As<IQueryable<CategoryList>>().Setup(m => m.ElementType).Returns(categoryLists.ElementType);
            mockCategoryListsSet.As<IQueryable<CategoryList>>().Setup(m => m.GetEnumerator()).Returns(categoryLists.GetEnumerator());
            mockCategoryListsSet.As<IAsyncEnumerable<CategoryList>>().Setup(m => m.GetAsyncEnumerator(It.IsAny<CancellationToken>()))
                .Returns(new TestAsyncEnumerator<CategoryList>(categoryLists.GetEnumerator()));


            _mockContext.Setup(c => c.Books).Returns(mockSet.Object);
            _mockContext.Setup(c => c.CategoryLists).Returns(mockCategoryListsSet.Object);
            // Act
            var result = await _controller.GetBook(1);

            // Assert
            var actionResult = Assert.IsType<ActionResult<ModelViewBook>>(result);
            var returnValue = Assert.IsType<ModelViewBook>(actionResult.Value);
            Assert.Equal(book.BookId, returnValue.BookId);
        }

        [Fact]
        public async Task GetBook_ReturnsNotFound_WhenBookDoesNotExist()
        {
            // Arrange
            var mockDbSet = new Mock<DbSet<Book>>();
            _mockContext.Setup(m => m.Books).Returns(mockDbSet.Object);

            // Act
            var result = await _controller.GetBook(1);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task PutBook_Updates_Book_Successfully()
        {
            // Arrange
            var bookId = 1;
            var model = new ModelViewBook
            {
                BookId = bookId,
                BookTitle = "Updated Title",
                BookDescription = "Updated Description",
                BookPublishDate = DateTime.Now,
                BookPageCount = 300,
                BookAverageRating = 4.5,
                BookRatingCount = 100,
                BookImageLink = "Updated Image Link",
                BookLanguage = "English",
                PublisherId = 1,
                AuthorId = 1,
                Categories = new List<ModelViewBookCategory>()
                {
                    new ModelViewBookCategory { BookCategoId = 1 },
                    new ModelViewBookCategory { BookCategoId = 2 }
                }
            };

            var existingBook = new Book
            {
                BookId = bookId,
                BookTitle = "Old Title",
                BookDescription = "Old Description",
                BookPublishDate = DateTime.Now,
                BookPageCount = 200,
                BookAverageRating = 3.5,
                BookRatingCount = 50,
                BookImageLink = "Old Image Link",
                BookLanguage = "English",
                PublisherId = 1,
                AuthorId = 1
            };

            var mockBooksSet = new Mock<DbSet<Book>>();
            mockBooksSet.Setup(m => m.FindAsync(bookId)).ReturnsAsync(existingBook);

            var categoryLists = new List<CategoryList>
            {
                new CategoryList { BookId = 1, BookCategoId = 1, BookCategory = new BookCategory { BookCategoId = 1, BookCategoName = "Fiction", BookCategoDescription = "Fiction Books" } },
                new CategoryList { BookId = 2, BookCategoId = 2, BookCategory = new BookCategory { BookCategoId = 2, BookCategoName = "Non-Fiction", BookCategoDescription = "Non-Fiction Books" } }
            }.AsQueryable();

            var mockCategoryListsSet = new Mock<DbSet<CategoryList>>();
            mockCategoryListsSet.As<IQueryable<CategoryList>>().Setup(m => m.Provider).Returns(new TestAsyncQueryProvider<CategoryList>(categoryLists.Provider));
            mockCategoryListsSet.As<IQueryable<CategoryList>>().Setup(m => m.Expression).Returns(categoryLists.Expression);
            mockCategoryListsSet.As<IQueryable<CategoryList>>().Setup(m => m.ElementType).Returns(categoryLists.ElementType);
            mockCategoryListsSet.As<IQueryable<CategoryList>>().Setup(m => m.GetEnumerator()).Returns(categoryLists.GetEnumerator());
            mockCategoryListsSet.As<IAsyncEnumerable<CategoryList>>().Setup(m => m.GetAsyncEnumerator(It.IsAny<CancellationToken>()))
                .Returns(new TestAsyncEnumerator<CategoryList>(categoryLists.GetEnumerator()));

            _mockContext.Setup(m => m.Books).Returns(mockBooksSet.Object);
            _mockContext.Setup(c => c.CategoryLists).Returns(mockCategoryListsSet.Object);
            _mockContext.Setup(m => m.SaveChangesAsync(It.IsAny<CancellationToken>())).ReturnsAsync(1);

            // Act
            var result = await _controller.PutBook(bookId, model);

            // Assert
            var noContentResult = Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task PutBook_Returns_NotFound_If_Book_Not_Exists()
        {
            // Arrange
            var bookId = 1;
            var model = new ModelViewBook { BookId = bookId };

            var mockSet = new Mock<DbSet<Book>>();
            mockSet.Setup(m => m.FindAsync(It.IsAny<int>())).ReturnsAsync((Book)null);
            _mockContext.Setup(c => c.Books).Returns(mockSet.Object);

            // Act
            var result = await _controller.PutBook(bookId, model);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task PutBook_Returns_BadRequest_If_Ids_Do_Not_Match()
        {
            // Arrange
            var bookId = 1;
            var model = new ModelViewBook { BookId = 2 };

            // Act
            var result = await _controller.PutBook(bookId, model);

            // Assert
            Assert.IsType<BadRequestResult>(result);
        }

        [Fact]
        public async Task PostBook_Creates_Book_Successfully()
        {
            // Arrange
            var model = new ModelViewBook
            {
                BookTitle = "New Book",
                BookDescription = "New Description",
                BookPublishDate = DateTime.Now,
                BookPageCount = 150,
                BookAverageRating = 5.0,
                BookRatingCount = 10,
                BookImageLink = "New Image Link",
                BookLanguage = "English",
                PublisherId = 1,
                AuthorId = 1,
                Categories = new List<ModelViewBookCategory>
                {
                    new ModelViewBookCategory { BookCategoId = 1 }
                }
            };

            // Mock the DbSet<CategoryList>
            var categoryLists = new List<CategoryList>
            {
                new CategoryList { BookId = 1, BookCategoId = 1, BookCategory = new BookCategory { BookCategoId = 1, BookCategoName = "Fiction", BookCategoDescription = "Fiction Books" } },
                new CategoryList { BookId = 1, BookCategoId = 2, BookCategory = new BookCategory { BookCategoId = 2, BookCategoName = "Non-Fiction", BookCategoDescription = "Non-Fiction Books" } }
            }.AsQueryable();

            var mockCategoryListsSet = new Mock<DbSet<CategoryList>>();
            mockCategoryListsSet.As<IQueryable<CategoryList>>().Setup(m => m.Provider).Returns(new TestAsyncQueryProvider<CategoryList>(categoryLists.Provider));
            mockCategoryListsSet.As<IQueryable<CategoryList>>().Setup(m => m.Expression).Returns(categoryLists.Expression);
            mockCategoryListsSet.As<IQueryable<CategoryList>>().Setup(m => m.ElementType).Returns(categoryLists.ElementType);
            mockCategoryListsSet.As<IQueryable<CategoryList>>().Setup(m => m.GetEnumerator()).Returns(categoryLists.GetEnumerator());
            mockCategoryListsSet.As<IAsyncEnumerable<CategoryList>>().Setup(m => m.GetAsyncEnumerator(It.IsAny<CancellationToken>()))
                .Returns(new TestAsyncEnumerator<CategoryList>(categoryLists.GetEnumerator()));

            var mockBooksSet = new Mock<DbSet<Book>>();

            // Create an in-memory list to store books
            var booksList = new List<Book>();
            var nextBookId = 1;

            // Set up the mock to simulate adding a book
            mockBooksSet.Setup(m => m.Add(It.IsAny<Book>())).Callback<Book>(book =>
            {
                book.BookId = nextBookId++;
                booksList.Add(book);
            });

            _mockContext.Setup(m => m.Books).Returns(mockBooksSet.Object);
            _mockContext.Setup(m => m.CategoryLists).Returns(mockCategoryListsSet.Object); // Set up the CategoriesList DbSet

            _mockContext.Setup(m => m.SaveChangesAsync(It.IsAny<CancellationToken>())).ReturnsAsync(1);

            // Act
            var result = await _controller.PostBook(model);

            // Assert
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var returnValue = Assert.IsType<ModelViewBook>(createdAtActionResult.Value);
            Assert.Equal(model.BookTitle, returnValue.BookTitle);
            Assert.Equal(model.BookDescription, returnValue.BookDescription);
            Assert.Equal(1, returnValue.BookId);
        }

        [Fact]
        public async Task PostBook_ReturnsNoContent_WhenModelIsNull()
        {
            // Act
            var result = await _controller.PostBook(null);

            // Assert
            var actionResult = Assert.IsType<NoContentResult>(result.Result);
        }

        [Fact]
        public async Task DeleteBook_RemovesBook()
        {
            // Arrange
            var book = new Book { BookId = 1, BookTitle = "Book 1", BookDescription = "Description 1", BookPublishDate = new DateTime(), BookPageCount = 42, BookRatingCount = 0, BookImageLink = "link 1", BookLanguage = "Français", PublisherId = 1, AuthorId = 1 };

            var mockSet = new Mock<DbSet<Book>>();
            mockSet.Setup(m => m.FindAsync(1)).ReturnsAsync(book);
            _mockContext.Setup(c => c.Books).Returns(mockSet.Object);
            _mockContext.Setup(c => c.SaveChangesAsync(default)).ReturnsAsync(1);

            // Act
            var result = await _controller.DeleteBook(1);

            // Assert
            var actionResult = Assert.IsType<NoContentResult>(result);
            _mockContext.Verify(m => m.SaveChangesAsync(default), Times.Once());
        }

        [Fact]
        public async Task DeleteBook_ReturnNotFound_WhenInvalidBook()
        {
            // Arrange
            var mockSet = new Mock<DbSet<Book>>();
            mockSet.Setup(m => m.FindAsync(2)).ReturnsAsync((Book)null);
            _mockContext.Setup(c => c.Books).Returns(mockSet.Object);
            _mockContext.Setup(c => c.SaveChangesAsync(default)).ReturnsAsync(1);

            // Act
            var result = await _controller.DeleteBook(2);

            // Assert
            var actionResult = Assert.IsType<NotFoundResult>(result);
            _mockContext.Verify(m => m.SaveChangesAsync(default), Times.Never());
        }
    }
}

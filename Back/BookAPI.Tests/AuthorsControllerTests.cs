using BookAPI.Models;
using BookAPI.Controllers;
using Moq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookAPI.Tests
{
    public class AuthorsControllerTests
    {
        private readonly Mock<BookDbContext> _mockContext;
        private readonly AuthorsController _controller;

        public AuthorsControllerTests() 
        {
            _mockContext = new Mock<BookDbContext>();
            _controller = new AuthorsController(_mockContext.Object);
        }

        [Fact]
        public async Task GetAuthors_returnListOfAuthors_WhenAuthorExist()
        {
            //Arrange
            var authors = new List<Author>
            {
                new Author { AuthorId = 1, AuthorName = "Author1" },
                new Author { AuthorId = 2, AuthorName = "Author2" },
            }.AsQueryable();

            var mockSet = new Mock<DbSet<Author>>();
            mockSet.As<IAsyncEnumerable<Author>>().Setup(m => m.GetAsyncEnumerator(default)).Returns(new TestAsyncEnumerator<Author>(authors.GetEnumerator()));
            mockSet.As<IQueryable<Author>>().Setup(m => m.Provider).Returns(new TestAsyncQueryProvider<Author>(authors.Provider));
            mockSet.As<IQueryable<Author>>().Setup(m => m.Expression).Returns(authors.AsQueryable().Expression);
            mockSet.As<IQueryable<Author>>().Setup(m => m.ElementType).Returns(authors.AsQueryable().ElementType);
            mockSet.As<IQueryable<Author>>().Setup(m => m.GetEnumerator()).Returns(authors.GetEnumerator());

            _mockContext.Setup(c => c.Authors).Returns(mockSet.Object);

            //Act
            var result = await _controller.GetAuthors();

            //Assert
            var actionResult = Assert.IsType<ActionResult<IEnumerable<ModelViewAuthor>>>(result);
            var returnValue = Assert.IsType<List<ModelViewAuthor>>(actionResult.Value);
            Assert.Equal(2, returnValue.Count);
        }

        [Fact]
        public async Task GetAuthor_returnSigleAuthor_WhenAuthorExist()
        {
            //Arrange
            var author = new Author { AuthorId = 1, AuthorName = "Author" };
            var mockSet = new Mock<DbSet<Author>>();
            mockSet.Setup(m => m.FindAsync(1)).ReturnsAsync(author);
            _mockContext.Setup(c => c.Authors).Returns(mockSet.Object);

            //Act
            var result = await _controller.GetAuthor(1);

            //Assert
            var actionResult = Assert.IsType<ActionResult<ModelViewAuthor>>(result);
            var returnValue = Assert.IsType<ModelViewAuthor>(actionResult.Value);
            Assert.Equal(author.AuthorId, returnValue.AuthorId);
        }

        [Fact]
        public async Task GetAuthor_ReturnsNotFound_WhenAuthorDoesNotExist()
        {
            // Arrange
            var mockDbSet = new Mock<DbSet<Author>>();
            _mockContext.Setup(m => m.Authors).Returns(mockDbSet.Object);

            // Act
            var result = await _controller.GetAuthor(1);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task PutAuthor_UpdateExistingAuthor()
        {
            // Arrange
            var existingAuthor = new Author { AuthorId = 1, AuthorName = "John"};
            var model = new ModelViewAuthor { AuthorId = 1, AuthorName = "john"};

            var mockSet = new Mock<DbSet<Author>>();
            mockSet.As<IQueryable<Author>>().Setup(m => m.Provider).Returns(new TestAsyncQueryProvider<Author>(new List<Author> { existingAuthor }.AsQueryable().Provider));
            mockSet.As<IQueryable<Author>>().Setup(m => m.Expression).Returns(new List<Author> { existingAuthor }.AsQueryable().Expression);
            mockSet.As<IQueryable<Author>>().Setup(m => m.ElementType).Returns(new List<Author> { existingAuthor }.AsQueryable().ElementType);
            mockSet.As<IQueryable<Author>>().Setup(m => m.GetEnumerator()).Returns(() => new List<Author> { existingAuthor }.GetEnumerator());

            _mockContext.Setup(c => c.Authors).Returns(mockSet.Object);
            var controller = new AuthorsController(_mockContext.Object);

            // Act
            var result = await controller.PutAuthor(1, model);

            // Assert
            var actionResult = Assert.IsType<NoContentResult>(result);
            _mockContext.Verify(m => m.SaveChangesAsync(default), Times.Once()); // Verify SaveChangesAsync is called once
        }

        [Fact]
        public async Task PutAuthor_ReturnsBadRequest_WhenNameExists()
        {
            // Arrange
            var existingName = "John";
            var existingAuthorId = 1;
            var existingAuthor = new Author { AuthorId = existingAuthorId, AuthorName = existingName };

            var mockSet = new Mock<DbSet<Author>>();
            mockSet.As<IQueryable<Author>>().Setup(m => m.Provider).Returns(new TestAsyncQueryProvider<Author>(new List<Author> { existingAuthor }.AsQueryable().Provider));
            mockSet.As<IQueryable<Author>>().Setup(m => m.Expression).Returns(new List<Author> { existingAuthor }.AsQueryable().Expression);
            mockSet.As<IQueryable<Author>>().Setup(m => m.ElementType).Returns(new List<Author> { existingAuthor }.AsQueryable().ElementType);
            mockSet.As<IQueryable<Author>>().Setup(m => m.GetEnumerator()).Returns(() => new List<Author> { existingAuthor }.GetEnumerator());

            var mockContext = new Mock<BookDbContext>();
            mockContext.Setup(c => c.Authors).Returns(mockSet.Object);
            var controller = new AuthorsController(mockContext.Object);

            var model = new ModelViewAuthor { AuthorId = 2, AuthorName = "John"};

            // Act
            var result = await controller.PutAuthor(2, model);

            // Assert
            var actionResult = Assert.IsType<BadRequestObjectResult>(result);
            var returnValue = Assert.IsType<string>(actionResult.Value);
            Assert.Contains("Name already exists", returnValue); // Checking for name exists error message
        }

        [Fact]
        public async Task PostAuthor_AddNewAuthor()
        {
            // Arrange
            var existingAuthor = new Author { AuthorId = 1, AuthorName = "John"};

            var mockSet = new Mock<DbSet<Author>>();
            mockSet.As<IQueryable<Author>>().Setup(m => m.Provider).Returns(new TestAsyncQueryProvider<Author>(new List<Author> { existingAuthor }.AsQueryable().Provider));
            mockSet.As<IQueryable<Author>>().Setup(m => m.Expression).Returns(new List<Author> { existingAuthor }.AsQueryable().Expression);
            mockSet.As<IQueryable<Author>>().Setup(m => m.ElementType).Returns(new List<Author> { existingAuthor }.AsQueryable().ElementType);
            mockSet.As<IQueryable<Author>>().Setup(m => m.GetEnumerator()).Returns(() => new List<Author> { existingAuthor }.GetEnumerator());

            var mockContext = new Mock<BookDbContext>();
            mockContext.Setup(c => c.Authors).Returns(mockSet.Object); // Correctly setup Authors DbSet

            var controller = new AuthorsController(mockContext.Object);

            var model = new ModelViewAuthor { AuthorId = 0, AuthorName = "NewAuthor"};

            // Act
            var result = await controller.PostAuthor(model);

            // Assert
            var actionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var returnValue = Assert.IsType<ModelViewAuthor>(actionResult.Value);
        }

        [Fact]
        public async Task PostAuthor_ReturnsBadRequest_WhenNameExists()
        {
            // Arrange
            var existingName = "John";
            var existingAuthorId = 1;
            var existingAuthor = new Author { AuthorId = existingAuthorId, AuthorName = existingName };

            var model = new ModelViewAuthor { AuthorId = 0, AuthorName = "John"};

            var mockSet = new Mock<DbSet<Author>>();
            mockSet.As<IQueryable<Author>>().Setup(m => m.Provider).Returns(new TestAsyncQueryProvider<Author>(new List<Author> { existingAuthor }.AsQueryable().Provider));
            mockSet.As<IQueryable<Author>>().Setup(m => m.Expression).Returns(new List<Author> { existingAuthor }.AsQueryable().Expression);
            mockSet.As<IQueryable<Author>>().Setup(m => m.ElementType).Returns(new List<Author> { existingAuthor }.AsQueryable().ElementType);
            mockSet.As<IQueryable<Author>>().Setup(m => m.GetEnumerator()).Returns(() => new List<Author> { existingAuthor }.GetEnumerator());

            var mockContext = new Mock<BookDbContext>();
            mockContext.Setup(c => c.Authors).Returns(mockSet.Object); // Correctly setup Authors DbSet

            var controller = new AuthorsController(mockContext.Object);

            // Act
            var result = await controller.PostAuthor(model);

            // Assert
            var actionResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            var returnValue = Assert.IsType<string>(actionResult.Value);
            Assert.Contains("Name already exists", returnValue); // Checking for name exists error message
        }
        [Fact]
        public async Task DeleteAuthor_RemovesAuthor()
        {
            // Arrange
            var author = new Author { AuthorId = 1, AuthorName = "John"};

            var mockSet = new Mock<DbSet<Author>>();
            mockSet.Setup(m => m.FindAsync(1)).ReturnsAsync(author);
            _mockContext.Setup(c => c.Authors).Returns(mockSet.Object);
            _mockContext.Setup(c => c.SaveChangesAsync(default)).ReturnsAsync(1);

            // Act
            var result = await _controller.DeleteAuthor(1);

            // Assert
            var actionResult = Assert.IsType<NoContentResult>(result);
            _mockContext.Verify(m => m.SaveChangesAsync(default), Times.Once());
        }

        [Fact]
        public async Task DeleteAuthor_ReturnNotFound_WhenInvalidAuthor()
        {
            // Arrange
            var author = new Author { AuthorId = 1, AuthorName = "John"};

            var mockSet = new Mock<DbSet<Author>>();
            mockSet.Setup(m => m.FindAsync(2)).ReturnsAsync((Author)null); // Setup for invalid author ID
            _mockContext.Setup(c => c.Authors).Returns(mockSet.Object);
            _mockContext.Setup(c => c.SaveChangesAsync(default)).ReturnsAsync(1);

            // Act
            var result = await _controller.DeleteAuthor(2); // Try to delete non-existing author with ID 2

            // Assert
            var actionResult = Assert.IsType<NotFoundResult>(result);
            _mockContext.Verify(m => m.SaveChangesAsync(default), Times.Never()); // Since no author is deleted, SaveChangesAsync should not be called
        }
    }
}

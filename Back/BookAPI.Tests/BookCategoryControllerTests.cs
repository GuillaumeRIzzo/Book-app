using BookAPI.Controllers;
using BookAPI.Data;
using BookAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;

namespace BookAPI.Tests
{
    public class BookCategoryControllerTests
    {
        private readonly Mock<BookDbContext> _mockContext;
        private readonly CategoriesController _controller;

        public BookCategoryControllerTests()
        {
            _mockContext = new Mock<BookDbContext>();
            _controller = new CategoriesController(_mockContext.Object);
        }

        //[Fact]
        //public async Task GetBookCategories_returnListOfBookCategories_WhenBookCategoriesExist()
        //{
        //    //Arrange
        //    var BookCategories = new List<BookCategory>
        //    {
        //        new BookCategory { BookCategoId = 1, BookCategoName = "BookCategory1", BookCategoDescription = "Description1" },
        //        new BookCategory { BookCategoId = 2, BookCategoName = "BookCategory2", BookCategoDescription = "Description2" },
        //    }.AsQueryable();

        //    var mockSet = new Mock<DbSet<BookCategory>>();
        //    mockSet.As<IAsyncEnumerable<BookCategory>>().Setup(m => m.GetAsyncEnumerator(default)).Returns(new TestAsyncEnumerator<BookCategory>(BookCategories.GetEnumerator()));
        //    mockSet.As<IQueryable<BookCategory>>().Setup(m => m.Provider).Returns(new TestAsyncQueryProvider<BookCategory>(BookCategories.Provider));
        //    mockSet.As<IQueryable<BookCategory>>().Setup(m => m.Expression).Returns(BookCategories.AsQueryable().Expression);
        //    mockSet.As<IQueryable<BookCategory>>().Setup(m => m.ElementType).Returns(BookCategories.AsQueryable().ElementType);
        //    mockSet.As<IQueryable<BookCategory>>().Setup(m => m.GetEnumerator()).Returns(BookCategories.GetEnumerator());

        //    _mockContext.Setup(c => c.BookCategories).Returns(mockSet.Object);

        //    //Act
        //    var result = await _controller.GetBookCategories();

        //    //Assert
        //    var actionResult = Assert.IsType<ActionResult<IEnumerable<ModelViewBookCategory>>>(result);
        //    var returnValue = Assert.IsType<List<ModelViewBookCategory>>(actionResult.Value);
        //    Assert.Equal(2, returnValue.Count);
        //}

        //[Fact]
        //public async Task GetBookCategory_returnSigleBookCategory_WhenBookCategoryExist()
        //{
        //    //Arrange
        //    var bookCategory = new BookCategory { BookCategoId = 1, BookCategoName = "BookCategory", BookCategoDescription = "Description" };
        //    var mockSet = new Mock<DbSet<BookCategory>>();
        //    mockSet.Setup(m => m.FindAsync(1)).ReturnsAsync(bookCategory);
        //    _mockContext.Setup(c => c.BookCategories).Returns(mockSet.Object);

        //    //Act
        //    var result = await _controller.GetBookCategory(1);

        //    //Assert
        //    var actionResult = Assert.IsType<ActionResult<ModelViewBookCategory>>(result);
        //    var returnValue = Assert.IsType<ModelViewBookCategory>(actionResult.Value);
        //    Assert.Equal(bookCategory.BookCategoId, returnValue.BookCategoId);
        //}

        //[Fact]
        //public async Task GetBookCategory_ReturnsNotFound_WhenBookCategoryDoesNotExist()
        //{
        //    // Arrange
        //    var mockDbSet = new Mock<DbSet<BookCategory>>();
        //    _mockContext.Setup(m => m.BookCategories).Returns(mockDbSet.Object);

        //    // Act
        //    var result = await _controller.GetBookCategory(1);

        //    // Assert
        //    Assert.IsType<NotFoundResult>(result.Result);
        //}

        //[Fact]
        //public async Task PutBookCategory_UpdateExistingBookCategory()
        //{
        //    // Arrange
        //    var existingBookCategory = new BookCategory { BookCategoId = 1, BookCategoName = "John", BookCategoDescription = "Description1" };
        //    var model = new ModelViewBookCategory { BookCategoId = 1, BookCategoName = "john", BookCategoDescription = "Description2" };

        //    var mockSet = new Mock<DbSet<BookCategory>>();
        //    mockSet.As<IQueryable<BookCategory>>().Setup(m => m.Provider).Returns(new TestAsyncQueryProvider<BookCategory>(new List<BookCategory> { existingBookCategory }.AsQueryable().Provider));
        //    mockSet.As<IQueryable<BookCategory>>().Setup(m => m.Expression).Returns(new List<BookCategory> { existingBookCategory }.AsQueryable().Expression);
        //    mockSet.As<IQueryable<BookCategory>>().Setup(m => m.ElementType).Returns(new List<BookCategory> { existingBookCategory }.AsQueryable().ElementType);
        //    mockSet.As<IQueryable<BookCategory>>().Setup(m => m.GetEnumerator()).Returns(() => new List<BookCategory> { existingBookCategory }.GetEnumerator());

        //    _mockContext.Setup(c => c.BookCategories).Returns(mockSet.Object);
        //    var controller = new BookCategoryController(_mockContext.Object);

        //    // Act
        //    var result = await controller.PutBookCategory(1, model);

        //    // Assert
        //    var actionResult = Assert.IsType<NoContentResult>(result);
        //    _mockContext.Verify(m => m.SaveChangesAsync(default), Times.Once()); // Verify SaveChangesAsync is called once
        //}

        //[Fact]
        //public async Task PutBookCategory_ReturnsBadRequest_WhenNameExists()
        //{
        //    // Arrange
        //    var existingName = "John";
        //    var existingBookCategoId = 1;
        //    var existingBookCategory = new BookCategory { BookCategoId = existingBookCategoId, BookCategoName = existingName, BookCategoDescription = "Description" };

        //    var mockSet = new Mock<DbSet<BookCategory>>();
        //    mockSet.As<IQueryable<BookCategory>>().Setup(m => m.Provider).Returns(new TestAsyncQueryProvider<BookCategory>(new List<BookCategory> { existingBookCategory }.AsQueryable().Provider));
        //    mockSet.As<IQueryable<BookCategory>>().Setup(m => m.Expression).Returns(new List<BookCategory> { existingBookCategory }.AsQueryable().Expression);
        //    mockSet.As<IQueryable<BookCategory>>().Setup(m => m.ElementType).Returns(new List<BookCategory> { existingBookCategory }.AsQueryable().ElementType);
        //    mockSet.As<IQueryable<BookCategory>>().Setup(m => m.GetEnumerator()).Returns(() => new List<BookCategory> { existingBookCategory }.GetEnumerator());

        //    var mockContext = new Mock<BookDbContext>();
        //    mockContext.Setup(c => c.BookCategories).Returns(mockSet.Object);
        //    var controller = new BookCategoryController(mockContext.Object);

        //    var model = new ModelViewBookCategory { BookCategoId = 2, BookCategoName = "John", BookCategoDescription = "Description" };

        //    // Act
        //    var result = await controller.PutBookCategory(2, model);

        //    // Assert
        //    var actionResult = Assert.IsType<BadRequestObjectResult>(result);
        //    var returnValue = Assert.IsType<string>(actionResult.Value);
        //    Assert.Contains("Name already exists", returnValue); // Checking for name exists error message
        //}

        //[Fact]
        //public async Task PostBookCategory_AddNewBookCategory()
        //{
        //    // Arrange
        //    var existingBookCategory = new BookCategory { BookCategoId = 1, BookCategoName = "John", BookCategoDescription = "Description" };

        //    var mockSet = new Mock<DbSet<BookCategory>>();
        //    mockSet.As<IQueryable<BookCategory>>().Setup(m => m.Provider).Returns(new TestAsyncQueryProvider<BookCategory>(new List<BookCategory> { existingBookCategory }.AsQueryable().Provider));
        //    mockSet.As<IQueryable<BookCategory>>().Setup(m => m.Expression).Returns(new List<BookCategory> { existingBookCategory }.AsQueryable().Expression);
        //    mockSet.As<IQueryable<BookCategory>>().Setup(m => m.ElementType).Returns(new List<BookCategory> { existingBookCategory }.AsQueryable().ElementType);
        //    mockSet.As<IQueryable<BookCategory>>().Setup(m => m.GetEnumerator()).Returns(() => new List<BookCategory> { existingBookCategory }.GetEnumerator());

        //    var mockContext = new Mock<BookDbContext>();
        //    mockContext.Setup(c => c.BookCategories).Returns(mockSet.Object); // Correctly setup BookCategories DbSet

        //    var controller = new BookCategoryController(mockContext.Object);

        //    var model = new ModelViewBookCategory { BookCategoId = 0, BookCategoName = "NewBookCategory", BookCategoDescription = "Description" };

        //    // Act
        //    var result = await controller.PostBookCategory(model);

        //    // Assert
        //    var actionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
        //    var returnValue = Assert.IsType<ModelViewBookCategory>(actionResult.Value);
        //}

        //[Fact]
        //public async Task PostBookCategory_ReturnsBadRequest_WhenNameExists()
        //{
        //    // Arrange
        //    var existingName = "John";
        //    var existingBookCategoId = 1;
        //    var existingBookCategory = new BookCategory { BookCategoId = existingBookCategoId, BookCategoName = existingName, BookCategoDescription = "Description" };

        //    var model = new ModelViewBookCategory { BookCategoId = 0, BookCategoName = "John", BookCategoDescription = "Description" };

        //    var mockSet = new Mock<DbSet<BookCategory>>();
        //    mockSet.As<IQueryable<BookCategory>>().Setup(m => m.Provider).Returns(new TestAsyncQueryProvider<BookCategory>(new List<BookCategory> { existingBookCategory }.AsQueryable().Provider));
        //    mockSet.As<IQueryable<BookCategory>>().Setup(m => m.Expression).Returns(new List<BookCategory> { existingBookCategory }.AsQueryable().Expression);
        //    mockSet.As<IQueryable<BookCategory>>().Setup(m => m.ElementType).Returns(new List<BookCategory> { existingBookCategory }.AsQueryable().ElementType);
        //    mockSet.As<IQueryable<BookCategory>>().Setup(m => m.GetEnumerator()).Returns(() => new List<BookCategory> { existingBookCategory }.GetEnumerator());

        //    var mockContext = new Mock<BookDbContext>();
        //    mockContext.Setup(c => c.BookCategories).Returns(mockSet.Object); // Correctly setup BookCategories DbSet

        //    var controller = new BookCategoryController(mockContext.Object);

        //    // Act
        //    var result = await controller.PostBookCategory(model);

        //    // Assert
        //    var actionResult = Assert.IsType<BadRequestObjectResult>(result.Result);
        //    var returnValue = Assert.IsType<string>(actionResult.Value);
        //    Assert.Contains("Name already exists", returnValue); // Checking for name exists error message
        //}
        //[Fact]
        //public async Task DeleteBookCategory_RemovesBookCategory()
        //{
        //    // Arrange
        //    var bookCategory = new BookCategory { BookCategoId = 1, BookCategoName = "John", BookCategoDescription = "Description" };

        //    var mockSet = new Mock<DbSet<BookCategory>>();
        //    mockSet.Setup(m => m.FindAsync(1)).ReturnsAsync(bookCategory);
        //    _mockContext.Setup(c => c.BookCategories).Returns(mockSet.Object);
        //    _mockContext.Setup(c => c.SaveChangesAsync(default)).ReturnsAsync(1);

        //    // Act
        //    var result = await _controller.DeleteBookCategory(1);

        //    // Assert
        //    var actionResult = Assert.IsType<NoContentResult>(result);
        //    _mockContext.Verify(m => m.SaveChangesAsync(default), Times.Once());
        //}

        //[Fact]
        //public async Task DeleteBookCategory_ReturnNotFound_WhenInvalidBookCategory()
        //{
        //    // Arrange
        //    var bookCategory = new BookCategory { BookCategoId = 1, BookCategoName = "John", BookCategoDescription = "Description" };

        //    var mockSet = new Mock<DbSet<BookCategory>>();
        //    mockSet.Setup(m => m.FindAsync(2)).ReturnsAsync((BookCategory)null); // Setup for invalid bookCategory ID
        //    _mockContext.Setup(c => c.BookCategories).Returns(mockSet.Object);
        //    _mockContext.Setup(c => c.SaveChangesAsync(default)).ReturnsAsync(1);

        //    // Act
        //    var result = await _controller.DeleteBookCategory(2); // Try to delete non-existing bookCategory with ID 2

        //    // Assert
        //    var actionResult = Assert.IsType<NotFoundResult>(result);
        //    _mockContext.Verify(m => m.SaveChangesAsync(default), Times.Never()); // Since no bookCategory is deleted, SaveChangesAsync should not be called
        //}
    }
}

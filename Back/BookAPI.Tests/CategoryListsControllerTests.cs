using BookAPI.Controllers;
using BookAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookAPI.Tests
{
    public class CategoryListsControllerTests
    {
        private readonly Mock<BookDbContext> _mockContext;
        private readonly CategoryListsController _controller;

        public CategoryListsControllerTests()
        {
            _mockContext = new Mock<BookDbContext>();
            _controller = new CategoryListsController(_mockContext.Object);
        }

        [Fact]
        public async Task GetCategoryLists_ReturnListOfCategory_WhenCategoryExist()
        {
            // Arrange
            var categoryLists = new List<CategoryList>
            {
                new CategoryList { BookCategoId = 1, BookId = 1 },
                new CategoryList { BookCategoId = 2, BookId = 2 },
            }.AsQueryable();

            var mockSet = new Mock<DbSet<CategoryList>>();
            mockSet.As<IAsyncEnumerable<CategoryList>>()
                .Setup(m => m.GetAsyncEnumerator(default))
                .Returns(new TestAsyncEnumerator<CategoryList>(categoryLists.GetEnumerator()));
            mockSet.As<IQueryable<CategoryList>>()
                .Setup(m => m.Provider)
                .Returns(new TestAsyncQueryProvider<CategoryList>(categoryLists.Provider));
            mockSet.As<IQueryable<CategoryList>>()
                .Setup(m => m.Expression)
                .Returns(categoryLists.Expression);
            mockSet.As<IQueryable<CategoryList>>()
                .Setup(m => m.ElementType)
                .Returns(categoryLists.ElementType);
            mockSet.As<IQueryable<CategoryList>>()
                .Setup(m => m.GetEnumerator())
                .Returns(categoryLists.GetEnumerator());

            _mockContext.Setup(c => c.CategoryLists).Returns(mockSet.Object);

            // Act
            var result = await _controller.GetCategoryLists();

            // Assert
            var actionResult = Assert.IsType<ActionResult<IEnumerable<ModelViewCategoryList>>>(result);
            var returnValue = Assert.IsType<List<ModelViewCategoryList>>(actionResult.Value);
            Assert.Equal(2, returnValue.Count);
        }

        [Fact]
        public async Task GetCategoryList_ReturnsSingleCategoryList_WhenCategoryListExists()
        {
            // Arrange
            var expectedCategoryList = new CategoryList { BookCategoId = 1, BookId = 1 };

            var mockDbSet = new Mock<DbSet<CategoryList>>();
            mockDbSet.Setup(m => m.FindAsync(1)).ReturnsAsync(expectedCategoryList);

            var mockContext = new Mock<BookDbContext>();
            mockContext.Setup(c => c.CategoryLists).Returns(mockDbSet.Object);

            var controller = new CategoryListsController(mockContext.Object);

            // Act
            var result = await controller.GetCategoryList(1);

            // Assert
            var actionResult = Assert.IsType<ActionResult<ModelViewCategoryList>>(result);
            var returnValue = Assert.IsType<ModelViewCategoryList>(actionResult.Value);

            Assert.Equal(expectedCategoryList.BookCategoId, returnValue.BookCategoId);
            Assert.Equal(expectedCategoryList.BookId, returnValue.BookId);
        }

        [Fact]
        public async Task GetCategoryList_ReturnsNotFound_WhenCategoryListDoesNotExist()
        {
            // Arrange
            var mockDbSet = new Mock<DbSet<CategoryList>>();
            mockDbSet.Setup(m => m.FindAsync(1)).ReturnsAsync((CategoryList)null); // Return null when not found

            var mockContext = new Mock<BookDbContext>();
            mockContext.Setup(c => c.CategoryLists).Returns(mockDbSet.Object);

            var controller = new CategoryListsController(mockContext.Object);

            // Act
            var result = await controller.GetCategoryList(1);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task PostCategoryList_AddNewCategoryList()
        {
            // Arrange
            var model = new List<ModelViewCategoryList>
            {
                new ModelViewCategoryList { BookCategoId = 1, BookId = 1 },
                new ModelViewCategoryList { BookCategoId = 2, BookId = 2 },
            };

            var mockSet = new Mock<DbSet<CategoryList>>();
            _mockContext.Setup(c => c.CategoryLists).Returns(mockSet.Object);
            _mockContext.Setup(c => c.SaveChangesAsync(default)).ReturnsAsync(1);

            var controller = new CategoryListsController(_mockContext.Object);

            // Act
            var result = await controller.PostCategorieList(model);

            // Assert
            var actionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            Assert.Equal("GetCategoryList", actionResult.ActionName);
        }

        [Fact]
        public async Task DeleteCategoryList_RemovesCategoryList()
        {
            // Arrange
            var categoryList = new CategoryList { BookCategoId = 1, BookId = 1 };

            var mockSet = new Mock<DbSet<CategoryList>>();
            mockSet.Setup(m => m.FindAsync(1)).ReturnsAsync(categoryList);
            _mockContext.Setup(c => c.CategoryLists).Returns(mockSet.Object);
            _mockContext.Setup(c => c.SaveChangesAsync(default)).ReturnsAsync(1);

            // Act
            var result = await _controller.DeleteCategoryList(1);

            // Assert
            var actionResult = Assert.IsType<NoContentResult>(result);
            _mockContext.Verify(m => m.SaveChangesAsync(default), Times.Once());
        }

        [Fact]
        public async Task DeleteCategoryList_ReturnsNotFound_WhenInvalidCategoryList()
        {
            // Arrange
            var mockSet = new Mock<DbSet<CategoryList>>();
            mockSet.Setup(m => m.FindAsync(2)).ReturnsAsync((CategoryList)null); // Setup for invalid CategoryList ID
            _mockContext.Setup(c => c.CategoryLists).Returns(mockSet.Object);

            // Act
            var result = await _controller.DeleteCategoryList(2); // Try to delete non-existing CategoryList with ID 2

            // Assert
            var actionResult = Assert.IsType<NotFoundResult>(result);
            _mockContext.Verify(m => m.SaveChangesAsync(default), Times.Never()); // Since no CategoryList is deleted, SaveChangesAsync should not be called
        }
    }
}

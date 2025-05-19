using BookAPI.Controllers;
using BookAPI.Data;
using BookAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookAPI.Tests
{
    public class PublishersControllerTests
    {
        private readonly Mock<BookDbContext> _mockContext;
        private readonly PublishersController _controller;

        public PublishersControllerTests()
        {
            _mockContext = new Mock<BookDbContext>();
            _controller = new PublishersController(_mockContext.Object);
        }

        //[Fact]
        //public async Task GetPublishers_returnListOfPublishers_WhenPublisherExist()
        //{
        //    //Arrange
        //    var publishers = new List<Publisher>
        //    {
        //        new Publisher { PublisherId = 1, PublisherName = "Publisher1" },
        //        new Publisher { PublisherId = 2, PublisherName = "Publisher2" },
        //    }.AsQueryable();

        //    var mockSet = new Mock<DbSet<Publisher>>();
        //    mockSet.As<IAsyncEnumerable<Publisher>>().Setup(m => m.GetAsyncEnumerator(default)).Returns(new TestAsyncEnumerator<Publisher>(publishers.GetEnumerator()));
        //    mockSet.As<IQueryable<Publisher>>().Setup(m => m.Provider).Returns(new TestAsyncQueryProvider<Publisher>(publishers.Provider));
        //    mockSet.As<IQueryable<Publisher>>().Setup(m => m.Expression).Returns(publishers.AsQueryable().Expression);
        //    mockSet.As<IQueryable<Publisher>>().Setup(m => m.ElementType).Returns(publishers.AsQueryable().ElementType);
        //    mockSet.As<IQueryable<Publisher>>().Setup(m => m.GetEnumerator()).Returns(publishers.GetEnumerator());

        //    _mockContext.Setup(c => c.Publishers).Returns(mockSet.Object);

        //    //Act
        //    var result = await _controller.GetPublishers();

        //    //Assert
        //    var actionResult = Assert.IsType<ActionResult<IEnumerable<ModelViewPublisher>>>(result);
        //    var returnValue = Assert.IsType<List<ModelViewPublisher>>(actionResult.Value);
        //    Assert.Equal(2, returnValue.Count);
        //}

        //[Fact]
        //public async Task GetPublisher_returnSiglePublisher_WhenPublisherExist()
        //{
        //    //Arrange
        //    var author = new Publisher { PublisherId = 1, PublisherName = "Publisher" };
        //    var mockSet = new Mock<DbSet<Publisher>>();
        //    mockSet.Setup(m => m.FindAsync(1)).ReturnsAsync(author);
        //    _mockContext.Setup(c => c.Publishers).Returns(mockSet.Object);

        //    //Act
        //    var result = await _controller.GetPublisher(1);

        //    //Assert
        //    var actionResult = Assert.IsType<ActionResult<ModelViewPublisher>>(result);
        //    var returnValue = Assert.IsType<ModelViewPublisher>(actionResult.Value);
        //    Assert.Equal(author.PublisherId, returnValue.PublisherId);
        //}

        //[Fact]
        //public async Task GetPublisher_ReturnsNotFound_WhenPublisherDoesNotExist()
        //{
        //    // Arrange
        //    var mockDbSet = new Mock<DbSet<Publisher>>();
        //    _mockContext.Setup(m => m.Publishers).Returns(mockDbSet.Object);

        //    // Act
        //    var result = await _controller.GetPublisher(1);

        //    // Assert
        //    Assert.IsType<NotFoundResult>(result.Result);
        //}

        //[Fact]
        //public async Task PutPublisher_UpdateExistingPublisher()
        //{
        //    // Arrange
        //    var existingPublisher = new Publisher { PublisherId = 1, PublisherName = "John" };
        //    var model = new ModelViewPublisher { PublisherId = 1, PublisherName = "john" };

        //    var mockSet = new Mock<DbSet<Publisher>>();
        //    mockSet.As<IQueryable<Publisher>>().Setup(m => m.Provider).Returns(new TestAsyncQueryProvider<Publisher>(new List<Publisher> { existingPublisher }.AsQueryable().Provider));
        //    mockSet.As<IQueryable<Publisher>>().Setup(m => m.Expression).Returns(new List<Publisher> { existingPublisher }.AsQueryable().Expression);
        //    mockSet.As<IQueryable<Publisher>>().Setup(m => m.ElementType).Returns(new List<Publisher> { existingPublisher }.AsQueryable().ElementType);
        //    mockSet.As<IQueryable<Publisher>>().Setup(m => m.GetEnumerator()).Returns(() => new List<Publisher> { existingPublisher }.GetEnumerator());

        //    _mockContext.Setup(c => c.Publishers).Returns(mockSet.Object);
        //    var controller = new PublishersController(_mockContext.Object);

        //    // Act
        //    var result = await controller.PutPublisher(1, model);

        //    // Assert
        //    var actionResult = Assert.IsType<NoContentResult>(result);
        //    _mockContext.Verify(m => m.SaveChangesAsync(default), Times.Once()); // Verify SaveChangesAsync is called once
        //}

        //[Fact]
        //public async Task PutPublisher_ReturnsBadRequest_WhenNameExists()
        //{
        //    // Arrange
        //    var existingName = "John";
        //    var existingPublisherId = 1;
        //    var existingPublisher = new Publisher { PublisherId = existingPublisherId, PublisherName = existingName };

        //    var mockSet = new Mock<DbSet<Publisher>>();
        //    mockSet.As<IQueryable<Publisher>>().Setup(m => m.Provider).Returns(new TestAsyncQueryProvider<Publisher>(new List<Publisher> { existingPublisher }.AsQueryable().Provider));
        //    mockSet.As<IQueryable<Publisher>>().Setup(m => m.Expression).Returns(new List<Publisher> { existingPublisher }.AsQueryable().Expression);
        //    mockSet.As<IQueryable<Publisher>>().Setup(m => m.ElementType).Returns(new List<Publisher> { existingPublisher }.AsQueryable().ElementType);
        //    mockSet.As<IQueryable<Publisher>>().Setup(m => m.GetEnumerator()).Returns(() => new List<Publisher> { existingPublisher }.GetEnumerator());

        //    var mockContext = new Mock<BookDbContext>();
        //    mockContext.Setup(c => c.Publishers).Returns(mockSet.Object);
        //    var controller = new PublishersController(mockContext.Object);

        //    var model = new ModelViewPublisher { PublisherId = 2, PublisherName = "John" };

        //    // Act
        //    var result = await controller.PutPublisher(2, model);

        //    // Assert
        //    var actionResult = Assert.IsType<BadRequestObjectResult>(result);
        //    var returnValue = Assert.IsType<string>(actionResult.Value);
        //    Assert.Contains("Name already exists", returnValue); // Checking for name exists error message
        //}

        //[Fact]
        //public async Task PostPublisher_AddNewPublisher()
        //{
        //    // Arrange
        //    var existingPublisher = new Publisher { PublisherId = 1, PublisherName = "John" };

        //    var mockSet = new Mock<DbSet<Publisher>>();
        //    mockSet.As<IQueryable<Publisher>>().Setup(m => m.Provider).Returns(new TestAsyncQueryProvider<Publisher>(new List<Publisher> { existingPublisher }.AsQueryable().Provider));
        //    mockSet.As<IQueryable<Publisher>>().Setup(m => m.Expression).Returns(new List<Publisher> { existingPublisher }.AsQueryable().Expression);
        //    mockSet.As<IQueryable<Publisher>>().Setup(m => m.ElementType).Returns(new List<Publisher> { existingPublisher }.AsQueryable().ElementType);
        //    mockSet.As<IQueryable<Publisher>>().Setup(m => m.GetEnumerator()).Returns(() => new List<Publisher> { existingPublisher }.GetEnumerator());

        //    var mockContext = new Mock<BookDbContext>();
        //    mockContext.Setup(c => c.Publishers).Returns(mockSet.Object); // Correctly setup Publishers DbSet

        //    var controller = new PublishersController(mockContext.Object);

        //    var model = new ModelViewPublisher { PublisherId = 0, PublisherName = "NewPublisher" };

        //    // Act
        //    var result = await controller.PostPublisher(model);

        //    // Assert
        //    var actionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
        //    var returnValue = Assert.IsType<ModelViewPublisher>(actionResult.Value);
        //}

        //[Fact]
        //public async Task PostPublisher_ReturnsBadRequest_WhenNameExists()
        //{
        //    // Arrange
        //    var existingName = "John";
        //    var existingPublisherId = 1;
        //    var existingPublisher = new Publisher { PublisherId = existingPublisherId, PublisherName = existingName };

        //    var model = new ModelViewPublisher { PublisherId = 0, PublisherName = "John" };

        //    var mockSet = new Mock<DbSet<Publisher>>();
        //    mockSet.As<IQueryable<Publisher>>().Setup(m => m.Provider).Returns(new TestAsyncQueryProvider<Publisher>(new List<Publisher> { existingPublisher }.AsQueryable().Provider));
        //    mockSet.As<IQueryable<Publisher>>().Setup(m => m.Expression).Returns(new List<Publisher> { existingPublisher }.AsQueryable().Expression);
        //    mockSet.As<IQueryable<Publisher>>().Setup(m => m.ElementType).Returns(new List<Publisher> { existingPublisher }.AsQueryable().ElementType);
        //    mockSet.As<IQueryable<Publisher>>().Setup(m => m.GetEnumerator()).Returns(() => new List<Publisher> { existingPublisher }.GetEnumerator());

        //    var mockContext = new Mock<BookDbContext>();
        //    mockContext.Setup(c => c.Publishers).Returns(mockSet.Object); // Correctly setup Publishers DbSet

        //    var controller = new PublishersController(mockContext.Object);

        //    // Act
        //    var result = await controller.PostPublisher(model);

        //    // Assert
        //    var actionResult = Assert.IsType<BadRequestObjectResult>(result.Result);
        //    var returnValue = Assert.IsType<string>(actionResult.Value);
        //    Assert.Contains("Name already exists", returnValue); // Checking for name exists error message
        //}
        //[Fact]
        //public async Task DeletePublisher_RemovesPublisher()
        //{
        //    // Arrange
        //    var author = new Publisher { PublisherId = 1, PublisherName = "John" };

        //    var mockSet = new Mock<DbSet<Publisher>>();
        //    mockSet.Setup(m => m.FindAsync(1)).ReturnsAsync(author);
        //    _mockContext.Setup(c => c.Publishers).Returns(mockSet.Object);
        //    _mockContext.Setup(c => c.SaveChangesAsync(default)).ReturnsAsync(1);

        //    // Act
        //    var result = await _controller.DeletePublisher(1);

        //    // Assert
        //    var actionResult = Assert.IsType<NoContentResult>(result);
        //    _mockContext.Verify(m => m.SaveChangesAsync(default), Times.Once());
        //}

        //[Fact]
        //public async Task DeletePublisher_ReturnNotFound_WhenInvalidPublisher()
        //{
        //    // Arrange
        //    var author = new Publisher { PublisherId = 1, PublisherName = "John" };

        //    var mockSet = new Mock<DbSet<Publisher>>();
        //    mockSet.Setup(m => m.FindAsync(2)).ReturnsAsync((Publisher)null); // Setup for invalid author ID
        //    _mockContext.Setup(c => c.Publishers).Returns(mockSet.Object);
        //    _mockContext.Setup(c => c.SaveChangesAsync(default)).ReturnsAsync(1);

        //    // Act
        //    var result = await _controller.DeletePublisher(2); // Try to delete non-existing author with ID 2

        //    // Assert
        //    var actionResult = Assert.IsType<NotFoundResult>(result);
        //    _mockContext.Verify(m => m.SaveChangesAsync(default), Times.Never()); // Since no author is deleted, SaveChangesAsync should not be called
        //}
    }
}

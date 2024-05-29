using BookAPI.Models;
using BookAPI.Controllers;
using Moq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookAPI.Tests
{
    public class UsersControllerTests
    {
        private readonly Mock<BookDbContext> _mockContext;
        private readonly UsersController _controller;

        public UsersControllerTests()
        {
            _mockContext = new Mock<BookDbContext>();
            _controller = new UsersController(_mockContext.Object);
        }

        [Fact]
        public async Task GetUsers_ReturnsListOfUsers_WhenUsersExist()
        {
            // Arrange
            var users = new List<User>
            {
                new User { UserId = 1, UserFirstname = "John", UserLastname = "Doe", UserLogin = "john.doe", UserEmail = "john@example.com", UserPassword = "password", UserRight = "User" },
                new User { UserId = 2, UserFirstname = "Jane", UserLastname = "Doe", UserLogin = "jane.doe", UserEmail = "jane@example.com", UserPassword = "password", UserRight = "Admin" }
            }.AsQueryable();

            var mockSet = new Mock<DbSet<User>>();
            mockSet.As<IAsyncEnumerable<User>>().Setup(m => m.GetAsyncEnumerator(default)).Returns(new TestAsyncEnumerator<User>(users.GetEnumerator()));
            mockSet.As<IQueryable<User>>().Setup(m => m.Provider).Returns(new TestAsyncQueryProvider<User>(users.Provider));
            mockSet.As<IQueryable<User>>().Setup(m => m.Expression).Returns(users.AsQueryable().Expression);
            mockSet.As<IQueryable<User>>().Setup(m => m.ElementType).Returns(users.AsQueryable().ElementType);
            mockSet.As<IQueryable<User>>().Setup(m => m.GetEnumerator()).Returns(users.GetEnumerator());

            _mockContext.Setup(c => c.Users).Returns(mockSet.Object);

            // Act
            var result = await _controller.GetUsers();

            // Assert
            var actionResult = Assert.IsType<ActionResult<IEnumerable<ModelViewUser>>>(result);
            var returnValue = Assert.IsType<List<ModelViewUser>>(actionResult.Value);
            Assert.Equal(2, returnValue.Count);
        }

        [Fact]
        public async Task GetUser_ReturnsSingleUser_WhenUserExist()
        {
            // Arrange
            var user = new User { UserId = 1, UserFirstname = "John", UserLastname = "Doe", UserLogin = "john.doe", UserEmail = "john@example.com", UserPassword = "password", UserRight = "User" };
            var mockSet = new Mock<DbSet<User>>();
            mockSet.Setup(m => m.FindAsync(1)).ReturnsAsync(user);
            _mockContext.Setup(c => c.Users).Returns(mockSet.Object);

            // Act
            var result = await _controller.GetUser(1, null);

            // Assert
            var actionResult = Assert.IsType<ActionResult<ModelViewUser>>(result);
            var returnValue = Assert.IsType<ModelViewUser>(actionResult.Value);
            Assert.Equal(user.UserId, returnValue.UserId);
        }

        [Fact]
        public async Task GetUser_ReturnsUser_WhenIdentifierIsProvided()
        {
            // Arrange
            var user = new User { UserId = 1, UserLogin = "test", UserEmail = "test@example.com" };

            var users = new List<User> { user }.AsQueryable();
            var mockSet = new Mock<DbSet<User>>();

            // Setup mock for IQueryable<User>
            mockSet.As<IAsyncEnumerable<User>>()
                   .Setup(m => m.GetAsyncEnumerator(default))
                   .Returns(new TestAsyncEnumerator<User>(users.GetEnumerator()));
            mockSet.As<IQueryable<User>>()
                   .Setup(m => m.Provider)
                   .Returns(new TestAsyncQueryProvider<User>(users.Provider));
            mockSet.As<IQueryable<User>>()
                   .Setup(m => m.Expression)
                   .Returns(users.Expression);
            mockSet.As<IQueryable<User>>()
                   .Setup(m => m.ElementType)
                   .Returns(users.ElementType);
            mockSet.As<IQueryable<User>>()
                   .Setup(m => m.GetEnumerator())
                   .Returns(users.GetEnumerator());

            // Setup FirstOrDefaultAsync to return the user based on the predicate
            _mockContext.Setup(c => c.Users).Returns(mockSet.Object);

            // Act
            var result = await _controller.GetUser(0, "test@example.com");

            // Assert
            var okResult = Assert.IsType<ActionResult<ModelViewUser>>(result);
            var returnValue = Assert.IsType<ModelViewUser>(okResult.Value);
            Assert.Equal("test", returnValue.UserLogin);
        }

        [Fact]
        public async Task GetUser_ReturnsNotFound_WhenUserDoesNotExist()
        {
            // Arrange
            var mockDbSet = new Mock<DbSet<User>>();
            _mockContext.Setup(m => m.Users).Returns(mockDbSet.Object);

            // Act
            var result = await _controller.GetUser(1, null);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task PutUser_UpdateExistingUser()
        {
            // Arrange
            var existingUser = new User { UserId = 1, UserFirstname = "John", UserLastname = "Doe", UserLogin = "john.doe", UserEmail = "john@example.com", UserPassword = "Password1!", UserRight = "User" };
            var model = new ModelViewUser { UserId = 1, UserFirstname = "John", UserLastname = "Doe", UserLogin = "doe.john", UserEmail = "john@test.com", UserPassword = "Password2!", UserRight = "User" };

            var mockSet = new Mock<DbSet<User>>();
            mockSet.As<IQueryable<User>>().Setup(m => m.Provider).Returns(new TestAsyncQueryProvider<User>(new List<User> { existingUser }.AsQueryable().Provider));
            mockSet.As<IQueryable<User>>().Setup(m => m.Expression).Returns(new List<User> { existingUser }.AsQueryable().Expression);
            mockSet.As<IQueryable<User>>().Setup(m => m.ElementType).Returns(new List<User> { existingUser }.AsQueryable().ElementType);
            mockSet.As<IQueryable<User>>().Setup(m => m.GetEnumerator()).Returns(() => new List<User> { existingUser }.GetEnumerator());

            var mockContext = new Mock<BookDbContext>();
            mockContext.Setup(c => c.Users).Returns(mockSet.Object);
            var controller = new UsersController(mockContext.Object);

            // Act
            var result = await controller.PutUser(1, model);

            // Assert
            var actionResult = Assert.IsType<NoContentResult>(result);
            mockContext.Verify(m => m.SaveChangesAsync(default), Times.Once()); // Verify SaveChangesAsync is called once
        }

        [Fact]
        public async Task PutUser_ReturnsBadRequest_WhenValidationFails()
        {
            // Arrange
            var model = new ModelViewUser { UserId = 1, UserLogin = "john.doe@", UserEmail = "invalid-email", UserPassword = "short", UserRight = "User" };

            // Act
            var result = await _controller.PutUser(1, model);

            // Assert
            var actionResult = Assert.IsType<BadRequestObjectResult>(result);
            var returnValue = Assert.IsType<string>(actionResult.Value);
            Assert.Contains("Invalid", returnValue); // Checking for any validation error message
        }

        [Fact]
        public async Task PutUser_ReturnsBadRequest_WhenEmailExists()
        {
            // Arrange
            var existingEmail = "existingemail@example.com";
            var existingUserId = 1;
            var existingUser = new User { UserId = existingUserId, UserEmail = existingEmail };

            var mockSet = new Mock<DbSet<User>>();
            mockSet.As<IQueryable<User>>().Setup(m => m.Provider).Returns(new TestAsyncQueryProvider<User>(new List<User> { existingUser }.AsQueryable().Provider));
            mockSet.As<IQueryable<User>>().Setup(m => m.Expression).Returns(new List<User> { existingUser }.AsQueryable().Expression);
            mockSet.As<IQueryable<User>>().Setup(m => m.ElementType).Returns(new List<User> { existingUser }.AsQueryable().ElementType);
            mockSet.As<IQueryable<User>>().Setup(m => m.GetEnumerator()).Returns(() => new List<User> { existingUser }.GetEnumerator());

            var mockContext = new Mock<BookDbContext>();
            mockContext.Setup(c => c.Users).Returns(mockSet.Object);
            var controller = new UsersController(mockContext.Object);

            var model = new ModelViewUser { UserId = 2, UserFirstname = "John", UserLastname = "Doe", UserLogin = "john.doe", UserEmail = existingEmail, UserPassword = "Newpassword1!", UserRight = "User" };

            // Act
            var result = await controller.PutUser(2, model);

            // Assert
            var actionResult = Assert.IsType<BadRequestObjectResult>(result);
            var returnValue = Assert.IsType<string>(actionResult.Value);
            Assert.Contains("Email already exists", returnValue); // Checking for email exists error message
        }

        [Fact]
        public async Task PutUser_ReturnsBadRequest_WhenLoginExists()
        {
            // Arrange
            var existingLogin = "existinglogin";
            var existingUserId = 1;
            var existingUser = new User { UserId = existingUserId, UserLogin = existingLogin };

            var mockSet = new Mock<DbSet<User>>();
            mockSet.As<IQueryable<User>>().Setup(m => m.Provider).Returns(new TestAsyncQueryProvider<User>(new List<User> { existingUser }.AsQueryable().Provider));
            mockSet.As<IQueryable<User>>().Setup(m => m.Expression).Returns(new List<User> { existingUser }.AsQueryable().Expression);
            mockSet.As<IQueryable<User>>().Setup(m => m.ElementType).Returns(new List<User> { existingUser }.AsQueryable().ElementType);
            mockSet.As<IQueryable<User>>().Setup(m => m.GetEnumerator()).Returns(() => new List<User> { existingUser }.GetEnumerator());

            var mockContext = new Mock<BookDbContext>();
            mockContext.Setup(c => c.Users).Returns(mockSet.Object);
            var controller = new UsersController(mockContext.Object);

            var model = new ModelViewUser { UserId = 2, UserFirstname = "John", UserLastname = "Doe", UserLogin = existingLogin, UserEmail = "john@example.com", UserPassword = "Password1!", UserRight = "User" };

            // Act
            var result = await controller.PutUser(2, model);

            // Assert
            var actionResult = Assert.IsType<BadRequestObjectResult>(result);
            var returnValue = Assert.IsType<string>(actionResult.Value);
            Assert.Contains("Login already exists", returnValue); // Checking for login exists error message
        }

        [Fact]
        public async Task PostUser_AddNewUser()
        {
            // Arrange
            var existingUser = new User { UserId = 1, UserFirstname = "John", UserLastname = "Doe", UserLogin = "john.doe", UserEmail = "existing@example.com", UserPassword = "Password1!", UserRight = "User" };

            var mockSet = new Mock<DbSet<User>>();
            mockSet.As<IQueryable<User>>().Setup(m => m.Provider).Returns(new TestAsyncQueryProvider<User>(new List<User> { existingUser }.AsQueryable().Provider));
            mockSet.As<IQueryable<User>>().Setup(m => m.Expression).Returns(new List<User> { existingUser }.AsQueryable().Expression);
            mockSet.As<IQueryable<User>>().Setup(m => m.ElementType).Returns(new List<User> { existingUser }.AsQueryable().ElementType);
            mockSet.As<IQueryable<User>>().Setup(m => m.GetEnumerator()).Returns(() => new List<User> { existingUser }.GetEnumerator());

            var mockContext = new Mock<BookDbContext>();
            mockContext.Setup(c => c.Users).Returns(mockSet.Object); // Correctly setup Users DbSet

            var controller = new UsersController(mockContext.Object);

            var model = new ModelViewUser { UserId = 0, UserFirstname = "John", UserLastname = "Doe", UserLogin = "johndoe", UserEmail = "john@example.com", UserPassword = "Password1!", UserRight = "User" };

            // Act
            var result = await controller.PostUser(model);

            // Assert
            var actionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var returnValue = Assert.IsType<ModelViewUser>(actionResult.Value);
        }

        [Fact]
        public async Task PostUser_ReturnsBadRequest_WhenValidationFails()
        {
            // Arrange
            var model = new ModelViewUser { UserId = 0, UserLogin = "john.doe@", UserEmail = "invalid-email", UserPassword = "short", UserRight = "User" };

            // Act
            var result = await _controller.PostUser(model);

            // Assert
            var actionResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            var returnValue = Assert.IsType<string>(actionResult.Value);
            Assert.Contains("Invalid", returnValue); // Checking for any validation error message

        }

        [Fact]
        public async Task PostUser_ReturnsBadRequest_WhenEmailExists()
        {
            // Arrange
            var existingEmail = "existingemail@example.com";
            var existingUserId = 1;
            var existingUser = new User { UserId = existingUserId, UserEmail = existingEmail };

            var model = new ModelViewUser { UserId = 0, UserFirstname = "John", UserLastname = "Doe", UserLogin = "john.doe", UserEmail = existingEmail, UserPassword = "Password1!", UserRight = "User" };

            var mockSet = new Mock<DbSet<User>>();
            mockSet.As<IQueryable<User>>().Setup(m => m.Provider).Returns(new TestAsyncQueryProvider<User>(new List<User> { existingUser }.AsQueryable().Provider));
            mockSet.As<IQueryable<User>>().Setup(m => m.Expression).Returns(new List<User> { existingUser }.AsQueryable().Expression);
            mockSet.As<IQueryable<User>>().Setup(m => m.ElementType).Returns(new List<User> { existingUser }.AsQueryable().ElementType);
            mockSet.As<IQueryable<User>>().Setup(m => m.GetEnumerator()).Returns(() => new List<User> { existingUser }.GetEnumerator());

            var mockContext = new Mock<BookDbContext>();
            mockContext.Setup(c => c.Users).Returns(mockSet.Object);
            var controller = new UsersController(mockContext.Object);

            // Act
            var result = await controller.PostUser(model);

            // Assert
            var actionResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            var returnValue = Assert.IsType<string>(actionResult.Value);
            Assert.Contains("Email already exists", returnValue); // Checking for email exists error message
        }

        [Fact]
        public async Task PostUser_ReturnsBadRequest_WhenLoginExists()
        {
            // Arrange
            var existingLogin = "existinglogin";
            var existingUser = new User { UserId = 1, UserLogin = existingLogin };

            var mockSet = new Mock<DbSet<User>>();
            mockSet.As<IQueryable<User>>().Setup(m => m.Provider).Returns(new TestAsyncQueryProvider<User>(new List<User> { existingUser }.AsQueryable().Provider));
            mockSet.As<IQueryable<User>>().Setup(m => m.Expression).Returns(new List<User> { existingUser }.AsQueryable().Expression);
            mockSet.As<IQueryable<User>>().Setup(m => m.ElementType).Returns(new List<User> { existingUser }.AsQueryable().ElementType);
            mockSet.As<IQueryable<User>>().Setup(m => m.GetEnumerator()).Returns(() => new List<User> { existingUser }.GetEnumerator());

            var mockContext = new Mock<BookDbContext>();
            mockContext.Setup(c => c.Users).Returns(mockSet.Object);
            var controller = new UsersController(mockContext.Object);

            var model = new ModelViewUser { UserId = 0, UserFirstname = "John", UserLastname = "Doe", UserLogin = existingLogin, UserEmail = "john@example.com", UserPassword = "Password1!", UserRight = "User" };

            // Act
            var result = await controller.PostUser(model);

            // Assert
            var actionResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            var returnValue = Assert.IsType<string>(actionResult.Value);
            Assert.Contains("Login already exists", returnValue); // Checking for login exists error message
        }

        [Fact]
        public async Task DeleteUser_RemovesUser()
        {
            // Arrange
            var user = new User { UserId = 1, UserFirstname = "John", UserLastname = "Doe", UserLogin = "john.doe", UserEmail = "john@example.com", UserPassword = "password", UserRight = "User" };

            var mockSet = new Mock<DbSet<User>>();
            mockSet.Setup(m => m.FindAsync(1)).ReturnsAsync(user);
            _mockContext.Setup(c => c.Users).Returns(mockSet.Object);
            _mockContext.Setup(c => c.SaveChangesAsync(default)).ReturnsAsync(1);

            // Act
            var result = await _controller.DeleteUser(1);

            // Assert
            var actionResult = Assert.IsType<NoContentResult>(result);
            _mockContext.Verify(m => m.SaveChangesAsync(default), Times.Once());
        }

        [Fact]
        public async Task DeleteUser_ReturnNotFound_WhenInvalidUser()
        {
            // Arrange
            var user = new User { UserId = 1, UserFirstname = "John", UserLastname = "Doe", UserLogin = "john.doe", UserEmail = "john@example.com", UserPassword = "password", UserRight = "User" };

            var mockSet = new Mock<DbSet<User>>();
            mockSet.Setup(m => m.FindAsync(2)).ReturnsAsync((User)null); // Setup for invalid user ID
            _mockContext.Setup(c => c.Users).Returns(mockSet.Object);
            _mockContext.Setup(c => c.SaveChangesAsync(default)).ReturnsAsync(1);

            // Act
            var result = await _controller.DeleteUser(2); // Try to delete non-existing user with ID 2

            // Assert
            var actionResult = Assert.IsType<NotFoundResult>(result);
            _mockContext.Verify(m => m.SaveChangesAsync(default), Times.Never()); // Since no user is deleted, SaveChangesAsync should not be called
        }
    }
}

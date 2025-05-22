using Moq;
using Microsoft.Extensions.Configuration;
using BookAPI.Controllers;
using BookAPI.Data;
using BookAPI.Models;
using Microsoft.AspNetCore.Mvc;
using BookAPI.Identity;

namespace BookAPI.Tests
{
    public class IdentityControllerTests
    {
        private IdentityController _controller;
        private readonly Mock<IConfiguration> _mockConfiguration;
        private readonly Mock<BookDbContext> _mockContext;
        private readonly UsersController _userController;

        public IdentityControllerTests()
        {
            _mockConfiguration = new Mock<IConfiguration>();
            _mockConfiguration.SetupGet(x => x["Jwt:SecurityKey"]).Returns("ApiOfBooksKeyOfOurLordSauronGiveToUsToBeSecure");
            _mockConfiguration.SetupGet(x => x["Jwt:Issuer"]).Returns("localhost");
            _mockConfiguration.SetupGet(x => x["Jwt:Audience"]).Returns("localhost");

            _mockContext = new Mock<BookDbContext>();
            _userController = new UsersController(_mockContext.Object);
            _controller = new IdentityController(_mockConfiguration.Object, _mockContext.Object, _userController);
        }

        //[Fact]
        //public void GenerateToken_ShouldReturnToken()
        //{
        //    // Arrange
        //    var model = new ModelViewUser
        //    {
        //        UserId = 1,
        //        UserFirstname = "John",
        //        UserLastname = "Doe",
        //        UserPassword = "string",
        //        UserLogin = "johndoe",
        //        UserEmail = "test@example.com",
        //        UserRight = "User"
        //    };

        //    // Act
        //    var token = _controller.GenerateToken(model);

        //    // Assert
        //    Assert.NotNull(token);
        //    Assert.IsType<string>(token);
        //}

        //[Fact]
        //public async Task Login_ShouldReturnOk_WhenCredentialsAreValid()
        //{
        //    // Arrange
        //    var user = new ModelViewUser
        //    {
        //        UserId = 1,
        //        UserEmail = "test@example.com",
        //        UserFirstname = "John",
        //        UserLastname = "Doe",
        //        UserLogin = "johndoe",
        //        UserPassword = BCrypt.Net.BCrypt.HashPassword("password"),
        //        UserRight = "User"
        //    };

        //    var usersControllerMock = new Mock<UsersController>(_mockContext.Object);
        //    usersControllerMock.Setup(x => x.GetUser(It.IsAny<int>(), It.IsAny<string>())).ReturnsAsync(new ActionResult<ModelViewUser>(user));

        //    _controller = new IdentityController(_mockConfiguration.Object, _mockContext.Object, usersControllerMock.Object);

        //    var loginModel = new LoginViewModel
        //    {
        //        Identifier = "test@example.com",
        //        Password = "password"
        //    };

        //    // Act
        //    var result = await _controller.Login(loginModel);

        //    // Assert
        //    var okResult = Assert.IsType<OkObjectResult>(result.Result);
        //    var returnValue = Assert.IsType<LoginResponseDto>(okResult.Value);

        //    Assert.NotNull(returnValue);
        //    Assert.Equal(1, returnValue.id);
        //    Assert.Equal("johndoe", returnValue.login);
        //    Assert.Equal("User", returnValue.right);
        //}

        //[Fact]
        //public async Task Login_ShouldReturnNotFound_WhenCredentialsAreInvalid()
        //{
        //    // Arrange
        //    var user = new ModelViewUser
        //    {
        //        UserId = 1,
        //        UserEmail = "test@example.com",
        //        UserFirstname = "John",
        //        UserLastname = "Doe",
        //        UserLogin = "johndoe",
        //        UserPassword = BCrypt.Net.BCrypt.HashPassword("password"),
        //        UserRight = "User"
        //    };

        //    var usersControllerMock = new Mock<UsersController>(_mockContext.Object);
        //    usersControllerMock.Setup(x => x.GetUser(It.IsAny<int>(), It.IsAny<string>())).ReturnsAsync(new ActionResult<ModelViewUser>(user));

        //    _controller = new IdentityController(_mockConfiguration.Object, _mockContext.Object, usersControllerMock.Object);

        //    var loginModel = new LoginViewModel
        //    {
        //        Identifier = "test@example.com",
        //        Password = "wrongpassword"
        //    };

        //    // Act
        //    var result = await _controller.Login(loginModel);

        //    // Assert
        //    Assert.IsType<NotFoundResult>(result.Result);
        //}
    }
}

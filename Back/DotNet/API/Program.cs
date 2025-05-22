using BookAPI.Controllers;
using BookAPI.Identity;
using BookAPI.Data;
using BookAPI.Swagger;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Load .env in local development only
if (builder.Environment.IsDevelopment())
{
    var envPath = Path.Combine(AppContext.BaseDirectory, "../../../../../../.env");
    if (File.Exists(envPath))
    {
        DotNetEnv.Env.Load(envPath);
        Console.WriteLine("Loaded .env file.");
    }
}

// Tell .NET to read environment variables
builder.Configuration.AddEnvironmentVariables();

// Now access all config using builder.Configuration
var connectionString = builder.Configuration["ConnectionStrings:DevConnection"];
var jwtKey = builder.Configuration["Jwt:SecurityKey"];
var jwtIssuer = builder.Configuration["Jwt:Issuer"];
var jwtAudience = builder.Configuration["Jwt:Audience"];

if (string.IsNullOrWhiteSpace(connectionString)) throw new Exception("Missing connection string.");
if (string.IsNullOrWhiteSpace(jwtKey)) throw new Exception("Missing JWT key.");

var encryptionKey = Environment.GetEnvironmentVariable("ENCRYPT_KEY");

builder.Services.AddDbContext<BookDbContext>(options =>
{
    options.UseSqlServer(connectionString);
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddTransient<IConfigureOptions<SwaggerGenOptions>, ConfigureSwaggerOptions>();
builder.Services.AddSingleton<IAuthorizationHandler, RequiresCustomClaimAttributeHandler>();

builder.Services.AddTransient<UsersController>();
builder.Services.AddTransient<CategoryListsController>();

builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(x =>
{
    x.TokenValidationParameters = new TokenValidationParameters
    {
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true
    };
});

builder.Services.AddAuthorization(options =>
{
    // Policy requiring any of the specified claims
    options.AddPolicy(IdentityData.UserPolicyName, p =>
        p.RequireClaim(IdentityData.UserPolicyName, IdentityData.AdminUserClaimName, IdentityData.SuperAdminUserClaimName));

    // Policy requiring both specified claims
    options.AddPolicy("RequiresCustomClaimAttribute", p =>
        p.RequireClaim(IdentityData.UserPolicyName, IdentityData.AdminUserClaimName, IdentityData.SuperAdminUserClaimName));
});


builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
       policy =>
       {
           policy.WithOrigins("https://localhost")
           .AllowAnyHeader()
           .AllowAnyMethod()
           .AllowAnyOrigin();
       });
});

builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

using BookAPI.Controllers;
using BookAPI.Identity;
using BookAPI.Models;
using BookAPI.Swagger;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
var config = builder.Configuration;

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
        ValidIssuer = config["Jwt:Issuer"],
        ValidAudience = config["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:SecurityKey"]!)),
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

builder.Services.AddDbContext<BookDbContext>(options => options.UseSqlServer(config.GetConnectionString("DevConnection")));
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

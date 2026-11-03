
using Scalar.AspNetCore;
using CloudDoc.Api.Services;
using CloudDoc.Api.Services.Interfaces;
using CloudDoc.Api.Repositories;
using CloudDoc.Api.Repositories.Interfaces;
using CloudDoc.Api.Storage;
using CloudDoc.Api.Storage.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Services
builder.Services.AddSingleton<IDocumentService, DocumentService>();
builder.Services.AddSingleton<IDocumentRepository, InMemoryDocumentRepository>();
builder.Services.AddSingleton<IFileStorage, LocalFileStorage>();
builder.Services.AddControllers();
builder.Services.AddOpenApi();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// OpenAPI documentation
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

// Middleware pipeline
app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

app.Run();

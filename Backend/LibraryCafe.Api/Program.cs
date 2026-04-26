using LibraryCafe.Data;
using Microsoft.EntityFrameworkCore;
using LibraryCafe.Api.Services;
var builder = WebApplication.CreateBuilder(args);


builder.Services.AddSingleton<PendingVerificationStore>();
builder.Services.AddScoped<EmailService>();
builder.Services.AddControllers();
builder.Services.AddHostedService<DueDateReminderService>();
builder.Services.AddHttpClient();

builder.Services.AddDbContext<LibraryCafeDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins(
                "http://127.0.0.1:5500",
                "http://localhost:5500",
                "http://localhost:3000",
                "null"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});


builder.WebHost.ConfigureKestrel(o => {
    o.Limits.MaxRequestBodySize = 52428800; // 50 MB
});
builder.Services.Configure<Microsoft.AspNetCore.Http.Features.FormOptions>(o => {
    o.MultipartBodyLengthLimit = 52428800; 
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();
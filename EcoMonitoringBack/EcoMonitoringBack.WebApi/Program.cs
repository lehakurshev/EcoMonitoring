using System.Reflection;
using EcoMonitoringBack;
using EcoMonitoringBack.Dto;
using EcoMonitoringBack.Interfaces;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using MongoDB.Driver.Core;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddHttpClient(); 
//builder.Services.AddCustomClients();

builder.Services.Configure<MongoDbSettings>(
    builder.Configuration.GetSection("MongoDbSettings"));

// MongoDB
builder.Services.AddSingleton<IMongoClient>(serviceProvider =>
{
    var settings = serviceProvider.GetRequiredService<IOptions<MongoDbSettings>>().Value;
    return new MongoClient(settings.ConnectionString);
});

builder.Services.AddScoped(serviceProvider =>
{
    var settings = serviceProvider.GetRequiredService<IOptions<MongoDbSettings>>().Value;
    var client = serviceProvider.GetRequiredService<IMongoClient>();
    return client.GetDatabase(settings.DatabaseName);
});
//DbInitializer.Initialize(connectionString);
//builder.Services.AddDb(connectionString);

//builder.Services.AddApplication();
//builder.Services.AddWebServices();
builder.Services.AddInjection();
builder.Services.AddControllers();


builder.Services.AddHttpContextAccessor();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();



var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseRouting();
app.UseHttpsRedirection();
app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    
    try
    {
        var context = services.GetRequiredService<IRepositoryContainers>();
        
        // Проверяем, пустая ли БД
        if (!await context.IsHaveDbContainersAsync())
        {
            var migrationService = services.GetRequiredService<IServiceMigrationContainer>();
            var filePath = "file.xlsx";
            
            if (File.Exists(filePath))
            {
                using var stream = File.OpenRead(filePath);
                var file = new FormFile(stream, 0, stream.Length, null, Path.GetFileName(filePath))
                {
                    Headers = new HeaderDictionary(),
                    ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                };
                
                await migrationService.StartMigrationAsync(file);
                Console.WriteLine("ееееееееееееееее боиии");
            }
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine("Всо сломалось");
        throw;
    }
}

app.Run();

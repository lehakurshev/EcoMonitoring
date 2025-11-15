using Domain.Contracts;
using Infrastructure.Contracts;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;

namespace Web;


public static class SetupApplication
{
    public static async void MakeContainersMigration(
        this WebApplication app)
    {
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
                    var filePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "file.xlsx");
            
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
    }
}
using EcoMonitoringBack.Interfaces;

namespace EcoMonitoringBack;


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
                
                var greenZonesRepo = services.GetRequiredService<IRepositoryGreenZones>();
                if (await greenZonesRepo.CountAsync() == 0)
                {
                    Console.WriteLine("Запуск миграции зеленых зон...");
                    var migrationService = services.GetRequiredService<IServiceMigrationContainer>();
                    await migrationService.MigrateGreenZonesAsync();
                    Console.WriteLine($"Миграция зеленых зон завершена. Загружено зон: {await greenZonesRepo.CountAsync()}");
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
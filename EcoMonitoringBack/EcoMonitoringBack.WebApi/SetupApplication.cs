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
        
                var hasContainers = await context.IsHaveDbContainersAsync();
                
                if (hasContainers)
                {
                    var containers = await context.GetAllContainersAsync();
                    var firstContainer = containers.FirstOrDefault();
                    
                    if (firstContainer != null && 
                        (Math.Abs(firstContainer.Location.Coordinates.Y) > 1000 || 
                         Math.Abs(firstContainer.Location.Coordinates.X) > 1000))
                    {
                        await context.DeleteAllContainersAsync();
                        hasContainers = false;
                    }
                }
                
                if (!hasContainers)
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
                    }
                }
                
                var greenZonesRepo = services.GetRequiredService<IRepositoryGreenZones>();
                if (await greenZonesRepo.CountAsync() == 0)
                {
                    var migrationService = services.GetRequiredService<IServiceMigrationContainer>();
                    await migrationService.MigrateGreenZonesAsync();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}
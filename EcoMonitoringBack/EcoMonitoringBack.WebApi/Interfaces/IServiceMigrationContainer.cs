

namespace EcoMonitoringBack.Interfaces;

public interface IServiceMigrationContainer
{
    Task StartMigrationAsync(IFormFile file);

}
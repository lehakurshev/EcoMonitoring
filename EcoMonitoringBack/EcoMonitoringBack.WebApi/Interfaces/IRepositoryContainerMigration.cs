using EcoMonitoringBack.Models.Container;

namespace EcoMonitoringBack.Interfaces;

public interface IRepositoryContainerMigration
{
    Task MakeMigrationAsync(List<ContainerInfo> statusMigration);
}
using DomainModels;

namespace Infrastructure.Contracts;

public interface IRepositoryContainerMigration
{
    Task MakeMigrationAsync(List<ContainerInfo> statusMigration);
}
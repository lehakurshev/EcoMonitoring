using EcoMonitoringBack.Interfaces;
using EcoMonitoringBack.Models.Container;
using MongoDB.Driver;

namespace EcoMonitoringBack.Repositories;

public class RepositoryContainerMigration(IMongoDatabase database) : IRepositoryContainerMigration
{
    public async Task MakeMigrationAsync(List<ContainerInfo> statusMigration)
    {
        var containers = database.GetCollection<ContainerInfo>("containers"); 
        
        await containers.InsertManyAsync(statusMigration);
    }
}
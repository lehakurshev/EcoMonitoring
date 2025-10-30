using EcoMonitoringBack.Interfaces;
using EcoMonitoringBack.Models.Container;
using MongoDB.Driver;

namespace EcoMonitoringBack.Repositories;

public class RepositoryContainerMigration : IRepositoryContainerMigration
{
    private readonly IMongoClient _client;
    private readonly IMongoDatabase _database;

    public RepositoryContainerMigration(IMongoClient client, IMongoDatabase database)
    {
        _database = database;
        _client = client;
    }

    public async Task MakeMigrationAsync(List<ContainerInfo> statusMigration)
    {
        var containers = _database.GetCollection<ContainerInfo>("containers"); 
    
        try
        {
            await containers.InsertManyAsync(statusMigration);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Что-то пошло не так: {ex.Message}");
            throw;
        }
    }
}
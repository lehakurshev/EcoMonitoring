using EcoMonitoringBack.Interfaces;
using EcoMonitoringBack.Models.Container;
using MongoDB.Driver;

namespace EcoMonitoringBack.Repositories;

public class RepositoryContainers : IRepositoryContainers
{
    private readonly IMongoClient _client;
    private readonly IMongoDatabase _database;

    public RepositoryContainers(IMongoClient client, IMongoDatabase database)
    {
        _database = database;
        _client = client;
    }
    
    public async Task<List<ContainerInfo>> GetAllContainersAsync()
    {
        var containers = _database.GetCollection<ContainerInfo>("containers");
        var foundContainers = await containers.FindAsync(_ => true);
        return await foundContainers.ToListAsync();
    }
    
    
}
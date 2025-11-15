using DomainModels;
using Infrastructure.Contracts;
using MongoDB.Driver;

namespace Infrastructure;

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
        var containers = _database.GetCollection<DbContainerInfo>("containers"); 
    
        try
        {
            var toInsert = statusMigration?
                .Select(x => x.ToDb())
                .ToList();
            await containers.InsertManyAsync(toInsert);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Что-то пошло не так: {ex.Message}");
            throw;
        }
    }
}
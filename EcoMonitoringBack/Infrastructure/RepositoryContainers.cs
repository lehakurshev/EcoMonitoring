using DomainModels;
using Infrastructure.Contracts;
using MongoDB.Driver;
using MongoDB.Driver.GeoJsonObjectModel;

namespace Infrastructure;

public class RepositoryContainers : IRepositoryContainers
{
    private readonly IMongoClient _client;
    private readonly IMongoDatabase _database;
    private readonly IMongoCollection<DbContainerInfo> _containers;

    public RepositoryContainers(IMongoClient client, IMongoDatabase database)
    {
        _database = database;
        _client = client;
        _containers = _database.GetCollection<DbContainerInfo>("containers");
    }
    
    public async Task<bool> IsHaveDbContainersAsync()
    {
        var filter = Builders<DbContainerInfo>.Filter.Empty;
        var count = await _containers.CountDocumentsAsync(filter, new CountOptions
        {
            Limit = 1 // Останавливаем подсчет после первого найденного
        });
        return count > 0;
    }
    
    public async Task<List<ContainerInfo>> GetAllContainersAsync()
    {
        var options = new FindOptions<DbContainerInfo>
        {
            BatchSize = 1000  
        };
        var foundContainers = await _containers.FindAsync(_ => true, options);
        return (await foundContainers.ToListAsync())?
            .Select(c => c.ToDomain())
            .ToList();
    }
    
    public async Task<ContainerInfo> CreateContainerAsync(ContainerCreationInfo container)
    {
        var dbContainer = container.ToDb();
        await _containers.InsertOneAsync(dbContainer);
        return dbContainer.ToDomain();
    }
    
    public async Task<bool> UpdateContainerAsync(string id, ContainerInfo container)
    {
        container.Id = id;
        var dbContainer = container.ToDb();
        
        var filter = Builders<DbContainerInfo>.Filter.Eq(c => c.Id, id);
        var result = await _containers.ReplaceOneAsync(filter, dbContainer);
        
        return result.IsAcknowledged && result.ModifiedCount > 0;
    }
    
    public async Task<bool> DeleteContainerAsync(string id)
    {
        var filter = Builders<DbContainerInfo>.Filter.Eq(c => c.Id, id);
        var result = await _containers.DeleteOneAsync(filter);
        
        return result.IsAcknowledged && result.DeletedCount > 0;
    }
    
    public async Task<bool> ContainerExistsAsync(string id)
    {
        var filter = Builders<DbContainerInfo>.Filter.Eq(c => c.Id, id);
        return await _containers.Find(filter).AnyAsync();
    }
    
    public async Task<List<ContainerInfo>> GetContainersInAreaAsync(Point topLeft, Point bottomRight)
    {
        
        var polygonCoordinates = new[]
        {
            new[] { topLeft.Longitude, topLeft.Latitude },
            new[] { bottomRight.Longitude, topLeft.Latitude },
            new[] { bottomRight.Longitude, bottomRight.Latitude },
            new[] { topLeft.Longitude, bottomRight.Latitude },
            new[] { topLeft.Longitude, topLeft.Latitude } 
        };

        var polygon = new GeoJsonPolygon<GeoJson2DCoordinates>(
            new GeoJsonPolygonCoordinates<GeoJson2DCoordinates>(
                new GeoJsonLinearRingCoordinates<GeoJson2DCoordinates>(
                    polygonCoordinates.Select(coord => new GeoJson2DCoordinates(coord[0], coord[1]))
                )
            )
        );

        var filter = Builders<DbContainerInfo>.Filter.GeoWithin(c => c.Location, polygon);
        var foundContainers = await _containers.FindAsync(filter);
        return (await foundContainers.ToListAsync())?
            .Select(c => c.ToDomain())
            .ToList();
    }
}
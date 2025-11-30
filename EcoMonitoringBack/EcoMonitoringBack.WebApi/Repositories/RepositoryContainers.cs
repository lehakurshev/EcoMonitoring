using EcoMonitoringBack.Interfaces;
using EcoMonitoringBack.Models.Common;
using EcoMonitoringBack.Models.Container;
using MongoDB.Driver;
using MongoDB.Driver.GeoJsonObjectModel;

namespace EcoMonitoringBack.Repositories;

public class RepositoryContainers : IRepositoryContainers
{
    private readonly IMongoClient _client;
    private readonly IMongoDatabase _database;
    private readonly IMongoCollection<ContainerInfo> _containers;

    public RepositoryContainers(IMongoClient client, IMongoDatabase database)
    {
        _database = database;
        _client = client;
        _containers = _database.GetCollection<ContainerInfo>("containers");
    }
    
    public async Task<bool> IsHaveDbContainersAsync()
    {
        var filter = Builders<ContainerInfo>.Filter.Empty;
        var count = await _containers.CountDocumentsAsync(filter, new CountOptions
        {
            Limit = 1
        });
        return count > 0;
    }
    
    public async Task DeleteAllContainersAsync()
    {
        await _containers.DeleteManyAsync(Builders<ContainerInfo>.Filter.Empty);
    }
    
    public async Task<List<ContainerInfo>> GetAllContainersAsync()
    {
        var options = new FindOptions<ContainerInfo>
        {
            BatchSize = 1000  
        };
        var foundContainers = await _containers.FindAsync(_ => true, options);
        return await foundContainers.ToListAsync();
    }
    
    public async Task<ContainerInfo> CreateContainerAsync(ContainerInfo container)
    {
        await _containers.InsertOneAsync(container);
        return container;
    }
    
    public async Task<bool> UpdateContainerAsync(string id, ContainerInfo container)
    {
        container.Id = id; 
        
        var filter = Builders<ContainerInfo>.Filter.Eq(c => c.Id, id);
        var result = await _containers.ReplaceOneAsync(filter, container);
        
        return result.IsAcknowledged && result.ModifiedCount > 0;
    }
    
    public async Task<bool> DeleteContainerAsync(string id)
    {
        var filter = Builders<ContainerInfo>.Filter.Eq(c => c.Id, id);
        var result = await _containers.DeleteOneAsync(filter);
        
        return result.IsAcknowledged && result.DeletedCount > 0;
    }
    
    public async Task<bool> ContainerExistsAsync(string id)
    {
        var filter = Builders<ContainerInfo>.Filter.Eq(c => c.Id, id);
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

        var filter = Builders<ContainerInfo>.Filter.GeoWithin(c => c.Location, polygon);
        var foundContainers = await _containers.FindAsync(filter);
        return await foundContainers.ToListAsync();
    }
    
    
}
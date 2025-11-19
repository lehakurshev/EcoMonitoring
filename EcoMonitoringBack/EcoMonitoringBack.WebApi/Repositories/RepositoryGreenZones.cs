using EcoMonitoringBack.Interfaces;
using EcoMonitoringBack.Models.GreenZones;
using MongoDB.Driver;

namespace EcoMonitoringBack.Repositories;

public class RepositoryGreenZones : IRepositoryGreenZones
{
    private readonly IMongoCollection<GreenZoneMongo> _greenZones;

    public RepositoryGreenZones(IMongoClient client, IMongoDatabase database)
    {
        _greenZones = database.GetCollection<GreenZoneMongo>("greenZones");
    }

    public async Task<List<GreenZoneMongo>> GetByAreaAsync(double minLat, double maxLat, double minLon, double maxLon)
    {
        var filter = Builders<GreenZoneMongo>.Filter.And(
            Builders<GreenZoneMongo>.Filter.ElemMatch(
                gz => gz.Coordinates,
                coord => coord.Latitude >= minLat && coord.Latitude <= maxLat &&
                         coord.Longitude >= minLon && coord.Longitude <= maxLon
            )
        );

        return await _greenZones.Find(filter).ToListAsync();
    }

    public async Task CreateManyAsync(List<GreenZoneMongo> greenZones)
    {
        if (greenZones.Count > 0)
        {
            await _greenZones.InsertManyAsync(greenZones);
        }
    }

    public async Task<long> CountAsync()
    {
        return await _greenZones.CountDocumentsAsync(FilterDefinition<GreenZoneMongo>.Empty);
    }
}

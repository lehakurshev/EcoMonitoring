using EcoMonitoringBack.Interfaces;
using EcoMonitoringBack.Models.AirQuality;
using MongoDB.Driver;

namespace EcoMonitoringBack.Repositories;

public class RepositoryAirQuality(IMongoDatabase database) : IRepositoryAirQuality
{
    private readonly IMongoCollection<AirQualityData> _airQuality = 
        database.GetCollection<AirQualityData>("airquality");

    public async Task<List<AirQualityData>> GetAllAirQualityDataAsync()
    {
        var options = new FindOptions<AirQualityData>
        {
            BatchSize = 1000
        };
        var found = await _airQuality.FindAsync(_ => true, options);
        return await found.ToListAsync();
    }

    public async Task<List<AirQualityData>> CreateManyAsync(List<AirQualityData> data)
    {
        if (data.Count == 0)
            return data;
            
        await _airQuality.InsertManyAsync(data);
        return data;
    }

    public async Task DeleteAllAsync()
    {
        await _airQuality.DeleteManyAsync(Builders<AirQualityData>.Filter.Empty);
    }
}

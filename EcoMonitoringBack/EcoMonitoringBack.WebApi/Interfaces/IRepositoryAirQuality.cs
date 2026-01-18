using EcoMonitoringBack.Models.AirQuality;

namespace EcoMonitoringBack.Interfaces;

public interface IRepositoryAirQuality
{
    Task<List<AirQualityData>> GetAllAirQualityDataAsync();
    Task<List<AirQualityData>> CreateManyAsync(List<AirQualityData> data);
    Task DeleteAllAsync();
}

using EcoMonitoringBack.Models.AirQuality;

namespace EcoMonitoringBack.Interfaces;

public interface IServiceAirQuality
{
    Task<List<AirQualityData>> GetAllAirQualityDataAsync();
    Task<List<AirQualityData>> UploadAirQualityDataAsync(List<AirQualityData> data);
}

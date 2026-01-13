using EcoMonitoringBack.Interfaces;
using EcoMonitoringBack.Models.AirQuality;

namespace EcoMonitoringBack.Services;

public class ServiceAirQuality(
    IRepositoryAirQuality repositoryAirQuality,
    ILogger<ServiceAirQuality> logger) : IServiceAirQuality
{
    public async Task<List<AirQualityData>> GetAllAirQualityDataAsync()
    {
        logger.LogInformation("Получение всех данных о качестве воздуха");
        return await repositoryAirQuality.GetAllAirQualityDataAsync();
    }

    public async Task<List<AirQualityData>> UploadAirQualityDataAsync(List<AirQualityData> data)
    {
        logger.LogInformation("Загрузка {Count} записей данных о качестве воздуха", data.Count);
        
        await repositoryAirQuality.DeleteAllAsync();
        logger.LogInformation("Старые данные удалены");
        
        var result = await repositoryAirQuality.CreateManyAsync(data);
        logger.LogInformation("Успешно загружено {Count} записей", result.Count);
        
        return result;
    }
}

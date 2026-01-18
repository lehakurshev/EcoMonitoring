using EcoMonitoringBack.ContractModels;
using EcoMonitoringBack.Interfaces;
using EcoMonitoringBack.Mappings;
using Microsoft.AspNetCore.Mvc;

namespace EcoMonitoringBack.Controllers;

[ApiController]
[Route("api/airquality")]
public class AirQualityController(
    IServiceAirQuality serviceAirQuality,
    ILogger<AirQualityController> logger) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<EcoAirQualityData>>> GetAllAirQualityData()
    {
        logger.LogInformation("Запрос на получение всех данных о качестве воздуха");
        try
        {
            var data = (await serviceAirQuality.GetAllAirQualityDataAsync())?
                .Select(x => x.ToEcoAirQualityData())
                .ToList();
            
            logger.LogInformation("Получено {Count} записей о качестве воздуха", data?.Count ?? 0);
            return Ok(data);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Ошибка при получении данных о качестве воздуха");
            return StatusCode(500, new { error = $"Ошибка при получении данных: {ex.Message}" });
        }
    }

    [HttpPost("upload")]
    public async Task<ActionResult<List<EcoAirQualityData>>> UploadAirQualityData(
        [FromBody] List<EcoAirQualityData> data)
    {
        logger.LogInformation("Запрос на загрузку {Count} записей о качестве воздуха", data?.Count ?? 0);
        
        if (data == null || data.Count == 0)
        {
            logger.LogWarning("Получен пустой массив данных");
            return BadRequest(new { error = "Данные не могут быть пустыми" });
        }

        try
        {
            var domainData = data.Select(x => x.ToAirQualityData()).ToList();
            var result = await serviceAirQuality.UploadAirQualityDataAsync(domainData);
            
            var response = result.Select(x => x.ToEcoAirQualityData()).ToList();
            logger.LogInformation("Успешно загружено {Count} записей", response.Count);
            
            return Ok(new 
            { 
                message = $"Успешно загружено {response.Count} записей",
                count = response.Count,
                data = response
            });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Ошибка при загрузке данных о качестве воздуха");
            return StatusCode(500, new { error = $"Ошибка при загрузке данных: {ex.Message}" });
        }
    }
}

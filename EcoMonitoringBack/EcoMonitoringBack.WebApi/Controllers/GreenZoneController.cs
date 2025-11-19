using EcoMonitoringBack.Interfaces;
using EcoMonitoringBack.Models.Common;
using EcoMonitoringBack.Models.GreenZones;
using Microsoft.AspNetCore.Mvc;

namespace EcoMonitoringBack.Controllers;

[ApiController]
[Route("api/greenzones")]
public class GreenZoneController : ControllerBase
{
    private readonly IGreenZoneService _geoAnalysisService;
    private readonly IRepositoryGreenZones _repositoryGreenZones;

    public GreenZoneController(IGreenZoneService geoAnalysisService, IRepositoryGreenZones repositoryGreenZones)
    {
        _geoAnalysisService = geoAnalysisService;
        _repositoryGreenZones = repositoryGreenZones;
    }

    [HttpGet("area")]
    public async Task<ActionResult<List<GreenZoneMongo>>> GetByArea(
        [FromQuery] double minLat,
        [FromQuery] double maxLat,
        [FromQuery] double minLon,
        [FromQuery] double maxLon)
    {
        try
        {
            var greenZones = await _repositoryGreenZones.GetByAreaAsync(minLat, maxLat, minLon, maxLon);
            return Ok(greenZones);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = $"Ошибка при получении зеленых зон: {ex.Message}" });
        }
    }    

    [HttpPost("analyze-polygon")]
    public ActionResult<GreenZoneAreaAndCenter> AnalyzePolygon([FromBody] GreenZoneData greenZoneData)
    {
        try
        {
            if (greenZoneData == null)
            {
                return BadRequest(new { error = "Данные не могут быть пустыми" });
            }

            if (!_geoAnalysisService.IsValidPolygon(greenZoneData.Coordinates))
            {
                return BadRequest(new { error = "Некорректный формат полигона. Ожидается минимум 4 точки" });
            }

            var result = _geoAnalysisService.CalculatePolygonAreaAndCenter(greenZoneData);
                
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = $"Ошибка при анализе полигона: {ex.Message}" });
        }
    }

    [HttpPost("analyze-polygons")]
    public ActionResult<List<GreenZoneAreaAndCenter>> AnalyzePolygonsBatch([FromBody] List<GreenZoneData> greenZoneDates)
    {
        try
        {
            if (greenZoneDates == null || greenZoneDates.Count == 0)
            {
                return BadRequest(new { error = "Список полигонов не может быть пустым" });
            }

            var results = new List<GreenZoneAreaAndCenter>();

            foreach (var greenZoneData in greenZoneDates)
            {
                if (_geoAnalysisService.IsValidPolygon(greenZoneData.Coordinates))
                {
                    var result = _geoAnalysisService.CalculatePolygonAreaAndCenter(greenZoneData);
                    results.Add(result);
                }
            }

            return Ok(results);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = $"Ошибка при пакетном анализе полигонов: {ex.Message}" });
        }
    }
    
}
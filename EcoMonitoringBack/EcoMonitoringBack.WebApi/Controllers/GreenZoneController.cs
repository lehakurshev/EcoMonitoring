using EcoMonitoringBack.ContractModels;
using EcoMonitoringBack.Interfaces;
using EcoMonitoringBack.Mappings;
using EcoMonitoringBack.Models.GreenZones;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver.Linq;

namespace EcoMonitoringBack.Controllers;

[ApiController]
[Route("api/greenzones")]
public class GreenZoneController(IGreenZoneService geoAnalysisService, IRepositoryGreenZones repositoryGreenZones)
    : ControllerBase
{
    [HttpGet("area")]
    public async Task<ActionResult<List<EcoGreenZone>>> GetByArea(
        [FromQuery] double minLat,
        [FromQuery] double maxLat,
        [FromQuery] double minLon,
        [FromQuery] double maxLon)
    {
        try
        {
            var greenZones = (await repositoryGreenZones.GetByAreaAsync(minLat, maxLat, minLon, maxLon))?
                .Select(x => x.ToEcoGreenZone())
                .ToList();
            return Ok(greenZones);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = $"Ошибка при получении зеленых зон: {ex.Message}" });
        }
    }

    [HttpPost("analyze-polygons")]
    public ActionResult<List<EcoGreenZoneAreaAndCenter>> AnalyzePolygonsBatch([FromBody] List<EcoGreenZoneData> greenZoneDates)
    {
        try
        {
            if (greenZoneDates == null || greenZoneDates.Count == 0)
            {
                return BadRequest(new { error = "Список полигонов не может быть пустым" });
            }

            var results = (from greenZoneData
                in greenZoneDates
                select greenZoneData.ToGreenZoneData()
                into domainModel
                where geoAnalysisService.IsValidPolygon(domainModel.Coordinates)
                select geoAnalysisService.CalculatePolygonAreaAndCenter(domainModel)
                into result
                select result.ToEcoGreenZoneAreaAndCenter()).ToList();

            return Ok(results);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = $"Ошибка при пакетном анализе полигонов: {ex.Message}" });
        }
    }
}
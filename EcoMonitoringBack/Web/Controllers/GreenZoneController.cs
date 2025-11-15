using Domain.Contracts;
using DomainModels;
using Microsoft.AspNetCore.Mvc;

namespace Web.Controllers;

[ApiController]
[Route("api/green-zone")]
public class GreenZoneController : ControllerBase
{
    private readonly IGreenZoneService _geoAnalysisService;

    public GreenZoneController(IGreenZoneService geoAnalysisService)
    {
        _geoAnalysisService = geoAnalysisService;
    }    

    [HttpPost("analyze/polygon")]
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

    [HttpPost("analyze/polygons")]
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
using System.ComponentModel.Design;
using EcoMonitoringBack.Dto;
using EcoMonitoringBack.Interfaces;
using EcoMonitoringBack.Models.Container;
using Microsoft.AspNetCore.Mvc;

namespace EcoMonitoringBack.Controllers;

[ApiController]
[Route("migration")]
public class ContainerMigrationController : ControllerBase
{
    private readonly IServiceMigrationContainer _serviceMigrationContainer;
    public ContainerMigrationController(IServiceMigrationContainer serviceMigrationContainer)
    {
        _serviceMigrationContainer = serviceMigrationContainer;
    }

    [HttpPost("start")]
    public async Task<ActionResult> StartMigration(IFormFile file)
    {
        try
        {
            await _serviceMigrationContainer.StartMigrationAsync(file);
            return Ok();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (InvalidDataException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = $"Хз чо не так: {ex.Message}" });
        }
    }
    
}
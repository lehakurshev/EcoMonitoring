using System.ComponentModel.Design;
using EcoMonitoringBack.Dto;
using EcoMonitoringBack.Interfaces;
using EcoMonitoringBack.Models.Container;
using Microsoft.AspNetCore.Mvc;

namespace EcoMonitoringBack.Controllers;

[ApiController]
[Route("api/container")]
public class ContainerMigrationController : ControllerBase
{
    private readonly IServiceMigrationContainer _serviceMigrationContainer;
    private readonly IServiceContainers _serviceContainers;

    public ContainerMigrationController(IServiceMigrationContainer serviceMigrationContainer,
        IServiceContainers serviceContainers)
    {
        _serviceMigrationContainer = serviceMigrationContainer;
        _serviceContainers = serviceContainers;
    }

    [HttpPost("migration/start")]
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
    
    [HttpGet]
    public async Task<ActionResult<List<ContainerInfo>>> GetContainers()
    {
        try
        {
            var services = await _serviceContainers.GetAllContainersAsync();
            return Ok(services);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = $"Хз чо не так: {ex.Message}" });
        }
    }
    
}
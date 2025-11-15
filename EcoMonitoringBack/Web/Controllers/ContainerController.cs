using Domain.Contracts;
using DomainModels;
using Microsoft.AspNetCore.Mvc;
using Web.Contracts;
using Web.Mappings;

namespace Web.Controllers;

[ApiController]
[Route("api/containers")]
public class ContainerController : ControllerBase
{
    private readonly IServiceContainers _serviceContainers;

    public ContainerController(IServiceContainers serviceContainers)
    {
        _serviceContainers = serviceContainers;
    }
    
    [HttpGet]
    public async Task<ActionResult<List<EcoContainerInfo>>> GetAllContainers()
    {
        try
        {
            var containers = (await _serviceContainers.GetAllContainersAsync())?
                .Select(x => ToContractMappings.ToEcoContainerInfo(x))
                .ToList();
                
            return Ok(containers);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = $"Ошибка при получении контейнеров: {ex.Message}" });
        }
    }

    [HttpGet("area")]
    public async Task<ActionResult<List<EcoContainerInfo>>> GetContainersInArea(
        [FromQuery] double topLeftLat, 
        [FromQuery] double topLeftLng,
        [FromQuery] double bottomRightLat, 
        [FromQuery] double bottomRightLng)
    {
        try
        {
            var topLeft = new Point(topLeftLat, topLeftLng);
            var bottomRight = new Point(bottomRightLat, bottomRightLng);
            
            var containers = (await _serviceContainers.GetContainersInAreaAsync(topLeft, bottomRight))?
                .Select(x => ToContractMappings.ToEcoContainerInfo(x))
                .ToList();
            return Ok(containers);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = $"Ошибка при получении контейнеров в области: {ex.Message}" });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<EcoContainerInfo>> GetContainerById(string id)
    {
        try
        {
            var exists = await _serviceContainers.ContainerExistsAsync(id);
            if (!exists)
            {
                return NotFound(new { error = "Контейнер не найден" });
            }

            var allContainers = await _serviceContainers.GetAllContainersAsync();
            var container = allContainers.FirstOrDefault(c => c.Id == id);
            
            if (container == null)
            {
                return NotFound(new { error = "Контейнер не найден" });
            }

            return Ok(ToContractMappings.ToEcoContainerInfo(container));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = $"Ошибка при получении контейнера: {ex.Message}" });
        }
    }

    [HttpPost]
    public async Task<ActionResult<EcoContainerInfo>> CreateContainer([FromBody] EcoContainerCreationInfo container)
    {
        try
        {
            if (container == null)
            {
                return BadRequest(new { error = "Данные контейнера не могут быть пустыми" });
            }
            
            var createdContainer = await _serviceContainers.CreateContainerAsync(container.ToDomain());
            return CreatedAtAction(nameof(GetContainerById), new { id = createdContainer.Id },
                ToContractMappings.ToEcoContainerInfo(createdContainer));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = $"Ошибка при создании контейнера: {ex.Message}" });
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateContainer(string id, [FromBody] EcoContainerInfo container)
    {
        try
        {
            if (container == null)
            {
                return BadRequest(new { error = "Данные контейнера не могут быть пустыми" });
            }

            var exists = await _serviceContainers.ContainerExistsAsync(id);
            if (!exists)
            {
                return NotFound(new { error = "Контейнер не найден" });
            }

            var result = await _serviceContainers.UpdateContainerAsync(id, container.ToDomain());
            
            if (result)
            {
                return Ok(new { message = "Контейнер успешно обновлен" });
            }
            else
            {
                return StatusCode(500, new { error = "Не удалось обновить контейнер" });
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = $"Ошибка при обновлении контейнера: {ex.Message}" });
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteContainer(string id)
    {
        try
        {
            var exists = await _serviceContainers.ContainerExistsAsync(id);
            if (!exists)
            {
                return NotFound(new { error = "Контейнер не найден" });
            }

            var result = await _serviceContainers.DeleteContainerAsync(id);
            
            if (result)
            {
                return Ok(new { message = "Контейнер успешно удален" });
            }
            else
            {
                return StatusCode(500, new { error = "Не удалось удалить контейнер" });
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = $"Ошибка при удалении контейнера: {ex.Message}" });
        }
    }
}
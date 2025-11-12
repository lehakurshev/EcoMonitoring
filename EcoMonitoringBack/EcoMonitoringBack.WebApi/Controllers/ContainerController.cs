using EcoMonitoringBack.Interfaces;
using EcoMonitoringBack.Models.Common;
using EcoMonitoringBack.Models.Container;
using Microsoft.AspNetCore.Mvc;

namespace EcoMonitoringBack.Controllers;

[ApiController]
[Route("containers")]
public class ContainerController : ControllerBase
{
    private readonly IServiceContainers _serviceContainers;

    public ContainerController(IServiceContainers serviceContainers)
    {
        _serviceContainers = serviceContainers;
    }
    
    [HttpGet]
    public async Task<ActionResult<List<ContainerInfo>>> GetAllContainers()
    {
        try
        {
            var containers = await _serviceContainers.GetAllContainersAsync();
            return Ok(containers);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = $"Ошибка при получении контейнеров: {ex.Message}" });
        }
    }

    [HttpGet("area")]
    public async Task<ActionResult<List<ContainerInfo>>> GetContainersInArea(
        [FromQuery] double topLeftLat, 
        [FromQuery] double topLeftLng,
        [FromQuery] double bottomRightLat, 
        [FromQuery] double bottomRightLng)
    {
        try
        {
            var topLeft = new Point(topLeftLat, topLeftLng);
            var bottomRight = new Point(bottomRightLat, bottomRightLng);
            
            var containers = await _serviceContainers.GetContainersInAreaAsync(topLeft, bottomRight);
            return Ok(containers);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = $"Ошибка при получении контейнеров в области: {ex.Message}" });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ContainerInfo>> GetContainerById(string id)
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

            return Ok(container);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = $"Ошибка при получении контейнера: {ex.Message}" });
        }
    }

    [HttpPost]
    public async Task<ActionResult<ContainerInfo>> CreateContainer([FromBody] ContainerInfo container)
    {
        try
        {
            if (container == null)
            {
                return BadRequest(new { error = "Данные контейнера не могут быть пустыми" });
            }

            var createdContainer = await _serviceContainers.CreateContainerAsync(container);
            return CreatedAtAction(nameof(GetContainerById), new { id = createdContainer.Id }, createdContainer);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = $"Ошибка при создании контейнера: {ex.Message}" });
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateContainer(string id, [FromBody] ContainerInfo container)
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

            var result = await _serviceContainers.UpdateContainerAsync(id, container);
            
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
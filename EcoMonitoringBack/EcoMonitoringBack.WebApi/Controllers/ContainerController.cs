using EcoMonitoringBack.ContractModels;
using EcoMonitoringBack.Interfaces;
using EcoMonitoringBack.Mappings;
using EcoMonitoringBack.Models.Common;
using EcoMonitoringBack.Models.Container;
using Microsoft.AspNetCore.Mvc;

namespace EcoMonitoringBack.Controllers;

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
                .Select(x => x.ToEcoContainerInfo())
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
                .Select(x => x.ToEcoContainerInfo())
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

            return Ok(container.ToEcoContainerInfo());
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = $"Ошибка при получении контейнера: {ex.Message}" });
        }
    }

    [HttpPost]
    public async Task<ActionResult<EcoContainerInfo>> CreateContainer([FromBody] EcoCreateContainerRequest request)
    {
        try
        {
            if (request == null)
            {
                return BadRequest(new { error = "Данные контейнера не могут быть пустыми" });
            }

            if (request.WasteTypes == null || request.WasteTypes.Length == 0)
            {
                return BadRequest(new { error = "Необходимо выбрать хотя бы один тип отходов" });
            }

            if (string.IsNullOrWhiteSpace(request.Settlement))
            {
                return BadRequest(new { error = "Населенный пункт обязателен" });
            }

            if (string.IsNullOrWhiteSpace(request.District))
            {
                return BadRequest(new { error = "Район обязателен" });
            }

            if (string.IsNullOrWhiteSpace(request.Street))
            {
                return BadRequest(new { error = "Улица обязательна" });
            }

            var wasteTypes = request.WasteTypes.Select(wt => (WasteType)wt).ToList();
            var address = new Address(
                request.Settlement,
                request.District,
                request.Street,
                request.House ?? string.Empty
            );
            var coordinates = new Point(request.Latitude, request.Longitude);
            
            var container = new ContainerInfo(wasteTypes, coordinates, address);
            var createdContainer = await _serviceContainers.CreateContainerAsync(container);
            
            return CreatedAtAction(nameof(GetContainerById), new { id = createdContainer.Id }, createdContainer.ToEcoContainerInfo());
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = $"Ошибка при создании контейнера: {ex.Message}" });
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateContainer(string id, [FromBody] EcoContainerInfoParams container)
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

            var result = await _serviceContainers.UpdateContainerAsync(id, container.ToDomain(id));
            
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
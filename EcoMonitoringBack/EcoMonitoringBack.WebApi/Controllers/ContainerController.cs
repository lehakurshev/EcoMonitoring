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
    private readonly ILogger<ContainerController> _logger;

    public ContainerController(IServiceContainers serviceContainers, ILogger<ContainerController> logger)
    {
        _serviceContainers = serviceContainers;
        _logger = logger;
    }
    
    [HttpGet]
    public async Task<ActionResult<List<EcoContainerInfo>>> GetAllContainers()
    {
        _logger.LogInformation("Запрос на получение всех контейнеров");
        try
        {
            var containers = (await _serviceContainers.GetAllContainersAsync())?
                .Select(x => x.ToEcoContainerInfo())
                .ToList();
            _logger.LogInformation("Получено {Count} контейнеров", containers?.Count ?? 0);
            return Ok(containers);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при получении контейнеров");
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
        _logger.LogInformation("Запрос контейнеров в области: TL({TopLeftLat}, {TopLeftLng}), BR({BottomRightLat}, {BottomRightLng})",
            topLeftLat, topLeftLng, bottomRightLat, bottomRightLng);
        try
        {
            var topLeft = new Point(topLeftLat, topLeftLng);
            var bottomRight = new Point(bottomRightLat, bottomRightLng);
            
            var containers = (await _serviceContainers.GetContainersInAreaAsync(topLeft, bottomRight))?
                .Select(x => x.ToEcoContainerInfo())
                .ToList();
            _logger.LogInformation("Найдено {Count} контейнеров в области", containers?.Count ?? 0);
            return Ok(containers);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при получении контейнеров в области");
            return StatusCode(500, new { error = $"Ошибка при получении контейнеров в области: {ex.Message}" });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<EcoContainerInfo>> GetContainerById(string id)
    {
        _logger.LogInformation("Запрос контейнера по ID: {ContainerId}", id);
        try
        {
            var exists = await _serviceContainers.ContainerExistsAsync(id);
            if (!exists)
            {
                _logger.LogWarning("Контейнер с ID {ContainerId} не найден", id);
                return NotFound(new { error = "Контейнер не найден" });
            }

            var allContainers = await _serviceContainers.GetAllContainersAsync();
            var container = allContainers.FirstOrDefault(c => c.Id == id);
            
            if (container == null)
            {
                _logger.LogWarning("Контейнер с ID {ContainerId} не найден", id);
                return NotFound(new { error = "Контейнер не найден" });
            }

            _logger.LogInformation("Контейнер {ContainerId} успешно получен", id);
            return Ok(container.ToEcoContainerInfo());
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при получении контейнера {ContainerId}", id);
            return StatusCode(500, new { error = $"Ошибка при получении контейнера: {ex.Message}" });
        }
    }

    [HttpPost]
    public async Task<ActionResult<EcoContainerInfo>> CreateContainer([FromBody] EcoCreateContainerRequest request)
    {
        _logger.LogInformation("Запрос на создание контейнера");
        try
        {
            if (request == null)
            {
                _logger.LogWarning("Попытка создать контейнер с пустыми данными");
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
            
            _logger.LogInformation("Контейнер успешно создан с ID: {ContainerId}", createdContainer.Id);
            return CreatedAtAction(nameof(GetContainerById), new { id = createdContainer.Id }, createdContainer.ToEcoContainerInfo());
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при создании контейнера");
            return StatusCode(500, new { error = $"Ошибка при создании контейнера: {ex.Message}" });
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateContainer(string id, [FromBody] EcoContainerInfoParams container)
    {
        _logger.LogInformation("Запрос на обновление контейнера {ContainerId}", id);
        try
        {
            if (container == null)
            {
                _logger.LogWarning("Попытка обновить контейнер {ContainerId} с пустыми данными", id);
                return BadRequest(new { error = "Данные контейнера не могут быть пустыми" });
            }

            var exists = await _serviceContainers.ContainerExistsAsync(id);
            if (!exists)
            {
                _logger.LogWarning("Попытка обновить несуществующий контейнер {ContainerId}", id);
                return NotFound(new { error = "Контейнер не найден" });
            }

            var result = await _serviceContainers.UpdateContainerAsync(id, container.ToDomain(id));
            
            if (result)
            {
                _logger.LogInformation("Контейнер {ContainerId} успешно обновлен", id);
                return Ok(new { message = "Контейнер успешно обновлен" });
            }
            else
            {
                _logger.LogError("Не удалось обновить контейнер {ContainerId}", id);
                return StatusCode(500, new { error = "Не удалось обновить контейнер" });
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при обновлении контейнера {ContainerId}", id);
            return StatusCode(500, new { error = $"Ошибка при обновлении контейнера: {ex.Message}" });
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteContainer(string id)
    {
        _logger.LogInformation("Запрос на удаление контейнера {ContainerId}", id);
        try
        {
            var exists = await _serviceContainers.ContainerExistsAsync(id);
            if (!exists)
            {
                _logger.LogWarning("Попытка удалить несуществующий контейнер {ContainerId}", id);
                return NotFound(new { error = "Контейнер не найден" });
            }

            var result = await _serviceContainers.DeleteContainerAsync(id);
            
            if (result)
            {
                _logger.LogInformation("Контейнер {ContainerId} успешно удален", id);
                return Ok(new { message = "Контейнер успешно удален" });
            }
            else
            {
                _logger.LogError("Не удалось удалить контейнер {ContainerId}", id);
                return StatusCode(500, new { error = "Не удалось удалить контейнер" });
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при удалении контейнера {ContainerId}", id);
            return StatusCode(500, new { error = $"Ошибка при удалении контейнера: {ex.Message}" });
        }
    }
}
using EcoMonitoringBack.ContractModels;
using EcoMonitoringBack.Interfaces;
using EcoMonitoringBack.Mappings;
using Microsoft.AspNetCore.Mvc;

namespace EcoMonitoringBack.Controllers;

[ApiController]
[Route("api/containers/{containerId}/reviews")]
public class ReviewController : ControllerBase
{
    private readonly IServiceReviews _serviceReviews;
    private readonly ILogger<ReviewController> _logger;

    public ReviewController(IServiceReviews serviceReviews, ILogger<ReviewController> logger)
    {
        _serviceReviews = serviceReviews;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<List<EcoContainerReview>>> GetReviews(string containerId)
    {
        _logger.LogInformation("Запрос отзывов для контейнера {ContainerId}", containerId);
        try
        {
            var reviews = (await _serviceReviews.GetReviewsByContainerIdAsync(containerId))?
                .Select(x => x.ToEcoContainerReview())
                .ToList();
            _logger.LogInformation("Получено {Count} отзывов для контейнера {ContainerId}", reviews?.Count ?? 0, containerId);
            return Ok(reviews);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning("Некорректный запрос отзывов для контейнера {ContainerId}: {Message}", containerId, ex.Message);
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при получении отзывов для контейнера {ContainerId}", containerId);
            return StatusCode(500, new { error = $"Ошибка при получении отзывов: {ex.Message}" });
        }
    }

    [HttpPost]
    public async Task<ActionResult<EcoContainerReview>> CreateReview(
        string containerId,
        [FromBody] EcoCreateReviewRequest request)
    {
        _logger.LogInformation("Запрос на создание отзыва для контейнера {ContainerId}", containerId);
        try
        {
            var createdReview = await _serviceReviews.CreateReviewAsync(containerId, request.ToCreateReviewRequest());
            _logger.LogInformation("Отзыв успешно создан для контейнера {ContainerId}", containerId);
            return CreatedAtAction(nameof(GetReviews), new { containerId }, createdReview.ToEcoContainerReview());
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning("Некорректный запрос на создание отзыва для контейнера {ContainerId}: {Message}", containerId, ex.Message);
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при создании отзыва для контейнера {ContainerId}", containerId);
            return StatusCode(500, new { error = $"Ошибка при создании отзыва: {ex.Message}" });
        }
    }
}

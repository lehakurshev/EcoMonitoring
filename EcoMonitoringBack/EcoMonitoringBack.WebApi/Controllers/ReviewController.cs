using EcoMonitoringBack.ContractModels;
using EcoMonitoringBack.Interfaces;
using EcoMonitoringBack.Mappings;
using Microsoft.AspNetCore.Mvc;

namespace EcoMonitoringBack.Controllers;

[ApiController]
[Route("api/containers/{containerId}/reviews")]
public class ReviewController(IServiceReviews serviceReviews, ILogger<ReviewController> logger)
    : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<EcoContainerReview>>> GetReviews(string containerId)
    {
        logger.LogInformation("Запрос отзывов для контейнера {ContainerId}", containerId);
        try
        {
            var reviews = (await serviceReviews.GetReviewsByContainerIdAsync(containerId))?
                .Select(x => x.ToEcoContainerReview())
                .ToList();
            logger.LogInformation("Получено {Count} отзывов для контейнера {ContainerId}", reviews?.Count ?? 0, containerId);
            return Ok(reviews);
        }
        catch (ArgumentException ex)
        {
            logger.LogWarning("Некорректный запрос отзывов для контейнера {ContainerId}: {Message}", containerId, ex.Message);
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Ошибка при получении отзывов для контейнера {ContainerId}", containerId);
            return StatusCode(500, new { error = $"Ошибка при получении отзывов: {ex.Message}" });
        }
    }

    [HttpPost]
    public async Task<ActionResult<EcoContainerReview>> CreateReview(
        string containerId,
        [FromBody] EcoCreateReviewRequest request)
    {
        logger.LogInformation("Запрос на создание отзыва для контейнера {ContainerId}", containerId);
        try
        {
            var createdReview = await serviceReviews.CreateReviewAsync(containerId, request.ToCreateReviewRequest());
            logger.LogInformation("Отзыв успешно создан для контейнера {ContainerId}", containerId);
            return CreatedAtAction(nameof(GetReviews), new { containerId }, createdReview.ToEcoContainerReview());
        }
        catch (ArgumentException ex)
        {
            logger.LogWarning("Некорректный запрос на создание отзыва для контейнера {ContainerId}: {Message}", containerId, ex.Message);
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Ошибка при создании отзыва для контейнера {ContainerId}", containerId);
            return StatusCode(500, new { error = $"Ошибка при создании отзыва: {ex.Message}" });
        }
    }
    
    [HttpPut]
    public async Task<ActionResult<EcoContainerReview>> UpdateReview(
        string containerId,
        [FromBody] EcoCreateReviewRequest request)
    {
        logger.LogInformation("Запрос на обнавление отзыва для контейнера {ContainerId}", containerId);
        try
        {
            var createdReview = await serviceReviews.UpdateReviewAsync(containerId, request.ToCreateReviewRequest());
            if (!createdReview)
            {
                logger.LogInformation("Не найден контейнер {ContainerId}", containerId);
                return BadRequest();
            }
            logger.LogInformation("Отзыв успешно обновлён для контейнера {ContainerId}", containerId);
            return Ok();
        }
        catch (ArgumentException ex)
        {
            logger.LogWarning("Некорректный запрос на обновление отзыва для контейнера {ContainerId}: {Message}", containerId, ex.Message);
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Ошибка при обновлении отзыва для контейнера {ContainerId}", containerId);
            return StatusCode(500, new { error = $"Ошибка при обновлении отзыва: {ex.Message}" });
        }
    }
    
    
    [HttpGet("history")]
    public async Task<ActionResult<List<EcoContainerReview>>> GetReviewsBeforeDatesAsync(
        string containerId, DateTime moment)
    {
        logger.LogInformation("Запрос на данные об отзывах на определённую дату {ContainerId}", containerId);
        try
        {
            var reviews = await serviceReviews.GetReviewsBeforeDatesAsync(moment, containerId);
            logger.LogInformation("Отзывы успешно загружены с {ContainerId}", containerId);
            return Ok(reviews);
        }
        catch (ArgumentException ex)
        {
            logger.LogWarning("Некорректный запрос данных об отзывах на определённую дату {ContainerId}: {Message}", containerId, ex.Message);
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Ошибка при запросе данных об отзывах на определённую дату {ContainerId}", containerId);
            return StatusCode(500, new { error = $"Ошибка при запросе : {ex.Message}" });
        }
    }
}

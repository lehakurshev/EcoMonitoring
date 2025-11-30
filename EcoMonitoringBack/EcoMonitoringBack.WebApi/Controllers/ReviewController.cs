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

    public ReviewController(IServiceReviews serviceReviews)
    {
        _serviceReviews = serviceReviews;
    }

    [HttpGet]
    public async Task<ActionResult<List<EcoContainerReview>>> GetReviews(string containerId)
    {
        try
        {
            var reviews = (await _serviceReviews.GetReviewsByContainerIdAsync(containerId))?
                .Select(x => x.ToEcoContainerReview())
                .ToList();
            return Ok(reviews);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = $"Ошибка при получении отзывов: {ex.Message}" });
        }
    }

    [HttpPost]
    public async Task<ActionResult<EcoContainerReview>> CreateReview(
        string containerId,
        [FromBody] EcoCreateReviewRequest request)
    {
        try
        {
            var createdReview = await _serviceReviews.CreateReviewAsync(containerId, request.ToCreateReviewRequest());
            return CreatedAtAction(nameof(GetReviews), new { containerId }, createdReview.ToEcoContainerReview());
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = $"Ошибка при создании отзыва: {ex.Message}" });
        }
    }
}

using EcoMonitoringBack.Dto;
using EcoMonitoringBack.Interfaces;
using EcoMonitoringBack.Models.Container;
using Microsoft.AspNetCore.Mvc;

namespace EcoMonitoringBack.Controllers;

[ApiController]
[Route("containers/{containerId}/reviews")]
public class ReviewController : ControllerBase
{
    private readonly IServiceReviews _serviceReviews;

    public ReviewController(IServiceReviews serviceReviews)
    {
        _serviceReviews = serviceReviews;
    }

    [HttpGet]
    public async Task<ActionResult<List<ContainerReview>>> GetReviews(string containerId)
    {
        try
        {
            var reviews = await _serviceReviews.GetReviewsByContainerIdAsync(containerId);
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
    public async Task<ActionResult<ContainerReview>> CreateReview(
        string containerId,
        [FromBody] CreateReviewRequest request)
    {
        try
        {
            var createdReview = await _serviceReviews.CreateReviewAsync(containerId, request);
            return CreatedAtAction(nameof(GetReviews), new { containerId }, createdReview);
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

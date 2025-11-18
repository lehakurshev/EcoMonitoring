using EcoMonitoringBack.Dto;
using EcoMonitoringBack.Interfaces;
using EcoMonitoringBack.Models.Container;
using Microsoft.AspNetCore.Mvc;

namespace EcoMonitoringBack.Controllers;

[ApiController]
[Route("containers/{containerId}/reviews")]
public class ReviewController : ControllerBase
{
    private readonly IRepositoryReviews _repositoryReviews;

    public ReviewController(IRepositoryReviews repositoryReviews)
    {
        _repositoryReviews = repositoryReviews;
    }

    [HttpGet]
    public async Task<ActionResult<List<ContainerReview>>> GetReviews(string containerId)
    {
        try
        {
            var reviews = await _repositoryReviews.GetReviewsByContainerIdAsync(containerId);
            return Ok(reviews);
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
            if (string.IsNullOrWhiteSpace(request.AuthorName))
            {
                return BadRequest(new { error = "Имя автора не может быть пустым" });
            }

            if (request.Rating < 1 || request.Rating > 5)
            {
                return BadRequest(new { error = "Рейтинг должен быть от 1 до 5" });
            }

            var review = new ContainerReview
            {
                ContainerId = containerId,
                AuthorName = request.AuthorName,
                Rating = request.Rating,
                Comment = request.Comment ?? string.Empty,
                CreatedAt = DateTime.UtcNow
            };

            var createdReview = await _repositoryReviews.CreateReviewAsync(review);
            return CreatedAtAction(nameof(GetReviews), new { containerId }, createdReview);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = $"Ошибка при создании отзыва: {ex.Message}" });
        }
    }
}

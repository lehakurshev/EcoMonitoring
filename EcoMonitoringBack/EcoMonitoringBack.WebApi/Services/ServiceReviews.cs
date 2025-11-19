using EcoMonitoringBack.Dto;
using EcoMonitoringBack.Interfaces;
using EcoMonitoringBack.Models.Container;

namespace EcoMonitoringBack.Services;

public class ServiceReviews : IServiceReviews
{
    private readonly IRepositoryReviews _repositoryReviews;

    public ServiceReviews(IRepositoryReviews repositoryReviews)
    {
        _repositoryReviews = repositoryReviews;
    }

    public async Task<List<ContainerReview>> GetReviewsByContainerIdAsync(string containerId)
    {
        if (string.IsNullOrWhiteSpace(containerId))
        {
            throw new ArgumentException("ID контейнера не может быть пустым", nameof(containerId));
        }

        return await _repositoryReviews.GetReviewsByContainerIdAsync(containerId);
    }

    public async Task<ContainerReview> CreateReviewAsync(string containerId, CreateReviewRequest request)
    {
        if (string.IsNullOrWhiteSpace(containerId))
        {
            throw new ArgumentException("ID контейнера не может быть пустым", nameof(containerId));
        }

        if (string.IsNullOrWhiteSpace(request.AuthorName))
        {
            throw new ArgumentException("Имя автора не может быть пустым", nameof(request.AuthorName));
        }

        if (request.Rating < 1 || request.Rating > 5)
        {
            throw new ArgumentException("Рейтинг должен быть от 1 до 5", nameof(request.Rating));
        }

        var review = new ContainerReview
        {
            ContainerId = containerId,
            AuthorName = request.AuthorName,
            Rating = request.Rating,
            Comment = request.Comment ?? string.Empty,
            CreatedAt = DateTime.UtcNow
        };

        return await _repositoryReviews.CreateReviewAsync(review);
    }
}

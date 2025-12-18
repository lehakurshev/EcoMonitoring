using EcoMonitoringBack.Dto;
using EcoMonitoringBack.Interfaces;
using EcoMonitoringBack.Models.Container;

namespace EcoMonitoringBack.Services;

public class ServiceReviews(IRepositoryHistoryReviews repositoryReviews) : IServiceReviews
{
    public async Task<List<ContainerReview>> GetReviewsByContainerIdAsync(string containerId)
    {
        if (string.IsNullOrWhiteSpace(containerId))
        {
            throw new ArgumentException("ID контейнера не может быть пустым", nameof(containerId));
        }

        return await repositoryReviews.GetReviewsByContainerIdAsync(containerId);
    }

    public async Task<ContainerReview> CreateReviewAsync(string containerId, CreateReviewRequest request)
    {
        if (string.IsNullOrWhiteSpace(containerId))
        {
            throw new ArgumentException("ID контейнера не может быть пустым", nameof(containerId));
        }

        if (string.IsNullOrWhiteSpace(request.AuthorName))
        {
            throw new ArgumentException("Имя автора не может быть пустым", nameof(request));
        }

        if (request.Rating is < 1 or > 5)
        {
            throw new ArgumentException("Рейтинг должен быть от 1 до 5", nameof(request));
        }

        var review = new ContainerReview
        {
            ContainerId = containerId,
            AuthorName = request.AuthorName,
            Rating = request.Rating,
            Comment = request.Comment ?? string.Empty,
            CreatedAt = DateTime.UtcNow
        };

        return await repositoryReviews.CreateReviewAsync(review);
    }
    
    public async Task<bool> UpdateReviewAsync(string containerId, CreateReviewRequest request)
    {
        if (string.IsNullOrWhiteSpace(containerId))
        {
            throw new ArgumentException("ID контейнера не может быть пустым", nameof(containerId));
        }
        
        if (request.Rating is < 1 or > 5)
        {
            throw new ArgumentException("Рейтинг должен быть от 1 до 5", nameof(request));
        }

        var review = new ContainerReview
        {
            ContainerId = containerId,
            AuthorName = request.AuthorName,
            Rating = request.Rating,
            Comment = request.Comment ?? string.Empty,
            CreatedAt = DateTime.UtcNow
        };

        return await repositoryReviews.UpdateReviewAsync(containerId, review);
    }

    public async Task<List<ContainerReview>> GetReviewsBeforeDatesAsync(DateTime moment, string containerId)
    {
        if (string.IsNullOrWhiteSpace(containerId))
        {
            throw new ArgumentException("ID контейнера не может быть пустым", nameof(containerId));
        }
        
        if (moment == default(DateTime))
        {
            throw new ArgumentException("Время и дата должны быть указаны", nameof(DateTime));
        }

        return await repositoryReviews.GetReviewsBeforeDatesAsync(moment, containerId);
    }
}

using EcoMonitoringBack.Models.Container;

namespace EcoMonitoringBack.Interfaces;

public interface IRepositoryReviews
{
    Task<List<ContainerReview>> GetReviewsByContainerIdAsync(string containerId);
    
    Task<ContainerReview> GetReviewByReviewIdAsync(string reviewId);
    Task<ContainerReview> CreateReviewAsync(ContainerReview review);
    Task<bool> UpdateReviewAsync(string reviewId, ContainerReview review);
}

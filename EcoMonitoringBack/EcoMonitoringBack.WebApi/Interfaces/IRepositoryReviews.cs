using EcoMonitoringBack.Models.Container;

namespace EcoMonitoringBack.Interfaces;

public interface IRepositoryReviews
{
    Task<List<ContainerReview>> GetReviewsByContainerIdAsync(string containerId);
    Task<ContainerReview> CreateReviewAsync(ContainerReview review);
}

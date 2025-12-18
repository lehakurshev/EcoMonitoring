using EcoMonitoringBack.Dto;
using EcoMonitoringBack.Models.Container;

namespace EcoMonitoringBack.Interfaces;

public interface IServiceReviews
{
    Task<List<ContainerReview>> GetReviewsByContainerIdAsync(string containerId);
    Task<ContainerReview> CreateReviewAsync(string containerId, CreateReviewRequest request);

    Task<bool> UpdateReviewAsync(string containerId, CreateReviewRequest request);

    Task<List<ContainerReview>> GetReviewsBeforeDatesAsync(DateTime moment, string containerId);
}

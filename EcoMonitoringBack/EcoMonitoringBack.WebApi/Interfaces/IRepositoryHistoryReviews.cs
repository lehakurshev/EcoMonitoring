using EcoMonitoringBack.Models.Container;

namespace EcoMonitoringBack.Interfaces;

public interface IRepositoryHistoryReviews : IRepositoryReviews
{
    Task<List<ContainerReview>> GetReviewsBeforeDatesAsync(DateTime moment, string containerId);
}
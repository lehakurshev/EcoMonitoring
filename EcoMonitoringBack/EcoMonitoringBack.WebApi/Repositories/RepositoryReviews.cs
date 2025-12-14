using EcoMonitoringBack.Interfaces;
using EcoMonitoringBack.Models.Container;
using MongoDB.Driver;

namespace EcoMonitoringBack.Repositories;

public class RepositoryReviews(IMongoDatabase database) : IRepositoryReviews
{
    private readonly IMongoCollection<ContainerReview> _reviews = database.GetCollection<ContainerReview>("containerReviews");

    public async Task<List<ContainerReview>> GetReviewsByContainerIdAsync(string containerId)
    {
        return await _reviews
            .Find(r => r.ContainerId == containerId)
            .SortByDescending(r => r.CreatedAt)
            .ToListAsync();
    }

    public async Task<ContainerReview> CreateReviewAsync(ContainerReview review)
    {
        await _reviews.InsertOneAsync(review);
        return review;
    }
}

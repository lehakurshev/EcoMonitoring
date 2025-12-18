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
    
    public async Task<ContainerReview> GetReviewByReviewIdAsync(string reviewId)
    {
        return await _reviews
            .Find(r => r.Id == reviewId)
            .SortByDescending(r => r.CreatedAt)
            .FirstOrDefaultAsync();
    }

    public async Task<ContainerReview> CreateReviewAsync(ContainerReview review)
    {
        await _reviews.InsertOneAsync(review);
        return review;
    }
    
    public async Task<bool> UpdateReviewAsync(string reviewId, ContainerReview updatedReview)
    {
        updatedReview.Id = reviewId;
        
        var filter = Builders<ContainerReview>.Filter.Eq(r => r.Id, reviewId);

        var update = Builders<ContainerReview>.Update
            .Set(r => r.Rating, updatedReview.Rating)
            .Set(r => r.Comment, updatedReview.Comment);

        var result = await _reviews.UpdateOneAsync(filter, update);
        
        return result.IsAcknowledged && result.ModifiedCount > 0;
    }
}

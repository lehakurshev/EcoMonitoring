using EcoMonitoringBack.Dto;
using EcoMonitoringBack.Interfaces;
using EcoMonitoringBack.Models.Container;
using MongoDB.Bson;
using MongoDB.Driver;

namespace EcoMonitoringBack.Repositories;

public class RepositoryHistoryReviews : IRepositoryHistoryReviews
{
    private readonly IRepositoryReviews _innerRepository;
    private readonly IMongoCollection<ReviewHistory> _history;

    public RepositoryHistoryReviews(
        IRepositoryReviews innerRepository,
        IMongoDatabase database)
    {
        _innerRepository = innerRepository;
        _history = database.GetCollection<ReviewHistory>("reviewHistory");
        
        CreateIndexes();
    }

    private void CreateIndexes()
    {
        // Индекс для поиска по reviewId
        var reviewIdIndex = Builders<ReviewHistory>.IndexKeys
            .Ascending(h => h.ReviewId);
        _history.Indexes.CreateOne(new CreateIndexModel<ReviewHistory>(reviewIdIndex));

        // Индекс для поиска по дате операции
        var timestampIndex = Builders<ReviewHistory>.IndexKeys
            .Descending(h => h.OperationTimestamp);
        _history.Indexes.CreateOne(new CreateIndexModel<ReviewHistory>(timestampIndex));

        // Индекс для поиска по типу операции
        var operationTypeIndex = Builders<ReviewHistory>.IndexKeys
            .Ascending(h => h.OperationType);
        _history.Indexes.CreateOne(new CreateIndexModel<ReviewHistory>(operationTypeIndex));
    }
    
    public async Task<List<ContainerReview>> GetReviewsByContainerIdAsync(string containerId)
    {
        return await _innerRepository.GetReviewsByContainerIdAsync(containerId);
    }

    public async Task<ContainerReview> GetReviewByReviewIdAsync(string reviewId)
    {
        return await _innerRepository.GetReviewByReviewIdAsync(reviewId);
    }
    
    public async Task<ContainerReview> CreateReviewAsync(ContainerReview review)
    {
        var result = await _innerRepository.CreateReviewAsync(review);
        
        await LogOperationOperationAsync(
            result.Id,
            result,
            "CREATE"
        );
        
        return result;
    }

    public async Task<bool> UpdateReviewAsync(string reviewId, ContainerReview updatedReview)
    {
        var oldReview = await _innerRepository.GetReviewByReviewIdAsync(reviewId);
        
        var result = await _innerRepository.UpdateReviewAsync(reviewId, updatedReview);
        
        if (result && oldReview != null)
        {
            var newReview = await _innerRepository.GetReviewByReviewIdAsync(reviewId);
            
            await LogOperationOperationAsync(
                reviewId,
                newReview,
                "UPDATE"
            );
        }
        
        return result;
    }

    public async Task<List<ContainerReview>> GetReviewsBeforeDatesAsync(DateTime moment, string containerId)
    {
        var allReviews = await _innerRepository.GetReviewsByContainerIdAsync(containerId);
        
        var operationsFilter = Builders<ReviewHistory>.Filter.Lte(h => h.OperationTimestamp, moment);
        var allOperations = await _history
            .Find(operationsFilter)
            .ToListAsync();
        
        var operationsByReview = allOperations
            .GroupBy(op => op.ReviewId)
            .ToDictionary(g => g.Key, 
                g => g.OrderByDescending(history => history.OperationTimestamp).ToList());

        var result = new List<ContainerReview>();

        foreach (var review in allReviews)
        {
            if (operationsByReview.TryGetValue(review.Id, out var reviewOperations))
            {
                var lastOperation = reviewOperations.FirstOrDefault();
                if (lastOperation != null)
                {
                    result.Add(lastOperation.NewState);
                }
            }
        }

        return result;
    }


    public async Task LogOperationOperationAsync(
        string reviewId, 
        ContainerReview newReview,
        string operationTypeString)
    {
        var operation = new ReviewHistory
        {
            Id = ObjectId.GenerateNewId().ToString(),
            ReviewId = reviewId,
            OperationType = operationTypeString, 
            NewState = newReview
        };

        await _history.InsertOneAsync(operation);
    }
}
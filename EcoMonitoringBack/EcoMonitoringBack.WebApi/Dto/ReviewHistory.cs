using EcoMonitoringBack.Models.Container;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace EcoMonitoringBack.Dto;

public class ReviewHistory
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;
    
    [BsonElement("reviewId")]
    public string ReviewId { get; set; } = string.Empty;
    
    [BsonElement("operationType")]
    public string OperationType { get; set; } = string.Empty; // CREATE, UPDATE, DELETE, etc.
    
    [BsonElement("newState")]
    [BsonIgnoreIfNull]
    public ContainerReview NewState { get; set; }
    
    [BsonElement("operationTimestamp")]
    public DateTime OperationTimestamp { get; set; } = DateTime.Today; 
    
}
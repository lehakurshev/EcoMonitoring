using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace EcoMonitoringBack.Models.Container;

public class ContainerReview
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;
    
    [BsonRepresentation(BsonType.ObjectId)]
    public string ContainerId { get; init; } = string.Empty;
    
    public string AuthorName { get; init; } = string.Empty;
    public int Rating { get; init; }
    public string Comment { get; init; } = string.Empty;
    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
}

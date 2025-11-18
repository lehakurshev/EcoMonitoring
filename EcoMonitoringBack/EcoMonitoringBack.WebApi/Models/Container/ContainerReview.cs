using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace EcoMonitoringBack.Models.Container;

public class ContainerReview
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;
    
    [BsonRepresentation(BsonType.ObjectId)]
    public string ContainerId { get; set; } = string.Empty;
    
    public string AuthorName { get; set; } = string.Empty;
    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

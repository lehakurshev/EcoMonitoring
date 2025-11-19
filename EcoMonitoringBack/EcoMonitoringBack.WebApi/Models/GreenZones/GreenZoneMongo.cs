using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using EcoMonitoringBack.Models.Common;

namespace EcoMonitoringBack.Models.GreenZones;

public class GreenZoneMongo
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("name")]
    public string? Name { get; set; }

    [BsonElement("type")]
    public string Type { get; set; } = string.Empty;

    [BsonElement("subtype")]
    public string? Subtype { get; set; }

    [BsonElement("coordinates")]
    public List<Point> Coordinates { get; set; } = new();

    [BsonElement("properties")]
    public Dictionary<string, object> Properties { get; set; } = new();
}

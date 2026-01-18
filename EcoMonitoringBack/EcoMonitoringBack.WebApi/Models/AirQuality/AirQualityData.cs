using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using EcoMonitoringBack.Models.Common;

namespace EcoMonitoringBack.Models.AirQuality;

public class AirQualityData
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;
    
    [BsonElement("location")]
    public Point Location { get; set; } = null!;
    
    [BsonElement("district")]
    public string District { get; set; } = string.Empty;
    
    [BsonElement("pm25")]
    public double Pm25 { get; set; }
    
    [BsonElement("pm10")]
    public double Pm10 { get; set; }
    
    [BsonElement("so2")]
    public double So2 { get; set; }
    
    [BsonElement("no2")]
    public double No2 { get; set; }
    
    [BsonElement("co")]
    public double Co { get; set; }
    
    [BsonElement("o3")]
    public double O3 { get; set; }
    
    [BsonElement("aqi")]
    public int Aqi { get; set; }
    
    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

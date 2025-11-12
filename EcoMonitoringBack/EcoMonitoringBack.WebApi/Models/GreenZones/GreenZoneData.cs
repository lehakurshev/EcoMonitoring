using System.Text.Json.Serialization;
using EcoMonitoringBack.Models.Common;

namespace EcoMonitoringBack.Models.GreenZones;

public class GreenZoneData
{
    [JsonPropertyName("coordinates")]
    public List<Point> Coordinates { get; set; }
        
    [JsonPropertyName("properties")]
    public Dictionary<string, object> Properties { get; set; } = new();
}
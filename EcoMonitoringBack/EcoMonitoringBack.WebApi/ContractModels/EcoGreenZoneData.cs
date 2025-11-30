using System.Text.Json.Serialization;

namespace EcoMonitoringBack.ContractModels;

public class EcoGreenZoneData
{
    [JsonPropertyName("coordinates")]
    public List<EcoPoint> Coordinates { get; set; }
    
    [JsonPropertyName("properties")]
    public Dictionary<string, object> Properties { get; set; } = new();
}
using EcoMonitoringBack.Models.Common;

namespace EcoMonitoringBack.Models.GreenZones;

public class GreenZoneData
{
    public List<Point> Coordinates { get; set; }
        
    public Dictionary<string, object> Properties { get; set; } = new();
}
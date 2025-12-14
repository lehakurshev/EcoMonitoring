using EcoMonitoringBack.Models.Common;

namespace EcoMonitoringBack.Models.GreenZones;

public class GreenZoneAreaAndCenter
{
    public Point Center { get; init; }
    public double AreaHectares { get; init; }
}
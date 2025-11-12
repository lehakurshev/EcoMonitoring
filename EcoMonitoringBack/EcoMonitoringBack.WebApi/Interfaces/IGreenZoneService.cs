using EcoMonitoringBack.Models.Common;
using EcoMonitoringBack.Models.GreenZones;

namespace EcoMonitoringBack.Interfaces;

public interface IGreenZoneService
{
    GreenZoneAreaAndCenter CalculatePolygonAreaAndCenter(GreenZoneData greenZoneData);
    bool IsValidPolygon(List<Point> coordinates);
}
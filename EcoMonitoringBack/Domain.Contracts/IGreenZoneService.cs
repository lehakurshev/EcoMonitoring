using DomainModels;

namespace Domain.Contracts;

public interface IGreenZoneService
{
    GreenZoneAreaAndCenter CalculatePolygonAreaAndCenter(GreenZoneData greenZoneData);
    
    bool IsValidPolygon(List<Point> coordinates);
}
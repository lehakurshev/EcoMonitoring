using EcoMonitoringBack.ContractModels;
using EcoMonitoringBack.Dto;
using EcoMonitoringBack.Models.Common;
using EcoMonitoringBack.Models.Container;
using EcoMonitoringBack.Models.GreenZones;

namespace EcoMonitoringBack.Mappings;

public static class ToDomainMappings
{
    public static ContainerInfo ToDomain(this EcoContainerInfoParams infoParams, string id)
    {
        var wasteTypes = infoParams.WasteTypes?
            .Select(x => (WasteType)x)
            .ToList();
        return new ContainerInfo(wasteTypes, infoParams.Location.ToDomain(), infoParams.Address.ToDomain())
        {
            Id = id
        };
    }
    
    public static GreenZoneData ToGreenZoneData(this EcoGreenZoneData zoneData)
    {
        return new GreenZoneData
        {
            Coordinates = zoneData.Coordinates?.ToPointsList(),
            Properties = zoneData.Properties
        };
    }
    
    public static CreateReviewRequest ToCreateReviewRequest(this EcoCreateReviewRequest request)
    {
        return new CreateReviewRequest(request.AuthorName, request.Rating, request.Comment);
    }
    
    private static Point ToDomain(this EcoPoint point)
    {
        return new Point(point.Latitude, point.Longitude);
    }

    public static List<Point> ToPointsList(this IEnumerable<EcoPoint> points)
    {
        return points
            .Select(x => x.ToDomain())
            .ToList();
    }
    
    private static Address ToDomain(this EcoAddress address)
    {
        return new Address(address.Settlement, address.District, address.Street, address.House);
    }
}
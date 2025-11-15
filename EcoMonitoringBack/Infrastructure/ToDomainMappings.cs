using DomainModels;
using MongoDB.Driver.GeoJsonObjectModel;

namespace Infrastructure;

public static class ToDomainMappings
{
    public static ContainerInfo ToDomain(this DbContainerInfo info)
    {
        var wasteTypes = info.WasteTypes?
            .Select(x => (WasteType)x)
            .ToList();
        return new ContainerInfo(info.Id, wasteTypes, info.Location.ToDomain(), info.Address);
    }

    private static Point ToDomain(this GeoJsonPoint<GeoJson2DCoordinates> location)
    {
        return new Point(location.Coordinates.Y, location.Coordinates.X);
    }
}
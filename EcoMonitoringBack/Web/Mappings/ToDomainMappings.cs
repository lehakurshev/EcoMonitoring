using DomainModels;
using Web.Contracts;

namespace Web.Mappings;

public static class ToDomainMappings
{
    public static Address ToDomain(this EcoAddress address)
    {
        return new Address(address.Settlement, address.District, address.Street, address.House);
    }
    
    public static ContainerCreationInfo ToDomain(this EcoContainerCreationInfo info)
    {
        var wasteTypes = info.WasteTypes?
            .Select(x => (WasteType)x)
            .ToList();
        return new ContainerCreationInfo(wasteTypes, info.Location.ToDomain(), info.Address.ToDomain());
    }
    
    public static ContainerInfo ToDomain(this EcoContainerInfo info)
    {
        var wasteTypes = info.WasteTypes?
            .Select(x => (WasteType)x)
            .ToList();
        return new ContainerInfo(info.Id, wasteTypes, info.Location.ToDomain(), info.Address.ToDomain());
    }
    
    public static Point ToDomain(this EcoPoint point)
    {
        return new Point(point.Latitude, point.Longitude);
    }
}
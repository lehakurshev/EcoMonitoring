using DomainModels;
using Web.Contracts;

namespace Web.Mappings;

public static class ToContractMappings
{
    public static EcoAddress ToEcoAddress(this Address address)
    {
        return new EcoAddress(address.Settlement, address.District, address.Street, address.House);
    }
    
    public static EcoPoint ToEcoPoint(this Point point)
    {
        return new EcoPoint(point.Latitude, point.Longitude);
    }
    
    public static EcoContainerInfo ToEcoContainerInfo(this ContainerInfo info)
    {
        return new EcoContainerInfo
        {
            Id = info.Id,
            WasteTypes = info.WasteTypes?
                .Select(x => (EcoWasteType)x)
                .ToList(),
            Location = ToEcoPoint(info.Location),
            Address = ToEcoAddress(info.Address)
        };
    }
}
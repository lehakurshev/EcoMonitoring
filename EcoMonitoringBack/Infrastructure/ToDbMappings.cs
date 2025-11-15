using DomainModels;

namespace Infrastructure;

public static class ToDbMappings
{
    public static DbContainerInfo ToDb(this ContainerInfo info)
    {
        return new DbContainerInfo(info.Id, info.WasteTypes, info.Location, info.Address);
    }
    
    public static DbContainerInfo ToDb(this ContainerCreationInfo info)
    {
        return new DbContainerInfo(info.WasteTypes, info.Location, info.Address);
    }
}
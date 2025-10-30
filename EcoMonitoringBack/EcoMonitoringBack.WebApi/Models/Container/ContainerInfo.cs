using EcoMonitoringBack.Models.Common;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace EcoMonitoringBack.Models.Container;

public class ContainerInfo
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;
    public List<WasteType> WasteTypes { get; private set; }
    public Point Coordinates { get; set; }
    public Address Address { get; set; }
    
    public ContainerInfo(List<WasteType> wasteTypes, Point coordinates, Address address)
    {
        this.WasteTypes = new List<WasteType>(wasteTypes);
        Coordinates = coordinates;
        Address = address;
    }

    public void SetWasteTypes(List<WasteType> wasteTypes)
    {
        WasteTypes = wasteTypes;
    }
}
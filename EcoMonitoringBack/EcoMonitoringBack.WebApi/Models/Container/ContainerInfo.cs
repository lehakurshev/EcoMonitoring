using EcoMonitoringBack.Models.Common;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver.GeoJsonObjectModel;

namespace EcoMonitoringBack.Models.Container;

public class ContainerInfo
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;
    public List<WasteType> WasteTypes { get; set; }
    
    [BsonElement("location")]
    public GeoJsonPoint<GeoJson2DCoordinates> Location { get; set; }
    public Address Address { get; set; }
    
    public ContainerInfo()
    {
        WasteTypes = [];
    }
    
    public ContainerInfo(List<WasteType> wasteTypes, Point coordinates, Address address)
    {
        WasteTypes = new List<WasteType>(wasteTypes);
        Location = new GeoJsonPoint<GeoJson2DCoordinates>(
            new GeoJson2DCoordinates(coordinates.Longitude, coordinates.Latitude));
        Address = address;
    }
}
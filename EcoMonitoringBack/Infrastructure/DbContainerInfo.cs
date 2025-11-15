using DomainModels;
using Infrastructure.Contracts;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver.GeoJsonObjectModel;

namespace Infrastructure;

public class DbContainerInfo
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;
    public List<WasteType> WasteTypes { get; private set; }
    
    [BsonElement("location")]
    public GeoJsonPoint<GeoJson2DCoordinates> Location { get; set; }
    public Address Address { get; set; }
    
    public DbContainerInfo(string id, List<WasteType> wasteTypes, Point coordinates, Address address)
    {
        Id = id;
        WasteTypes = new List<WasteType>(wasteTypes);
        Location = new GeoJsonPoint<GeoJson2DCoordinates>(
            new GeoJson2DCoordinates(coordinates.Longitude, coordinates.Latitude));
        Address = address;
    }
    
    public DbContainerInfo(List<WasteType> wasteTypes, Point coordinates, Address address)
    {
        WasteTypes = new List<WasteType>(wasteTypes);
        Location = new GeoJsonPoint<GeoJson2DCoordinates>(
            new GeoJson2DCoordinates(coordinates.Longitude, coordinates.Latitude));
        Address = address;
    }
}
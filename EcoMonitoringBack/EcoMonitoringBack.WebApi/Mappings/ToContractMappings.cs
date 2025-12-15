using EcoMonitoringBack.ContractModels;
using EcoMonitoringBack.Models.Common;
using EcoMonitoringBack.Models.Container;
using EcoMonitoringBack.Models.GreenZones;
using MongoDB.Driver.GeoJsonObjectModel;

namespace EcoMonitoringBack.Mappings;

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
    
    public static EcoPoint ToEcoPoint(this GeoJsonPoint<GeoJson2DCoordinates> point)
    {
        var latitude = point.Coordinates.Y;
        var longitude = point.Coordinates.X;
        return new EcoPoint(latitude, longitude);
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
    
    public static EcoContainerReview ToEcoContainerReview(this ContainerReview review)
    {
        return new EcoContainerReview
        {
            Id = review.Id,
            ContainerId = review.ContainerId,
            AuthorName = review.AuthorName,
            Rating = review.Rating,
            Comment = review.Comment,
            CreatedAt = review.CreatedAt,
        };
    }
    
    public static EcoGreenZoneAreaAndCenter ToEcoGreenZoneAreaAndCenter(this GreenZoneAreaAndCenter zone)
    {
        return new EcoGreenZoneAreaAndCenter
        {
            Center = zone.Center.ToEcoPoint(),
            Area = zone.AreaHectares
        };
    }
    
    public static EcoGreenZone ToEcoGreenZone(this GreenZoneMongo zone)
    {
        return new EcoGreenZone
        {
            Id = zone.Id, 
            Name = zone.Name, 
            Type = zone.Type, 
            Subtype = zone.Subtype, 
            Coordinates = zone.Coordinates?
                .Select(x => x.ToEcoPoint())
                .ToList(),
            Properties = zone.Properties
        };
    }
}
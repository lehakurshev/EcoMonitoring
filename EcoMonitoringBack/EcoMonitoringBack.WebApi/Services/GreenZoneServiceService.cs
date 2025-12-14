using EcoMonitoringBack.Interfaces;
using EcoMonitoringBack.Models.Common;
using EcoMonitoringBack.Models.GreenZones;

namespace EcoMonitoringBack.Services;

public class GreenZoneServiceService : IGreenZoneService
{
    private const double EarthRadiusMeters = 6378137.0;

    public GreenZoneAreaAndCenter CalculatePolygonAreaAndCenter(GreenZoneData greenZoneData)
    {
        if (!IsValidPolygon(greenZoneData.Coordinates))
        {
            throw new ArgumentException("Invalid polygon coordinates");
        }
        
        var coordinates = greenZoneData.Coordinates;
            
        var areaSquareMeters = CalculateSphericalArea(coordinates);
        var areaHectares = areaSquareMeters / 10000;
            
        var center = CalculateCentroid(coordinates);

        return new GreenZoneAreaAndCenter
        {
            Center = center,
            AreaHectares = Math.Round(areaHectares, 4)
        };
    }    
    
    public bool IsValidPolygon(List<Point> coordinates)
    {
        return coordinates.Count >= 4;
    }    

    private double CalculateSphericalArea(List<Point> coordinates)
    {

        double area = 0;
        var n = coordinates.Count;

        for (var i = 0; i < n; i++)
        {
            var current = coordinates[i];
            var next = coordinates[(i + 1) % n];

            var currentLonRad = ToRadians(current.Longitude);
            var nextLonRad = ToRadians(next.Longitude);
            var currentLatRad = ToRadians(current.Latitude);
            var nextLatRad = ToRadians(next.Latitude);

            area += (nextLonRad - currentLonRad) * 
                    (2 + Math.Sin(currentLatRad) + Math.Sin(nextLatRad));
        }

        area = area * EarthRadiusMeters * EarthRadiusMeters / 2.0;
        return Math.Abs(area);
    }

    private static Point CalculateCentroid(List<Point> coordinates)
    {
        var closedCoordinates = new List<Point>(coordinates);
        if (!closedCoordinates[0].Equals(closedCoordinates[^1]))
        {
            closedCoordinates.Add(closedCoordinates[0]);
        }

        double signedArea = 0;
        double centroidX = 0;
        double centroidY = 0;

        var n = closedCoordinates.Count - 1;

        for (var i = 0; i < n; i++)
        {
            var x0 = closedCoordinates[i].Longitude;
            var y0 = closedCoordinates[i].Latitude;
            var x1 = closedCoordinates[i + 1].Longitude;
            var y1 = closedCoordinates[i + 1].Latitude;

            var a = x0 * y1 - x1 * y0;
            signedArea += a;
            centroidX += (x0 + x1) * a;
            centroidY += (y0 + y1) * a;
        }

        signedArea *= 0.5;
        centroidX /= 6 * signedArea;
        centroidY /= 6 * signedArea;

        return new Point(centroidY, centroidX);
    }

    private static double ToRadians(double degrees)
    {
        return degrees * Math.PI / 180.0;
    }
}
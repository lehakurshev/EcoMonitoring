using Domain.Contracts;
using DomainModels;

namespace Domain;

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
            
        // Вычисляем площадь
        var areaSquareMeters = CalculateSphericalArea(coordinates);
        var areaHectares = areaSquareMeters / 10000;
            
        // Вычисляем центр масс
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
        int n = coordinates.Count;

        for (int i = 0; i < n; i++)
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

    private Point CalculateCentroid(List<Point> coordinates)
    {
        var closedCoordinates = new List<Point>(coordinates);
        if (!closedCoordinates[0].Equals(closedCoordinates[^1]))
        {
            closedCoordinates.Add(closedCoordinates[0]);
        }

        double signedArea = 0;
        double centroidX = 0;
        double centroidY = 0;

        int n = closedCoordinates.Count - 1;

        for (int i = 0; i < n; i++)
        {
            double x0 = closedCoordinates[i].Longitude;
            double y0 = closedCoordinates[i].Latitude;
            double x1 = closedCoordinates[i + 1].Longitude;
            double y1 = closedCoordinates[i + 1].Latitude;

            double a = x0 * y1 - x1 * y0;
            signedArea += a;
            centroidX += (x0 + x1) * a;
            centroidY += (y0 + y1) * a;
        }

        signedArea *= 0.5;
        centroidX /= (6 * signedArea);
        centroidY /= (6 * signedArea);

        return new Point(centroidY, centroidX);
    }

    private double ToRadians(double degrees)
    {
        return degrees * Math.PI / 180.0;
    }
}
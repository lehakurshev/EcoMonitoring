namespace EcoMonitoringBack;

public class Infrastructure
{
    public static (double, double, double, double) GetByAreaResizedArea(
        double minLat,
        double maxLat,
        double minLon,
        double maxLon,
        double coefficientResize)
    {
        var centerLon = (maxLon + minLon) / 2.0;
        var centerLat = (maxLat + minLat) / 2.0;
        var deltaLon = centerLon - minLon;
        var deltaLat = centerLat - minLat;
            
        var nextMinLat = minLat - coefficientResize * deltaLat;
        var nextMaxLat = maxLat + coefficientResize * deltaLat;
            
        var nextMinLon = minLon - coefficientResize * deltaLon;
        var nextMaxLon = maxLon + coefficientResize * deltaLon;
        return (nextMinLat, nextMaxLat, nextMinLon, nextMaxLon);
    }
}
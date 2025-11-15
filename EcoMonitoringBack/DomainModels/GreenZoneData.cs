namespace DomainModels;

public class GreenZoneData
{
    public List<Point> Coordinates { get; set; }
        
    public Dictionary<string, object> Properties { get; set; } = new();
}
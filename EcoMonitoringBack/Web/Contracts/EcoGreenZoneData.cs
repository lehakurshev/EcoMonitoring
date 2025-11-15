namespace Web.Contracts;

public class EcoGreenZoneData
{
    public List<EcoPoint> Coordinates { get; set; }
        
    public Dictionary<string, object> Properties { get; set; } = new();
}
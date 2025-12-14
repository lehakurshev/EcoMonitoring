namespace EcoMonitoringBack.ContractModels;

public class EcoGreenZone
{
    public string Id { get; set; }

    public string Name { get; set; }

    public string Type { get; set; }

    public string Subtype { get; set; }

    public List<EcoPoint> Coordinates { get; set; }

    public Dictionary<string, object> Properties { get; set; }
}
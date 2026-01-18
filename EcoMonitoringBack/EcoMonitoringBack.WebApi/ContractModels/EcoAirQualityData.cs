namespace EcoMonitoringBack.ContractModels;

public class EcoAirQualityData
{
    public EcoPoint Location { get; set; } = null!;
    public string District { get; set; } = string.Empty;
    public double Pm25 { get; set; }
    public double Pm10 { get; set; }
    public double So2 { get; set; }
    public double No2 { get; set; }
    public double Co { get; set; }
    public double O3 { get; set; }
    public int Aqi { get; set; }
}

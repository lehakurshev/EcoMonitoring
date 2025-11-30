namespace EcoMonitoringBack.ContractModels;

public class EcoContainerInfoParams
{
    public List<EcoWasteType> WasteTypes { get; set; }
    
    public EcoPoint Location { get; set; }
    
    public EcoAddress Address { get; set; }
}
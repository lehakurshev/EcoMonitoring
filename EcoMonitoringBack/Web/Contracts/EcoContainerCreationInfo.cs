namespace Web.Contracts;

public class EcoContainerCreationInfo
{
    public List<EcoWasteType> WasteTypes { get; set; }
    
    public EcoPoint Location { get; set; }
    
    public EcoAddress Address { get; set; }
}
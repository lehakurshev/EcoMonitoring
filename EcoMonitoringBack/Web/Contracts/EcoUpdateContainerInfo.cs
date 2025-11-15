namespace Web.Contracts;

public class EcoUpdateContainerInfo
{
    public string Id { get; set; }
    
    public List<EcoWasteType> WasteTypes { get; set; }
    
    public EcoPoint Location { get; set; }
    
    public EcoAddress Address { get; set; }
}
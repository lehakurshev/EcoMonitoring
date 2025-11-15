namespace DomainModels;

public class ContainerCreationInfo
{
    public List<WasteType> WasteTypes { get; private set; }
    
    public Point Location { get; set; }
    
    public Address Address { get; set; }
    
    public ContainerCreationInfo(List<WasteType> wasteTypes, Point coordinates, Address address)
    {
        WasteTypes = new List<WasteType>(wasteTypes);
        Location = coordinates;
        Address = address;
    }
}
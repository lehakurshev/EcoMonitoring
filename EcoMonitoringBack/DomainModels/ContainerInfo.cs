namespace DomainModels;

public class ContainerInfo
{
    public string Id { get; set; } = string.Empty;
    public List<WasteType> WasteTypes { get; private set; }
    
    public Point Location { get; set; }
    public Address Address { get; set; }
    
    public ContainerInfo(string id, List<WasteType> wasteTypes, Point coordinates, Address address)
    {
        Id = id;
        WasteTypes = new List<WasteType>(wasteTypes);
        Location = coordinates;
        Address = address;
    }
    
    public ContainerInfo(List<WasteType> wasteTypes, Point coordinates, Address address)
    {
        WasteTypes = new List<WasteType>(wasteTypes);
        Location = coordinates;
        Address = address;
    }
}
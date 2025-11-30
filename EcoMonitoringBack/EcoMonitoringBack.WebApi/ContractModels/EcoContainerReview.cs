namespace EcoMonitoringBack.ContractModels;

public class EcoContainerReview
{
    public string Id { get; set; }
    
    public string ContainerId { get; set; }
    
    public string AuthorName { get; set; }
    
    public int Rating { get; set; }
    
    public string Comment { get; set; }
    
    public DateTime CreatedAt { get; set; }
}
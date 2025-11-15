using DomainModels;

namespace Domain.Contracts;

public interface IServiceContainers
{
    Task<List<ContainerInfo>> GetAllContainersAsync();
    
    Task<List<ContainerInfo>> GetContainersInAreaAsync(Point topLeft, Point bottomRight);
    
    Task<ContainerInfo> CreateContainerAsync(ContainerCreationInfo container);
    
    Task<bool> UpdateContainerAsync(string id, ContainerInfo container);
    
    Task<bool> DeleteContainerAsync(string id);
    
    Task<bool> ContainerExistsAsync(string id);
}
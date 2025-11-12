using EcoMonitoringBack.Models.Common;
using EcoMonitoringBack.Models.Container;

namespace EcoMonitoringBack.Interfaces;

public interface IServiceContainers
{
    Task<List<ContainerInfo>> GetAllContainersAsync();
    
    Task<List<ContainerInfo>> GetContainersInAreaAsync(Point topLeft, Point bottomRight);
    
    Task<ContainerInfo> CreateContainerAsync(ContainerInfo container);
    
    Task<bool> UpdateContainerAsync(string id, ContainerInfo container);
    
    Task<bool> DeleteContainerAsync(string id);
    
    Task<bool> ContainerExistsAsync(string id);
}
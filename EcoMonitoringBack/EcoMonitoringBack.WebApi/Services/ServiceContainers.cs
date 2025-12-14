using EcoMonitoringBack.Interfaces;
using EcoMonitoringBack.Models.Common;
using EcoMonitoringBack.Models.Container;

namespace EcoMonitoringBack.Services;

public class ServiceContainers(IRepositoryContainers repositoryContainers) : IServiceContainers
{
    public async Task<List<ContainerInfo>> GetAllContainersAsync()
    {
        return await repositoryContainers.GetAllContainersAsync();
    }

    public async Task<List<ContainerInfo>> GetContainersInAreaAsync(Point topLeft, Point bottomRight)
    {
        return await repositoryContainers.GetContainersInAreaAsync(topLeft, bottomRight);
    }

    public async Task<ContainerInfo> CreateContainerAsync(ContainerInfo container)
    {
        return await repositoryContainers.CreateContainerAsync(container);
    }

    public async Task<bool> UpdateContainerAsync(string id, ContainerInfo container)
    {
        return await repositoryContainers.UpdateContainerAsync(id, container);
    }

    public async Task<bool> DeleteContainerAsync(string id)
    {
        return await repositoryContainers.DeleteContainerAsync(id);
    }

    public async Task<bool> ContainerExistsAsync(string id)
    {
        return await repositoryContainers.ContainerExistsAsync(id);
    }
    
}
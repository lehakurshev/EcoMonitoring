using EcoMonitoringBack.Interfaces;
using EcoMonitoringBack.Models.Common;
using EcoMonitoringBack.Models.Container;

namespace EcoMonitoringBack.Services;

public class ServiceContainers : IServiceContainers
{
    private readonly IRepositoryContainers _repositoryContainers;
    
    public ServiceContainers(IRepositoryContainers repositoryContainers)
    {
        _repositoryContainers = repositoryContainers;
    }
    
    public async Task<List<ContainerInfo>> GetAllContainersAsync()
    {
        return await _repositoryContainers.GetAllContainersAsync();
    }

    public async Task<List<ContainerInfo>> GetContainersInAreaAsync(Point topLeft, Point bottomRight)
    {
        return await _repositoryContainers.GetContainersInAreaAsync(topLeft, bottomRight);
    }

    public async Task<ContainerInfo> CreateContainerAsync(ContainerInfo container)
    {
        return await _repositoryContainers.CreateContainerAsync(container);
    }

    public async Task<bool> UpdateContainerAsync(string id, ContainerInfo container)
    {
        return await _repositoryContainers.UpdateContainerAsync(id, container);
    }

    public async Task<bool> DeleteContainerAsync(string id)
    {
        return await _repositoryContainers.DeleteContainerAsync(id);
    }

    public async Task<bool> ContainerExistsAsync(string id)
    {
        return await _repositoryContainers.ContainerExistsAsync(id);
    }
    
}
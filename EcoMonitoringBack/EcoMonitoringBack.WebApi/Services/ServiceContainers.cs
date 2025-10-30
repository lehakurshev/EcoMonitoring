using EcoMonitoringBack.Interfaces;
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
}
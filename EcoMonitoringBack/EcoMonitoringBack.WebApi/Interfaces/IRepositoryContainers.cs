using EcoMonitoringBack.Models.Container;

namespace EcoMonitoringBack.Interfaces;

public interface IRepositoryContainers
{
    Task<List<ContainerInfo>> GetAllContainersAsync();
}
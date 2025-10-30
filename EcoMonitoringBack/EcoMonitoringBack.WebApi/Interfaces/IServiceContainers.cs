using EcoMonitoringBack.Models.Container;

namespace EcoMonitoringBack.Interfaces;

public interface IServiceContainers
{
    Task<List<ContainerInfo>> GetAllContainersAsync();
}
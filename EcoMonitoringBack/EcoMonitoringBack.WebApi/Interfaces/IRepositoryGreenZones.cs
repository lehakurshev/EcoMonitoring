using EcoMonitoringBack.Models.GreenZones;

namespace EcoMonitoringBack.Interfaces;

public interface IRepositoryGreenZones
{
    Task<List<GreenZoneMongo>> GetByAreaAsync(double minLat, double maxLat, double minLon, double maxLon);
    Task CreateManyAsync(List<GreenZoneMongo> greenZones);
    Task<long> CountAsync();
}

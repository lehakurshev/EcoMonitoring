using EcoMonitoringBack.Interfaces;
using EcoMonitoringBack.Repositories;
using EcoMonitoringBack.Services;

namespace EcoMonitoringBack;

public static class DependencyInjection
{
    public static IServiceCollection AddInjection(
        this IServiceCollection services)
    {
        
        services.AddScoped<IServiceMigrationContainer, ServiceMigrationContainer>();
        services.AddScoped<IServiceContainers, ServiceContainers>();
        services.AddScoped<IRepositoryContainers, RepositoryContainers>();
        services.AddScoped<IRepositoryContainerMigration, RepositoryContainerMigration>();
        return services;
    }
}
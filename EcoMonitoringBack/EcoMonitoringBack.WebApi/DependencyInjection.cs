using EcoMonitoringBack.Interfaces;
using EcoMonitoringBack.Repositories;
using EcoMonitoringBack.Services;

namespace EcoMonitoringBack;

public static class DependencyInjection
{
    public static IServiceCollection AddInjection(
        this IServiceCollection services)
    {
        services.AddScoped<IGreenZoneService, GreenZoneServiceService>();
        services.AddScoped<IServiceMigrationContainer, ServiceMigrationContainer>();
        services.AddScoped<IServiceContainers, ServiceContainers>();
        services.AddScoped<IServiceReviews, ServiceReviews>();
        services.AddScoped<IRepositoryContainers, RepositoryContainers>();
        services.AddScoped<IRepositoryContainerMigration, RepositoryContainerMigration>();
        services.AddScoped<IRepositoryReviews, RepositoryReviews>();
        services.AddScoped<IRepositoryGreenZones, RepositoryGreenZones>();
        return services;
    }
}
using Domain.Contracts;
using Microsoft.Extensions.DependencyInjection;

namespace Domain;

public static class DomainModule
{
    public static IServiceCollection AddDomain(this IServiceCollection services)
    {
        services.AddScoped<IGreenZoneService, GreenZoneServiceService>();
        services.AddScoped<IServiceMigrationContainer, ServiceMigrationContainer>();
        services.AddScoped<IServiceContainers, ServiceContainers>();
        return services;
    }
}
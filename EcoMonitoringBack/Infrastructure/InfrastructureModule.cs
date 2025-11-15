using Infrastructure.Contracts;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure;

public static class InfrastructureModule
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        services.AddScoped<IRepositoryContainers, RepositoryContainers>();
        services.AddScoped<IRepositoryContainerMigration, RepositoryContainerMigration>();
        return services;
    }
}
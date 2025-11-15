using Microsoft.AspNetCore.Http;

namespace Domain.Contracts;

public interface IServiceMigrationContainer
{
    Task StartMigrationAsync(IFormFile file);
}
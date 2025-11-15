using Domain.Contracts;
using DomainModels;
using Infrastructure.Contracts;
using Microsoft.AspNetCore.Http;
using OfficeOpenXml;

namespace Domain;

public class ServiceMigrationContainer : IServiceMigrationContainer
{
    private readonly IRepositoryContainerMigration _repositoryContainerMigration;
    
    public ServiceMigrationContainer(IRepositoryContainerMigration repositoryContainerMigration)
    {
        _repositoryContainerMigration = repositoryContainerMigration;
    }
    
    public async Task StartMigrationAsync(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            throw new ArgumentException("File is required");
        }
        ExcelPackage.License.SetNonCommercialOrganization("My Noncommercial organization");
        string tempPath = Path.Combine( Guid.NewGuid().ToString() + ".xlsx");

        try
        {
            using (var stream = new FileStream(tempPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            var containerInfo = GetContainersInfoFromTable(tempPath);
            await _repositoryContainerMigration.MakeMigrationAsync(containerInfo);
        }
        finally
        {
            // Очистка временного файла
            if (File.Exists(tempPath))
            {
                File.Delete(tempPath);
            }
        }
    }

    private List<ContainerInfo> GetContainersInfoFromTable(string tempPath)
    {
        
        using var package = new ExcelPackage(new FileInfo(tempPath));

        if (package.Workbook.Worksheets.Count == 0)
            throw new InvalidOperationException("Файл не содержит рабочих листов");
        
        var worksheet = package.Workbook.Worksheets[0];
        
        if (worksheet.Dimension == null)
            throw new InvalidDataException("Рабочий лист пуст");
        var result = new List<ContainerInfo>();
        for (int row = 8; row <= worksheet.Dimension.Rows; row++)
        {
            
            var settlement = worksheet.Cells[row, 29].Value?.ToString() ?? "";
            var district = worksheet.Cells[row, 30].Value?.ToString() ?? "";
            var street = worksheet.Cells[row, 31].Value?.ToString() ?? "";
            var house = worksheet.Cells[row, 32].Value?.ToString() ?? "";
            
            if (settlement == "" || district == "" || street == "" || house == "")
                continue;

            double latitude = 0.0;
            var a = worksheet.Cells[row, 33].Value?.ToString() ?? "";
            var parsed = Double.TryParse(a.Replace('.', ','), out latitude);
            if (!parsed)
                throw new InvalidOperationException("Файл не содержит рабочих листов");
            double longitude = 0.0;
            a = worksheet.Cells[row, 34].Value?.ToString() ?? "";
            parsed = Double.TryParse(a.Replace('.', ','), out longitude);
            if (!parsed)
                throw new InvalidOperationException("Файл не содержит рабочих листов");


            var address = new Address(settlement, district, street, house);
            var coordinates = new Point(latitude, longitude);
            result.Add(new ContainerInfo(new List<WasteType>(), coordinates, address));
        }

        return result;
    }
}
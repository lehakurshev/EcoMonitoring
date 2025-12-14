using EcoMonitoringBack.Interfaces;
using EcoMonitoringBack.Models.Common;
using EcoMonitoringBack.Models.Container;
using EcoMonitoringBack.Models.GreenZones;
using OfficeOpenXml;
using System.Text.Json;

namespace EcoMonitoringBack.Services;

public class ServiceMigrationContainer(
    IRepositoryContainerMigration repositoryContainerMigration,
    IRepositoryGreenZones repositoryGreenZones)
    : IServiceMigrationContainer
{
    public async Task StartMigrationAsync(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            throw new ArgumentException("File is required");
        }
        ExcelPackage.License.SetNonCommercialOrganization("My Noncommercial organization");
        string tempPath = Path.Combine( Guid.NewGuid() + ".xlsx");

        try
        {
            await using (var stream = new FileStream(tempPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            var containerInfo = GetContainersInfoFromTable(tempPath);
            await repositoryContainerMigration.MakeMigrationAsync(containerInfo);
        }
        finally
        {
            if (File.Exists(tempPath))
            {
                File.Delete(tempPath);
            }
        }
    }

    private static List<ContainerInfo> GetContainersInfoFromTable(string tempPath)
    {
        
        using var package = new ExcelPackage(new FileInfo(tempPath));

        if (package.Workbook.Worksheets.Count == 0)
            throw new InvalidOperationException("Файл не содержит рабочих листов");
        
        var worksheet = package.Workbook.Worksheets[0];
        
        if (worksheet.Dimension == null)
            throw new InvalidDataException("Рабочий лист пуст");
        var result = new List<ContainerInfo>();
        for (var row = 8; row <= worksheet.Dimension.Rows; row++)
        {
            
            var settlement = worksheet.Cells[row, 29].Value?.ToString() ?? "";
            var district = worksheet.Cells[row, 30].Value?.ToString() ?? "";
            var street = worksheet.Cells[row, 31].Value?.ToString() ?? "";
            var house = worksheet.Cells[row, 32].Value?.ToString() ?? "";
            
            if (settlement == "" || district == "" || street == "" || house == "")
                continue;

            double latitude;
            var latValue = worksheet.Cells[row, 33].Value;
            if (latValue is double latDouble)
            {
                latitude = latDouble;
            }
            else if (latValue != null)
            {
                var latStr = latValue.ToString() ?? "";
                if (!Double.TryParse(latStr, System.Globalization.NumberStyles.Float, System.Globalization.CultureInfo.InvariantCulture, out latitude))
                {
                    if (!Double.TryParse(latStr.Replace('.', ','), out latitude))
                        throw new InvalidOperationException($"Не удалось распарсить широту: {latStr}");
                }
            }
            else
            {
                throw new InvalidOperationException("Широта отсутствует");
            }

            double longitude;
            var lonValue = worksheet.Cells[row, 34].Value;
            if (lonValue is double lonDouble)
            {
                longitude = lonDouble;
            }
            else if (lonValue != null)
            {
                var lonStr = lonValue.ToString() ?? "";
                if (!Double.TryParse(lonStr, System.Globalization.NumberStyles.Float, System.Globalization.CultureInfo.InvariantCulture, out longitude))
                {
                    if (!Double.TryParse(lonStr.Replace('.', ','), out longitude))
                        throw new InvalidOperationException($"Не удалось распарсить долготу: {lonStr}");
                }
            }
            else
            {
                throw new InvalidOperationException("Долгота отсутствует");
            }

            var address = new Address(settlement, district, street, house);
            var coordinates = new Point(latitude, longitude);
            result.Add(new ContainerInfo([], coordinates, address));
        }

        return result;
    }

    public async Task MigrateGreenZonesAsync()
    {
        var possiblePaths = new[]
        {
            Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "export.geojson"),
            Path.Combine(Directory.GetCurrentDirectory(), "export.geojson"),
            "export.geojson"
        };

        var geojsonPath = possiblePaths.FirstOrDefault(File.Exists);

        if (geojsonPath == null)
        {
            throw new FileNotFoundException($"GeoJSON file not found. Searched in: {string.Join(", ", possiblePaths)}");
        }

        var jsonString = await File.ReadAllTextAsync(geojsonPath);
        var geoJsonDoc = JsonDocument.Parse(jsonString);

        var greenZones = new List<GreenZoneMongo>();
        var features = geoJsonDoc.RootElement.GetProperty("features");

        foreach (var feature in features.EnumerateArray())
        {
            var properties = feature.GetProperty("properties");
            
            var type = GetPropertyValue(properties, "leisure") 
                      ?? GetPropertyValue(properties, "landuse") 
                      ?? GetPropertyValue(properties, "natural");

            if (type == null) continue;

            var geometry = feature.GetProperty("geometry");
            var geometryType = geometry.GetProperty("type").GetString();

            if (geometryType != "Polygon") continue;

            var coordinates = geometry.GetProperty("coordinates")[0];
            var points = (from coord
                in coordinates.EnumerateArray()
                let lon = coord[0].GetDouble()
                let lat = coord[1].GetDouble()
                select new Point(lat, lon)).ToList();

            if (points.Count < 4) continue;

            var greenZone = new GreenZoneMongo
            {
                Name = GetPropertyValue(properties, "name") ?? GetPropertyValue(properties, "name:ru"),
                Type = type,
                Subtype = GetPropertyValue(properties, "park_type") ?? GetPropertyValue(properties, "wood_type"),
                Coordinates = points,
                Properties = ExtractProperties(properties)
            };

            greenZones.Add(greenZone);
        }

        await repositoryGreenZones.CreateManyAsync(greenZones);
    }

    private static string GetPropertyValue(JsonElement properties, string key)
    {
        return properties.TryGetProperty(key, out var value) ? value.GetString() : null;
    }

    private static Dictionary<string, object> ExtractProperties(JsonElement properties)
    {
        var dict = new Dictionary<string, object>();
        foreach (var prop in properties.EnumerateObject())
        {
            dict[prop.Name] = prop.Value.ToString();
        }
        return dict;
    }
}
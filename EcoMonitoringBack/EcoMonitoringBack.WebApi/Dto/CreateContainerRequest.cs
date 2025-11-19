namespace EcoMonitoringBack.Dto;

public record CreateContainerRequest(
    int[] WasteTypes,
    double Latitude,
    double Longitude,
    string Settlement,
    string District,
    string Street,
    string House
);

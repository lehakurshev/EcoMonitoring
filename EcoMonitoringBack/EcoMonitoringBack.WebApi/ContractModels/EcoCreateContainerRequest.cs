namespace EcoMonitoringBack.ContractModels;

public record EcoCreateContainerRequest(
    int[] WasteTypes,
    double Latitude,
    double Longitude,
    string Settlement,
    string District,
    string Street,
    string House
);
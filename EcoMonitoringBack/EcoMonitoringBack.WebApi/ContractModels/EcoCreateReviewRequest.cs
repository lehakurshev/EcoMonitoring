namespace EcoMonitoringBack.ContractModels;

public record EcoCreateReviewRequest(string AuthorName, int Rating, string Comment);
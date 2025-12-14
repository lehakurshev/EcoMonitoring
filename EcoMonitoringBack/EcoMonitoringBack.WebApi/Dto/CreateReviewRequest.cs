namespace EcoMonitoringBack.Dto;

public record CreateReviewRequest(string AuthorName, int Rating, string Comment);

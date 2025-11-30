FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["EcoMonitoringBack.WebApi/EcoMonitoringBack.WebApi.csproj", "EcoMonitoringBack.WebApi/"]
RUN dotnet restore "EcoMonitoringBack.WebApi/EcoMonitoringBack.WebApi.csproj"
COPY . .
WORKDIR "/src/EcoMonitoringBack.WebApi"
RUN dotnet build "EcoMonitoringBack.WebApi.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "EcoMonitoringBack.WebApi.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
# Copy all files from source directory
COPY --from=build /src/EcoMonitoringBack.WebApi/ ./
ENTRYPOINT ["dotnet", "EcoMonitoringBack.WebApi.dll"]

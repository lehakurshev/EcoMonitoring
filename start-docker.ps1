Write-Host "Запуск EcoMonitoring..." -ForegroundColor Green

if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "Docker не найден. Установите Docker Desktop." -ForegroundColor Red
    exit 1
}

docker info > $null 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker не запущен. Запустите Docker Desktop." -ForegroundColor Red
    exit 1
}

Write-Host "Docker найден и запущен" -ForegroundColor Green

Write-Host "Остановка старых контейнеров..." -ForegroundColor Yellow
docker-compose down

Write-Host "Сборка и запуск контейнеров..." -ForegroundColor Yellow
docker-compose up -d --build

Write-Host ""
Write-Host "Ожидание запуска сервисов..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

docker-compose ps

Write-Host ""
Write-Host "EcoMonitoring запущен!" -ForegroundColor Green
Write-Host ""
Write-Host "Доступные сервисы:" -ForegroundColor Cyan
Write-Host "   Фронтенд:  http://localhost:3000" -ForegroundColor White
Write-Host "   Бэкенд:    http://localhost:5101/api" -ForegroundColor White
Write-Host "   MongoDB:   localhost:27017" -ForegroundColor White
Write-Host ""
Write-Host "Полезные команды:" -ForegroundColor Cyan
Write-Host "   Логи:      docker-compose logs -f" -ForegroundColor White
Write-Host "   Остановка: docker-compose stop" -ForegroundColor White
Write-Host "   Удаление:  docker-compose down" -ForegroundColor White
Write-Host ""

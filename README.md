# EcoMonitoring

Система мониторинга экологической обстановки и контейнеров для сбора отходов.

## Быстрый старт с Docker

### Требования
- Docker Desktop для Windows

### Запуск проекта

1. Скопируйте файл с переменными окружения и установите пароль для MongoDB:
   ```powershell
   Copy-Item .env.example .env
   # Откройте .env и измените MONGODB_PASSWORD на сильный пароль
   ```

2. Убедитесь, что Docker Desktop запущен

3. Запустите проект одной командой:
   ```powershell
   .\start-docker.ps1
   ```

   Или вручную:
   ```powershell
   docker-compose up -d --build
   ```

4. Откройте браузер:
   - Фронтенд: http://localhost:3000
   - Бэкенд API: http://localhost:5101/api

### Остановка
```powershell
.\stop-docker.ps1
```

Или:
```powershell
docker-compose down
```

Подробная инструкция: [DOCKER_README.md](DOCKER_README.md)

---

## Локальная разработка (без Docker)

### Требования
- .NET 8 SDK
- Node.js 22+
- MongoDB

### Backend

```powershell
cd EcoMonitoringBack\EcoMonitoringBack.WebApi
dotnet run
```

API будет доступен на http://localhost:5101

### Frontend

```powershell
cd react-app
npm install
npm run dev
```

Приложение будет доступно на http://localhost:5173

### MongoDB

Запустить только MongoDB в Docker:
```powershell
docker-compose up -d mongodb
```

---

## Структура проекта

- `EcoMonitoringBack/` - .NET 8 WebAPI бэкенд
- `react-app/` - React + TypeScript фронтенд
- `docker-compose.yml` - конфигурация Docker Compose

## Полезные команды

### Docker
```powershell
# Просмотр логов
docker-compose logs -f

# Логи конкретного сервиса
docker-compose logs -f backend
docker-compose logs -f frontend

# Перезапуск сервиса
docker-compose restart backend

# Очистка и пересборка
docker-compose down -v
docker-compose up -d --build
```

### Backend
```powershell
cd EcoMonitoringBack\EcoMonitoringBack.WebApi

# Запуск
dotnet run

# Сборка
dotnet build

# Тесты
dotnet test
```

### Frontend
```powershell
cd react-app

# Разработка
npm run dev

# Сборка
npm run build

# Линтинг
npm run lint
```

## Endpoints

### Containers
- `GET /api/containers` - Получить все контейнеры
- `GET /api/containers/area` - Контейнеры в области
- `GET /api/containers/{id}` - Контейнер по ID
- `POST /api/containers` - Создать контейнер
- `GET /api/containers/{id}/reviews` - Отзывы контейнера
- `POST /api/containers/{id}/reviews` - Добавить отзыв

### Green Zones
- `GET /api/greenzones/area` - Зеленые зоны в области
- `POST /api/greenzones/analyze-polygons` - Анализ полигонов

## Лицензия

MIT

# EcoMonitoring
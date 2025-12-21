#!/bin/bash
set -e

PROJECT_DIR="$1"

echo "🚀 Начало деплоя..."
cd "$PROJECT_DIR"

echo "📦 Обновление репозитория..."
git fetch origin
git reset --hard origin/main

echo "🛑 Остановка старых контейнеров..."
docker-compose down || true

echo "🔨 Сборка и запуск контейнеров..."
docker-compose up -d --build

echo "⏳ Проверка контейнеров..."
docker-compose ps

echo "✅ Деплой завершён успешно!"

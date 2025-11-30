#!/bin/bash

echo -e "\033[0;32mЗапуск EcoMonitoring...\033[0m"

if ! command -v docker &> /dev/null; then
    echo -e "\033[0;31mDocker не найден. Установите Docker.\033[0m"
    exit 1
fi

if ! docker info > /dev/null 2>&1; then
    echo -e "\033[0;31mDocker не запущен. Запустите Docker.\033[0m"
    exit 1
fi

echo -e "\033[0;32mDocker найден и запущен\033[0m"

echo -e "\033[0;33mОстановка старых контейнеров...\033[0m"
docker-compose down

echo -e "\033[0;33mСборка и запуск контейнеров...\033[0m"
docker-compose up -d --build

echo ""
echo -e "\033[0;33mОжидание запуска сервисов...\033[0m"
sleep 5

docker-compose ps

echo ""
echo -e "\033[0;32mEcoMonitoring запущен!\033[0m"
echo ""
echo -e "\033[0;36mДоступные сервисы:\033[0m"
echo -e "\033[0;37m   Фронтенд:  http://localhost:3000\033[0m"
echo -e "\033[0;37m   Бэкенд:    http://localhost:5101/api\033[0m"
echo -e "\033[0;37m   MongoDB:   localhost:27017\033[0m"
echo ""
echo -e "\033[0;36mПолезные команды:\033[0m"
echo -e "\033[0;37m   Логи:      docker-compose logs -f\033[0m"
echo -e "\033[0;37m   Остановка: docker-compose stop\033[0m"
echo -e "\033[0;37m   Удаление:  docker-compose down\033[0m"
echo ""

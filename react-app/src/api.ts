import type { ContainerInfo, ContainerReview, CreateReviewRequest, CreateContainerRequest, GreenZone } from './types';
import { logger } from './utils/logger';

const API_BASE_URL = import.meta.env.PROD ? '/api' : 'http://localhost:5101/api';

export async function getAllContainers(): Promise<ContainerInfo[]> {
    logger.info('API: Запрос всех контейнеров');
    try {
        const response = await fetch(`${API_BASE_URL}/containers`);
        
        if (!response.ok) {
            logger.error('API: Ошибка получения контейнеров', { status: response.status });
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        logger.info('API: Получено контейнеров', { count: data.length });
        return data;
    } catch (error) {
        logger.error('API: Ошибка при запросе контейнеров', error);
        throw error;
    }
}

export async function getContainersInArea(
    topLeftLat: number,
    topLeftLng: number,
    bottomRightLat: number,
    bottomRightLng: number
): Promise<ContainerInfo[]> {
    logger.info('API: Запрос контейнеров в области', { topLeftLat, topLeftLng, bottomRightLat, bottomRightLng });
    try {
        const params = new URLSearchParams({
            topLeftLat: topLeftLat.toString(),
            topLeftLng: topLeftLng.toString(),
            bottomRightLat: bottomRightLat.toString(),
            bottomRightLng: bottomRightLng.toString()
        });
        
        const response = await fetch(`${API_BASE_URL}/containers/area?${params}`);
        
        if (!response.ok) {
            logger.error('API: Ошибка получения контейнеров в области', { status: response.status });
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        logger.info('API: Получено контейнеров в области', { count: data.length });
        return data;
    } catch (error) {
        logger.error('API: Ошибка при запросе контейнеров в области', error);
        throw error;
    }
}

export async function getContainerById(id: string): Promise<ContainerInfo> {
    logger.info('API: Запрос контейнера по ID', { id });
    try {
        const response = await fetch(`${API_BASE_URL}/containers/${id}`);
        
        if (!response.ok) {
            logger.error('API: Ошибка получения контейнера', { id, status: response.status });
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        logger.info('API: Контейнер получен', { id });
        return data;
    } catch (error) {
        logger.error('API: Ошибка при запросе контейнера', error);
        throw error;
    }
}

export async function getContainerReviews(containerId: string): Promise<ContainerReview[]> {
    logger.info('API: Запрос отзывов контейнера', { containerId });
    try {
        const response = await fetch(`${API_BASE_URL}/containers/${containerId}/reviews`);
        
        if (!response.ok) {
            logger.error('API: Ошибка получения отзывов', { containerId, status: response.status });
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        logger.info('API: Получено отзывов', { containerId, count: data.length });
        return data;
    } catch (error) {
        logger.error('API: Ошибка при запросе отзывов', error);
        throw error;
    }
}

export async function createContainerReview(
    containerId: string,
    review: CreateReviewRequest
): Promise<ContainerReview> {
    logger.info('API: Создание отзыва', { containerId, rating: review.rating });
    try {
        const response = await fetch(`${API_BASE_URL}/containers/${containerId}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(review),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            logger.error('API: Ошибка создания отзыва', { containerId, status: response.status, error: errorData });
            throw new Error(errorData.error || `Ошибка HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        logger.info('API: Отзыв успешно создан', { containerId });
        return data;
    } catch (error) {
        logger.error('API: Ошибка при создании отзыва', error);
        throw error;
    }
}

export async function createContainer(container: CreateContainerRequest): Promise<ContainerInfo> {
    logger.info('API: Создание контейнера', { latitude: container.latitude, longitude: container.longitude });
    try {
        const response = await fetch(`${API_BASE_URL}/containers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(container),
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: `Ошибка HTTP: ${response.status}` }));
            logger.error('API: Ошибка создания контейнера', { status: response.status, error: errorData });
            throw new Error(errorData.error || `Ошибка HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        logger.info('API: Контейнер успешно создан', { id: data.id });
        return data;
    } catch (error) {
        logger.error('API: Ошибка при создании контейнера', error);
        throw error;
    }
}

export async function getGreenZonesInArea(
    minLat: number,
    maxLat: number,
    minLon: number,
    maxLon: number
): Promise<GreenZone[]> {
    logger.info('API: Запрос зеленых зон', { minLat, maxLat, minLon, maxLon });
    try {
        const params = new URLSearchParams({
            minLat: minLat.toString(),
            maxLat: maxLat.toString(),
            minLon: minLon.toString(),
            maxLon: maxLon.toString()
        });
        
        const response = await fetch(`${API_BASE_URL}/greenzones/area?${params}`);
        
        if (!response.ok) {
            logger.error('API: Ошибка получения зеленых зон', { status: response.status });
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        logger.info('API: Получено зеленых зон', { count: data.length });
        return data;
    } catch (error) {
        logger.error('API: Ошибка при запросе зеленых зон', error);
        throw error;
    }
}

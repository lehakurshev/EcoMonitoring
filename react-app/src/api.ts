import type {
    AirQualityData,
    ContainerInfo,
    ContainerReview,
    CreateContainerRequest,
    CreateReviewRequest,
    GreenZonePoint,
    Point
} from './types';
import {logger} from './utils/logger';

const API_BASE_URL = import.meta.env.PROD ? '/api' : 'http://localhost:5101/api';

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
            return [];
        }

        const data = await response.json();
        logger.info('API: Получено контейнеров в области', { count: data.length });
        return data;
    } catch (error) {
        logger.error('API: Ошибка при запросе контейнеров в области', error);
        return [];
    }
}

export async function getContainerReviews(containerId: string): Promise<ContainerReview[]> {
    logger.info('API: Запрос отзывов контейнера', { containerId });
    try {
        const response = await fetch(`${API_BASE_URL}/containers/${containerId}/reviews`);

        if (!response.ok) {
            logger.error('API: Ошибка получения отзывов', { containerId, status: response.status });
            return [];
        }

        const data = await response.json();
        logger.info('API: Получено отзывов', { containerId, count: data.length });
        return data;
    } catch (error) {
        logger.error('API: Ошибка при запросе отзывов', error);
        return [];
    }
}

export async function createContainerReview(
    containerId: string,
    review: CreateReviewRequest
): Promise<ContainerReview> {
    logger.info('API: Создание отзыва', { containerId, rating: review.rating });
    const response = await fetch(`${API_BASE_URL}/containers/${containerId}/reviews`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(review),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `Ошибка HTTP: ${response.status}` }));
        logger.error('API: Ошибка создания отзыва', { containerId, status: response.status, error: errorData });
        throw new Error(errorData.error || `Ошибка HTTP: ${response.status}`);
    }

    const data = await response.json();
    logger.info('API: Отзыв успешно создан', { containerId });
    return data;
}

export async function createContainer(container: CreateContainerRequest): Promise<ContainerInfo> {
    logger.info('API: Создание контейнера', { latitude: container.latitude, longitude: container.longitude });
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
}

export interface GreenZoneAreaAndCenter {
    center: Point;
    area: number;
}

export function adaptToGreenZonePoint(backendData: GreenZoneAreaAndCenter): GreenZonePoint {
    return {
        coordinates: backendData.center,
        radius: 10000 * backendData.area
    };
}

export async function getGreenZonesPointsAndAreaInArea(
    minLat: number,
    maxLat: number,
    minLon: number,
    maxLon: number
): Promise<GreenZonePoint[]> {
    const forMap = await getGreenZonesPointsAndAreaInAreaResponse(minLat, maxLat, minLon, maxLon);
    return forMap.map(g => adaptToGreenZonePoint(g))
}

export async function getGreenZonesPointsAndAreaInAreaResponse(
    minLat: number,
    maxLat: number,
    minLon: number,
    maxLon: number
): Promise<GreenZoneAreaAndCenter[]> {
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
            return [];
        }

        return await response.json();
    } catch (error) {
        logger.error('Ошибка при получении зеленых зон:', error);
        return [];
    }
}

export async function uploadAirQualityData(data: AirQualityData[]): Promise<void> {
    logger.info('API: Загрузка данных о качестве воздуха', { count: data.length });
    
    try {
        const response = await fetch(`${API_BASE_URL}/airquality/upload`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Неизвестная ошибка' }));
            logger.error('API: Ошибка загрузки данных о качестве воздуха', { status: response.status, error: errorData });
            throw new Error(errorData.error || `Ошибка HTTP: ${response.status}`);
        }

        logger.info('API: Данные о качестве воздуха успешно загружены');
    } catch (error) {
        logger.error('API: Ошибка при загрузке данных о качестве воздуха', error);
        throw error;
    }
}

export async function getAirQualityData(): Promise<AirQualityData[]> {
    logger.info('API: Запрос данных о качестве воздуха');
    
    try {
        const response = await fetch(`${API_BASE_URL}/airquality`);

        if (!response.ok) {
            logger.error('API: Ошибка получения данных о качестве воздуха', { status: response.status });
            return [];
        }

        const data = await response.json();
        logger.info('API: Получено записей о качестве воздуха', { count: data.length });
        return data;
    } catch (error) {
        logger.error('API: Ошибка при запросе данных о качестве воздуха', error);
        return [];
    }
}

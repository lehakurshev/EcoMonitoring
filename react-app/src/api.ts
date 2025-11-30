import type {
    ContainerInfo,
    ContainerReview,
    CreateReviewRequest,
    CreateContainerRequest,
    GreenZone,
    GreenZonePoint, Point
} from './types';

const API_BASE_URL = import.meta.env.PROD ? '/api' : 'http://localhost:5101/api';

export async function getAllContainers(): Promise<ContainerInfo[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/containers`);
        
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

export async function getContainersInArea(
    topLeftLat: number,
    topLeftLng: number,
    bottomRightLat: number,
    bottomRightLng: number
): Promise<ContainerInfo[]> {
    try {
        const params = new URLSearchParams({
            topLeftLat: topLeftLat.toString(),
            topLeftLng: topLeftLng.toString(),
            bottomRightLat: bottomRightLat.toString(),
            bottomRightLng: bottomRightLng.toString()
        });
        
        const response = await fetch(`${API_BASE_URL}/containers/area?${params}`);
        
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

export async function getContainerById(id: string): Promise<ContainerInfo> {
    try {
        const response = await fetch(`${API_BASE_URL}/containers/${id}`);
        
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

export async function getContainerReviews(containerId: string): Promise<ContainerReview[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/containers/${containerId}/reviews`);
        
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

export async function createContainerReview(
    containerId: string,
    review: CreateReviewRequest
): Promise<ContainerReview> {
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
            throw new Error(errorData.error || `Ошибка HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

export async function createContainer(container: CreateContainerRequest): Promise<ContainerInfo> {
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
            throw new Error(errorData.error || `Ошибка HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

export async function getGreenZonesInArea(
    minLat: number,
    maxLat: number,
    minLon: number,
    maxLon: number
): Promise<GreenZone[]> {
    try {
        const params = new URLSearchParams({
            minLat: minLat.toString(),
            maxLat: maxLat.toString(),
            minLon: minLon.toString(),
            maxLon: maxLon.toString()
        });
        
        const response = await fetch(`${API_BASE_URL}/greenzones/area?${params}`);
        
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

export interface GreenZoneAreaAndCenter {
    center: Point;
    areaHectares: number;
}

// Функция преобразования
export function adaptToGreenZonePoint(backendData: GreenZoneAreaAndCenter): GreenZonePoint {
    return {
        coordinates: backendData.center,
        radius: backendData.areaHectares
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

        const response = await fetch(`${API_BASE_URL}/api/greenzones/area/points?${params}`);

        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Ошибка при получении зеленых зон:', error);
        throw error;
    }
}

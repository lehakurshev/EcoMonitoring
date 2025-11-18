import type { ContainerInfo, ContainerReview, CreateReviewRequest } from './types';

const API_BASE_URL = 'http://localhost:5101';

export async function getAllContainers(): Promise<ContainerInfo[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/containers`);
        
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Ошибка при получении контейнеров:', error);
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
        console.error('Ошибка при получении контейнеров в области:', error);
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
        console.error(`Ошибка при получении контейнера ${id}:`, error);
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
        console.error(`Ошибка при получении отзывов для контейнера ${containerId}:`, error);
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
        console.error(`Ошибка при создании отзыва для контейнера ${containerId}:`, error);
        throw error;
    }
}

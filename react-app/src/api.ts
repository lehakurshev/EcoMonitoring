import type { ContainerInfo } from './types';

const API_BASE_URL = 'http://localhost:5101';

/**
 * Получить все контейнеры
 */
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

/**
 * Получить контейнеры в заданной области
 * @param topLeftLat - широта верхнего левого угла
 * @param topLeftLng - долгота верхнего левого угла
 * @param bottomRightLat - широта нижнего правого угла
 * @param bottomRightLng - долгота нижнего правого угла
 */
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

/**
 * Получить контейнер по ID
 * @param id - идентификатор контейнера
 */
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

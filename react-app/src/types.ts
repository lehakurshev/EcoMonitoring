export const WasteType = {
    Plastic: 0,
    Glass: 1,
    Paper: 2,
    Metal: 3,
    Organic: 4,
    Batteries: 5,
    Electronics: 6,
    Clothes: 7,
    Hazardous: 8
} as const;

export type WasteType = typeof WasteType[keyof typeof WasteType];

export interface Address {
    settlement: string;
    district: string;
    street: string;
    house: string;
}

export interface ContainerInfo {
    id: string;
    wasteTypes: WasteType[];
    location: Point;
    address: Address;
}

export interface Bounds {
    sw: [number, number];
    ne: [number, number];
    nw: [number, number];
    se: [number, number];
}

export interface ContainerReview {
    id: string;
    containerId: string;
    authorName: string;
    rating: number;
    comment: string;
    createdAt: string;
}

export interface CreateReviewRequest {
    authorName: string;
    rating: number;
    comment?: string;
}

export interface CreateContainerRequest {
    wasteTypes: number[];
    latitude: number;
    longitude: number;
    settlement: string;
    district: string;
    street: string;
    house: string;
}

export interface Point {
    latitude: number;
    longitude: number;
}

export interface GreenZone {
    id: string;
    name?: string;
    type: string;
    subtype?: string;
    coordinates: Point[];
    properties: Record<string, any>;
}

export interface GreenZonePoint {
    radius: number;
    coordinates: Point;
}

export interface AirQualityData {
    location: Point;
    district: string;
    pm25: number;
    pm10: number;
    so2: number;
    no2: number;
    co: number;
    o3: number;
    aqi: number;
}

export function getWasteTypeName(wasteType: WasteType): string {
    const names: Record<WasteType, string> = {
        [WasteType.Plastic]: 'Пластик',
        [WasteType.Glass]: 'Стекло',
        [WasteType.Paper]: 'Бумага',
        [WasteType.Metal]: 'Металл',
        [WasteType.Organic]: 'Органика',
        [WasteType.Batteries]: 'Батарейки',
        [WasteType.Electronics]: 'Электроника',
        [WasteType.Clothes]: 'Одежда',
        [WasteType.Hazardous]: 'Опасные отходы'
    };
    return names[wasteType] || 'Неизвестно';
}

export function getContainerColor(_wasteTypes: WasteType[]): string {
    return '#757575';
}

export function getWasteTypeColor(wasteType: WasteType): string {
    const colors: Record<WasteType, string> = {
        [WasteType.Hazardous]: '#D32F2F',
        [WasteType.Batteries]: '#F57C00',
        [WasteType.Electronics]: '#1976D2',
        [WasteType.Glass]: '#00897B',
        [WasteType.Plastic]: '#F9A825',
        [WasteType.Paper]: '#0288D1',
        [WasteType.Metal]: '#455A64',
        [WasteType.Organic]: '#689F38',
        [WasteType.Clothes]: '#8E24AA'
    };
    return colors[wasteType] || '#757575';
}

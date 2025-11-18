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
    location: {
        type: string | number;
        coordinates: [number, number] | { x: number; y: number; values?: number[] };
    };
    address: Address;
}

export interface Bounds {
    sw: [number, number];
    ne: [number, number];
    nw: [number, number];
    se: [number, number];
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

export function getContainerColor(wasteTypes: WasteType[]): string {
    if (wasteTypes.length === 0) return '#757575';

    if (wasteTypes.includes(WasteType.Hazardous)) return '#D32F2F';
    if (wasteTypes.includes(WasteType.Batteries)) return '#F57C00';
    if (wasteTypes.includes(WasteType.Electronics)) return '#1976D2';
    if (wasteTypes.includes(WasteType.Glass)) return '#00897B';
    if (wasteTypes.includes(WasteType.Plastic)) return '#FBC02D';
    if (wasteTypes.includes(WasteType.Paper)) return '#0288D1';
    if (wasteTypes.includes(WasteType.Metal)) return '#455A64';
    if (wasteTypes.includes(WasteType.Organic)) return '#689F38';
    if (wasteTypes.includes(WasteType.Clothes)) return '#8E24AA';

    return '#757575';
}

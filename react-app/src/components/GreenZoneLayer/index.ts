import {GreenZonePoint} from "../../types.ts";

export { GreenZoneLayer } from './GreenZoneLayer';

// Функция создания облака точек с адаптивной плотностью
export function createPointCloud(zone: GreenZonePoint, config: any) {
    const centerLng = zone.coordinates[0]?.longitude || 0;
    const centerLat = zone.coordinates[0]?.latitude || 0;
    const radius = zone.radius || config.baseRadius;

    const points = [];
    const pointsCount = config.pointDensity;
    const maxDistanceDegrees = radius / 111000; // радиус в градусах

    // 1. Центральная точка с усиленным весом
    points.push({
        type: 'Feature',
        properties: {
            weight: 2.0, // усиленный вес в центре
            originalRadius: radius
        },
        geometry: {
            type: 'Point',
            coordinates: [centerLng, centerLat]
        }
    });

    // 2. Стратегии распределения точек по зонам
    const distributionStrategies = [
        // Ядро - 40% точек, высокий вес
        { count: Math.floor(pointsCount * 0.4), maxDist: maxDistanceDegrees * 0.2, baseWeight: 1.2 },
        // Средняя зона - 35% точек, средний вес
        { count: Math.floor(pointsCount * 0.35), maxDist: maxDistanceDegrees * 0.5, baseWeight: 0.8 },
        // Внешняя зона - 25% точек, низкий вес
        { count: Math.floor(pointsCount * 0.25), maxDist: maxDistanceDegrees, baseWeight: 0.4 }
    ];

    distributionStrategies.forEach((strategy, zoneIndex) => {
        for (let i = 0; i < strategy.count; i++) {
            const angle = Math.random() * 2 * Math.PI;

            // Гауссово распределение для более естественного скопления в центре
            const gaussianDistance = () => {
                let u = 0, v = 0;
                while(u === 0) u = Math.random();
                while(v === 0) v = Math.random();
                return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
            };

            const distance = Math.abs(gaussianDistance()) * strategy.maxDist * 0.5;
            const clampedDistance = Math.min(distance, strategy.maxDist);

            // Вес уменьшается от центра и зависит от зоны
            const distanceFactor = 1 - (clampedDistance / strategy.maxDist);
            const weight = strategy.baseWeight * distanceFactor;

            points.push({
                type: 'Feature',
                properties: {
                    weight: weight,
                    originalRadius: radius,
                    zone: zoneIndex
                },
                geometry: {
                    type: 'Point',
                    coordinates: [
                        centerLng + Math.cos(angle) * clampedDistance,
                        centerLat + Math.sin(angle) * clampedDistance
                    ]
                }
            });
        }
    });

    return points;
}


const exampleZones: any[] = [
    { radius: 2, coordinates: [{ longitude: 37.61, latitude: 55.75 }] },    // Маленький (слой 1)
    { radius: 8, coordinates: [{ longitude: 37.62, latitude: 55.76 }] },    // Средний (слой 2)
    { radius: 50, coordinates: [{ longitude: 37.63, latitude: 55.77 }] },   // Большой (слой 3)
    { radius: 200, coordinates: [{ longitude: 37.64, latitude: 55.78 }] },  // Очень большой (слой 4)
    { radius: 1000, coordinates: [{ longitude: 37.65, latitude: 55.79 }] }, // Огромный (слой 5)
    { radius: 5000, coordinates: [{ longitude: 37.66, latitude: 55.80 }] }, // Гигантский (слой 6)
];

// В компоненте:
//<GreenZoneLayer greenZones={exampleZones} />
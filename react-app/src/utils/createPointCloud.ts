import {GreenZonePoint} from "../types.ts";

export interface LayerConfig {
    id: string;
    minRadius: number;
    maxRadius: number;
    baseRadius: number;
    heatmapRadius: number;
    colorIntensity: number;
    pointDensity: number;
}

export function createPointCloud(zone: GreenZonePoint, config: LayerConfig) {
    const centerLng = zone.coordinates.longitude || 0;
    const centerLat = zone.coordinates.latitude || 0;
    const radius = zone.radius || config.baseRadius;

    const points = [];
    const pointsCount = config.pointDensity;
    const maxDistanceDegrees = radius / 2200000;

    points.push({
        type: 'Feature' as const,
        properties: {
            weight: 2.0,
            originalRadius: radius
        },
        geometry: {
            type: 'Point' as const,
            coordinates: [centerLng, centerLat]
        }
    });

    const distributionStrategies = [
        { count: Math.floor(pointsCount * 0.4), maxDist: maxDistanceDegrees * 0.2, baseWeight: 1.2 },
        { count: Math.floor(pointsCount * 0.35), maxDist: maxDistanceDegrees * 0.5, baseWeight: 0.8 },
        { count: Math.floor(pointsCount * 0.25), maxDist: maxDistanceDegrees, baseWeight: 0.4 }
    ];

    distributionStrategies.forEach((strategy, zoneIndex) => {
        for (let i = 0; i < strategy.count; i++) {
            const angle = Math.random() * 2 * Math.PI;

            const gaussianDistance = () => {
                let u = 0, v = 0;
                while(u === 0) u = Math.random();
                while(v === 0) v = Math.random();
                return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
            };

            const distance = Math.abs(gaussianDistance()) * strategy.maxDist * 0.5;
            const clampedDistance = Math.min(distance, strategy.maxDist);

            const distanceFactor = 1 - (clampedDistance / strategy.maxDist);
            const weight = strategy.baseWeight * distanceFactor;

            points.push({
                type: 'Feature' as const,
                properties: {
                    weight: weight,
                    originalRadius: radius,
                    zone: zoneIndex
                },
                geometry: {
                    type: 'Point' as const,
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

import { Source, Layer } from 'react-map-gl/maplibre';
import type {GreenZonePoint} from '../../types';
import { useMemo } from 'react';
import {createPointCloud} from "./index.ts";


interface GreenZoneLayerProps {
    greenZones: GreenZonePoint[];
}

// Геометрическая прогрессия радиусов (каждый следующий ×4)
const RADIUS_LEVELS = [1, 4, 16, 64, 256, 1024, 4096];

const LAYER_CONFIGS = RADIUS_LEVELS.map((baseRadius, index) => {
    const nextRadius = RADIUS_LEVELS[index + 1] || Infinity;

    return {
        id: `radius-${baseRadius}`,
        minRadius: baseRadius,
        maxRadius: nextRadius,
        baseRadius: baseRadius,
        heatmapRadius: Math.min(150, Math.max(10, baseRadius / 3)), // адаптивный heatmap радиус
        colorIntensity: Math.min(3.0, 0.5 + (index * 0.4)), // увеличиваем интенсивность
        pointDensity: Math.min(200, Math.max(10, baseRadius / 2)) // плотность точек зависит от радиуса
    };
});



export function GreenZoneLayer({ greenZones }: GreenZoneLayerProps) {
    // Создаем точки для каждого слоя
    const layerData = useMemo(() => {
        return LAYER_CONFIGS.map(config => {
            const filteredZones = greenZones.filter(zone => {
                const radius = zone.radius || 10;
                return radius >= config.minRadius && radius < config.maxRadius;
            });

            console.log(`Слой ${config.id}: ${filteredZones.length} зон (радиусы ${config.minRadius}-${config.maxRadius})`);

            // Создаем облако точек для каждой зоны
            const features = filteredZones.flatMap(zone =>
                createPointCloud(zone, config)
            );

            return {
                config,
                data: {
                    type: 'FeatureCollection' as const,
                    features
                }
            };
        });
    }, [greenZones]);

    return (
        <>
            {layerData.map(({ config, data }) => (
                <Source key={config.id} id={config.id} type="geojson" data={data}>
                    <Layer
                        id={`heatmap-${config.id}`}
                        type="heatmap"
                        paint={{
                            'heatmap-weight': ['get', 'weight'],
                            'heatmap-radius': config.heatmapRadius,
                            'heatmap-intensity': config.colorIntensity,
                            'heatmap-color': [
                                'interpolate', ['linear'], ['heatmap-density'],
                                0, 'rgba(224, 224, 224, 0)',
                                0.1, '#E8F5E9',
                                0.2, '#A5D6A7',
                                0.4, '#66BB6A',
                                0.6, '#43A047',
                                0.8, '#2E7D32',
                                1, '#1B5E20'
                            ],
                            'heatmap-opacity': [
                                'interpolate', ['linear'], ['zoom'],
                                0, 0.3,
                                10, 0.6,
                                15, 0.8
                            ]
                        }}
                    />
                </Source>
            ))}
        </>
    );
}

import { Source, Layer } from 'react-map-gl/maplibre';
import type {GreenZonePoint} from '../../../../types.ts';
import { useMemo } from 'react';
import {createPointCloud} from "../../../../utils/createPointCloud.ts";


interface GreenZoneLayerProps {
    greenZones: GreenZonePoint[];
}

const RADIUS_LEVELS = [16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536, 131072];

const LAYER_CONFIGS = RADIUS_LEVELS.map((baseRadius, index) => {
    const nextRadius = RADIUS_LEVELS[index + 1] || Infinity;

    return {
        id: `radius-${baseRadius}`,
        minRadius: baseRadius,
        maxRadius: nextRadius,
        baseRadius: baseRadius,
        heatmapRadius: Math.min(150, Math.max(10, baseRadius / 3)),
        colorIntensity: 0.5 + (index * 0.4),
        pointDensity: baseRadius / 20000000
    };
});

export function GreenZoneLayer({ greenZones }: GreenZoneLayerProps) {
    const layerData = useMemo(() => {
        return LAYER_CONFIGS.map(config => {
            const filteredZones = greenZones.filter(zone => {
                const radius = zone.radius;
                return radius >= config.minRadius && radius < config.maxRadius;
            });

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
            {layerData.map(({ config, data }) => {
                const basePixelRadius = Math.sqrt(config.baseRadius) / 20000;

                const radiusValues = {
                    0: basePixelRadius,
                    2: basePixelRadius * 4,
                    5: basePixelRadius * 32,
                    10: basePixelRadius * 1024,
                    15: basePixelRadius * 32768,
                    20: basePixelRadius * 1048576
                };

                const intensityValues = {
                    0: 1,
                    5: 32,
                    10: 1024,
                    15: 32768,
                    20: 1048576
                };

                return (
                    <Source key={config.id} id={config.id} type="geojson" data={data}>
                        <Layer
                            id={`heatmap-${config.id}`}
                            type="heatmap"
                            paint={{
                                'heatmap-weight': ['get', 'weight'],
                                'heatmap-radius': [
                                    'interpolate', ['exponential', 2], ['zoom'],
                                    0, radiusValues[0],
                                    2, radiusValues[2],
                                    5, radiusValues[5],
                                    10, radiusValues[10],
                                    15, radiusValues[15],
                                    20, radiusValues[20]
                                ],
                                'heatmap-intensity': [
                                    'interpolate', ['exponential', 2], ['zoom'],
                                    0, intensityValues[0],
                                    5, intensityValues[5],
                                    10, intensityValues[10],
                                    15, intensityValues[15],
                                    20, intensityValues[20]
                                ],
                                'heatmap-color': [
                                    'interpolate', ['linear'], ['heatmap-density'],
                                    0, 'rgba(39,131,46,0)',
                                    0.1, 'rgba(40,136,48,0.1)',
                                    0.2, 'rgba(42,140,50,0.2)',
                                    0.4, 'rgba(44,141,51,0.42)',
                                    0.6, 'rgba(37,128,44,0.55)',
                                    0.8, 'rgba(42,141,50,0.74)',
                                    1, '#288a2d'
                                ],
                                'heatmap-opacity': [
                                    'interpolate', ['linear'], ['zoom'],
                                    0, 0.1,
                                    10, 0.7,
                                    15, 0.9
                                ]
                            }}
                        />
                    </Source>
                );
            })}
        </>
    );
}

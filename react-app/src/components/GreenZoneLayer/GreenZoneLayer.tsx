import { Source, Layer } from 'react-map-gl/maplibre';
import type { GreenZone } from '../../types';
import { useMemo } from 'react';

interface GreenZoneLayerProps {
    greenZones: GreenZone[];
}

export function GreenZoneLayer({ greenZones }: GreenZoneLayerProps) {
    const geojson = useMemo(() => ({
        type: 'FeatureCollection' as const,
        features: greenZones.map((zone) => ({
            type: 'Feature' as const,
            id: zone.id,
            properties: {
                name: zone.name || '',
                type: zone.type,
                subtype: zone.subtype || ''
            },
            geometry: {
                type: 'Polygon' as const,
                coordinates: [
                    zone.coordinates.map(point => [point.longitude, point.latitude])
                ]
            }
        }))
    }), [greenZones]);

    const pointsGeoJson = useMemo(() => ({
        type: 'FeatureCollection' as const,
        features: greenZones.flatMap((zone) => 
            zone.coordinates.map(point => ({
                type: 'Feature' as const,
                properties: {},
                geometry: {
                    type: 'Point' as const,
                    coordinates: [point.longitude, point.latitude]
                }
            }))
        )
    }), [greenZones]);

    return (
        <>
            <Layer
                id="greenzones-background"
                type="background"
                paint={{
                    'background-color': '#E0E0E0',
                    'background-opacity': 0.3
                }}
            />
            
            <Source
                id="greenzones-heatmap-points"
                type="geojson"
                data={pointsGeoJson}
            >
                <Layer
                    id="greenzones-heatmap"
                    type="heatmap"
                    paint={{
                        'heatmap-weight': 1,
                        'heatmap-intensity': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            0, 0.5,
                            15, 1.5
                        ],
                        'heatmap-color': [
                            'interpolate',
                            ['linear'],
                            ['heatmap-density'],
                            0, 'rgba(224, 224, 224, 0.3)',
                            0.1, '#E8F5E9',
                            0.3, '#A5D6A7',
                            0.5, '#66BB6A',
                            0.7, '#43A047',
                            1, '#2E7D32'
                        ],
                        'heatmap-radius': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            0, 20,
                            10, 30,
                            15, 50
                        ],
                        'heatmap-opacity': 1
                    }}
                />
            </Source>
            
            <Source
                id="greenzones"
                type="geojson"
                data={geojson}
            >
                <Layer
                    id="greenzones-fill"
                    type="fill"
                    paint={{
                        'fill-color': '#2E7D32',
                        'fill-opacity': 0.4
                    }}
                />
                <Layer
                    id="greenzones-outline"
                    type="line"
                    paint={{
                        'line-color': '#1B5E20',
                        'line-width': 1,
                        'line-opacity': 0.6
                    }}
                />
            </Source>
        </>
    );
}

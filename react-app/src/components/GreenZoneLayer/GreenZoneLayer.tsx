import { Source, Layer } from 'react-map-gl/maplibre';
import type { GreenZone } from '../../types';

interface GreenZoneLayerProps {
    greenZones: GreenZone[];
}

export function GreenZoneLayer({ greenZones }: GreenZoneLayerProps) {
    const geojson = {
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
    };

    return (
        <Source
            id="greenzones"
            type="geojson"
            data={geojson}
        >
            <Layer
                id="greenzones-fill"
                type="fill"
                paint={{
                    'fill-color': '#4CAF50',
                    'fill-opacity': 0.3
                }}
            />
            <Layer
                id="greenzones-outline"
                type="line"
                paint={{
                    'line-color': '#2E7D32',
                    'line-width': 2,
                    'line-opacity': 0.8
                }}
            />
        </Source>
    );
}

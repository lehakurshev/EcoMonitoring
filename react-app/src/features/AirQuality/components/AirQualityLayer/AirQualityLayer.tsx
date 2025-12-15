import { Source, Layer, Marker } from 'react-map-gl/maplibre';
import type { AirQualityData } from '../../../../types.ts';
import { useMemo } from 'react';

interface AirQualityLayerProps {
    airQualityData: AirQualityData[];
    onDistrictClick?: (data: AirQualityData) => void;
}

export function AirQualityLayer({ airQualityData, onDistrictClick }: AirQualityLayerProps) {
    const pointsGeoJson = useMemo(() => ({
        type: 'FeatureCollection' as const,
        features: airQualityData.map((data) => ({
            type: 'Feature' as const,
            properties: {
                aqi: data.aqi
            },
            geometry: {
                type: 'Point' as const,
                coordinates: [data.location.longitude, data.location.latitude]
            }
        }))
    }), [airQualityData]);

    return (
        <>
            <Layer
                id="airquality-background"
                type="background"
                paint={{
                    'background-color': '#FFEBEE',
                    'background-opacity': 0.4
                }}
            />

            <Source
                id="airquality-heatmap-points"
                type="geojson"
                data={pointsGeoJson}
            >
                <Layer
                    id="airquality-heatmap"
                    type="heatmap"
                    paint={{
                        'heatmap-weight': [
                            'interpolate',
                            ['linear'],
                            ['get', 'aqi'],
                            0, 0,
                            50, 0.5,
                            100, 1,
                            150, 1.5,
                            200, 2
                        ],
                        'heatmap-intensity': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            0, 0.8,
                            15, 2
                        ],
                        'heatmap-color': [
                            'interpolate',
                            ['linear'],
                            ['heatmap-density'],
                            0, 'rgba(255, 235, 238, 0.4)',
                            0.2, '#81C784',
                            0.4, '#FDD835',
                            0.6, '#FF9800',
                            0.8, '#E53935',
                            1, '#B71C1C'
                        ],
                        'heatmap-radius': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            0, 60,
                            10, 100,
                            15, 150
                        ],
                        'heatmap-opacity': 0.9
                    }}
                />
            </Source>

            {airQualityData.map((data, index) => (
                <Marker
                    key={index}
                    longitude={data.location.longitude}
                    latitude={data.location.latitude}
                    anchor="center"
                >
                    <div
                        onClick={() => onDistrictClick?.(data)}
                        style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: '2px solid #1976D2',
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: 'bold',
                            color: '#333',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                            transition: 'all 0.2s',
                            whiteSpace: 'nowrap'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.1)';
                            e.currentTarget.style.backgroundColor = '#1976D2';
                            e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                            e.currentTarget.style.color = '#333';
                        }}
                    >
                        {data.district}
                    </div>
                </Marker>
            ))}
        </>
    );
}

import { Source, Layer } from 'react-map-gl/maplibre';

const parkCoordinates: [number, number][] = [
    [60.6819747, 56.841922],
    [60.6818846, 56.8408388],
    [60.6821436, 56.8408324],
    [60.6829854, 56.8404424],
    [60.683507, 56.8399031],
    [60.6840808, 56.8400599],
    [60.6831654, 56.840719],
    [60.6831721, 56.8410044],
    [60.6837088, 56.8410317],
    [60.6837274, 56.8412532],
    [60.6836142, 56.841256],
    [60.683624, 56.8413738],
    [60.6834518, 56.8413781],
    [60.6832253, 56.8414517],
    [60.6829599, 56.8414575],
    [60.6829795, 56.8417238],
    [60.6832056, 56.8417604],
    [60.6832105, 56.8419],
    [60.6828289, 56.8419008],
    [60.6819747, 56.841922]
];

const parkGeoJSON = {
    type: 'Feature' as const,
    geometry: {
        type: 'Polygon' as const,
        coordinates: [parkCoordinates]
    },
    properties: {
        name: 'Парк в Екатеринбурге'
    }
};

const parkFillLayer = {
    id: 'park-fill',
    type: 'fill' as const,
    paint: {
        'fill-color': '#4CAF50',
        'fill-opacity': 0.6
    }
};

const parkOutlineLayer = {
    id: 'park-outline',
    type: 'line' as const,
    paint: {
        'line-color': '#2E7D32',
        'line-width': 3
    }
};

export function ParkLayer() {
    return (
        <Source id="park-source" type="geojson" data={parkGeoJSON}>
            <Layer {...parkFillLayer} />
            <Layer {...parkOutlineLayer} />
        </Source>
    );
}

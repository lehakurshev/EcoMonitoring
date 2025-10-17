import React, { useState, useCallback } from 'react';
import Map, { Source, Layer, Marker, Popup, ViewState, MapEvent } from 'react-map-gl/maplibre';

import 'maplibre-gl/dist/maplibre-gl.css';
import './App.css';

// Типы для координат
const settingsHeatMap = {
    // Настройки тепловой карты
    'heatmap-weight': [
        'interpolate', ['linear'],
        ['get', 'intensity'], 0, 0, 1, 1
    ] as any,
    'heatmap-intensity': [
        'interpolate', ['linear'],
        ['zoom'], 0, 1, 9, 3
    ] as any,
    'heatmap-color': [
        'interpolate', ['linear'],
        ['heatmap-density'],
        0, 'rgba(0, 0, 255, 0)',
        0.2, 'royalblue',
        0.4, 'cyan',
        0.6, 'lime',
        0.8, 'yellow',
        1, 'red'
    ] as any,
    'heatmap-radius': [
        'interpolate', ['linear'],
        ['zoom'], 0, 20, 9, 200
    ] as any,
    'heatmap-opacity': 0.8
}

type Coordinates = [number, number];
type Bounds = {
    sw: Coordinates;
    ne: Coordinates;
    nw: Coordinates;
    se: Coordinates;
};

// Типы для GeoJSON
type GeoJSONFeature = {
    type: 'Feature';
    geometry: {
        type: 'Polygon';
        coordinates: Coordinates[][];
    };
    properties: {
        name: string;
    };
};

type PointOnHeatMap = {
    type: 'Feature',
    geometry: {
        type: 'Point',
        coordinates: [number, number]
    },
    properties: { intensity: number }
}

type HeatMapData = {
    type: 'FeatureCollection',
    features: PointOnHeatMap[]
};

const getPointOnHeatMap = (lng : number, lat : number, intensity : number) : PointOnHeatMap => {
    return {
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [lng, lat]
        },
        properties: { intensity }
    }
}

const getHeatMap = () : HeatMapData => {
    const greenPoint = getPointOnHeatMap(60.6820, 56.835, 0.1);
    const redPoint = getPointOnHeatMap(60.684, 56.85, 0.9);
    const yellowPoint = getPointOnHeatMap(60.683, 56.843, 0.5);

    return {
        type: 'FeatureCollection',
        features: [greenPoint, redPoint, yellowPoint]
    }
}

// Типы для слоев
type ParkFillLayer = {
    id: string;
    type: 'fill';
    paint: {
        'fill-color': string;
        'fill-opacity': number;
    };
};

type ParkOutlineLayer = {
    id: string;
    type: 'line';
    paint: {
        'line-color': string;
        'line-width': number;
    };
};

function App() {
    const [viewState, setViewState] = useState<ViewState>({
        longitude: 60.6825,
        latitude: 56.841,
        zoom: 15,
        bearing: 0,      // добавлено
        pitch: 0,        // добавлено
        padding: {       // добавлено
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
        }
    });

    const [showPopup, setShowPopup] = useState<boolean>(true);
    const [bounds, setBounds] = useState<Bounds | null>(null);

    // Функция для вычисления углов карты
    const handleMove = useCallback((evt: MapEvent) => {
        // Проверяем, что viewState существует
        if ((evt as any).viewState) {
            setViewState((evt as any).viewState);
        }

        // Получаем границы текущего вида карты
        const map = evt.target;
        if (map && (map as any).getBounds) {
            try {
                const bounds = (map as any).getBounds();

                // Получаем координаты углов
                const sw = bounds.getSouthWest(); // юго-западный угол
                const ne = bounds.getNorthEast(); // северо-восточный угол
                const nw = bounds.getNorthWest(); // северо-западный угол
                const se = bounds.getSouthEast(); // юго-восточный угол

                console.log('Границы карты:');
                console.log('Юго-запад:', [sw.lng, sw.lat]);
                console.log('Северо-восток:', [ne.lng, ne.lat]);
                console.log('Северо-запад:', [nw.lng, nw.lat]);
                console.log('Юго-восток:', [se.lng, se.lat]);
                console.log('Центр:', [viewState.longitude, viewState.latitude]);
                console.log('Зум:', viewState.zoom);
                console.log('---');

                // Сохраняем границы в состоянии, если нужно отображать их в интерфейсе
                setBounds({
                    sw: [sw.lng, sw.lat],
                    ne: [ne.lng, ne.lat],
                    nw: [nw.lng, nw.lat],
                    se: [se.lng, se.lat]
                });
            } catch (error) {
                console.error('Ошибка при получении границ карты:', error);
            }
        }
    }, [viewState.longitude, viewState.latitude, viewState.zoom]);

    // Альтернативный вариант обработчика - более безопасный
    const handleMoveEnd = useCallback((evt: MapEvent) => {
        const map = evt.target;
        if (map && (map as any).getBounds) {
            try {
                const bounds = (map as any).getBounds();
                const sw = bounds.getSouthWest();
                const ne = bounds.getNorthEast();
                const nw = bounds.getNorthWest();
                const se = bounds.getSouthEast();

                console.log('=== Границы карты после перемещения ===');
                console.log('СЗ угол:', [nw.lng.toFixed(6), nw.lat.toFixed(6)]);
                console.log('СВ угол:', [ne.lng.toFixed(6), ne.lat.toFixed(6)]);
                console.log('ЮЗ угол:', [sw.lng.toFixed(6), sw.lat.toFixed(6)]);
                console.log('ЮВ угол:', [se.lng.toFixed(6), se.lat.toFixed(6)]);
                console.log('====================================');

                setBounds({
                    sw: [sw.lng, sw.lat],
                    ne: [ne.lng, ne.lat],
                    nw: [nw.lng, nw.lat],
                    se: [se.lng, se.lat]
                });
            } catch (error) {
                console.error('Ошибка при получении границ карты:', error);
            }
        }
    }, []);

    // Функция для форматированного вывода координат
    const logBounds = useCallback(() => {
        if (bounds) {
            console.log('Текущие границы карты:');
            console.log('СЗ угол:', bounds.nw.map(coord => coord.toFixed(6)).join(', '));
            console.log('СВ угол:', bounds.ne.map(coord => coord.toFixed(6)).join(', '));
            console.log('ЮЗ угол:', bounds.sw.map(coord => coord.toFixed(6)).join(', '));
            console.log('ЮВ угол:', bounds.se.map(coord => coord.toFixed(6)).join(', '));
        } else {
            console.log('Границы карты еще не загружены');
        }
    }, [bounds]);

    const parkCoordinates: Coordinates[] = [
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

    const parkGeoJSON: GeoJSONFeature = {
        type: 'Feature',
        geometry: {
            type: 'Polygon',
            coordinates: [parkCoordinates]
        },
        properties: {
            name: 'Парк в Екатеринбурге'
        }
    };

    const parkFillLayer: ParkFillLayer = {
        id: 'park-fill',
        type: 'fill',
        paint: {
            'fill-color': '#4CAF50',
            'fill-opacity': 0.6
        }
    };

    const parkOutlineLayer: ParkOutlineLayer = {
        id: 'park-outline',
        type: 'line',
        paint: {
            'line-color': '#2E7D32',
            'line-width': 3
        }
    };

    const heatMap = {
        id : "heatmap-layer",
        type : "heatmap" as const,
        source : "heatmap-data",
        paint : settingsHeatMap
    };

    return (
        <div className="App">
            {/* Кнопка для ручного вывода координат в консоль */}
            <button
                onClick={logBounds}
                style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    zIndex: 1000,
                    padding: '10px',
                    background: 'white',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            >
                Вывести координаты в консоль
            </button>

            {/* Блок для отображения координат на экране */}
            {bounds && (
                <div style={{
                    position: 'absolute',
                    top: '50px',
                    left: '10px',
                    zIndex: 1000,
                    background: 'rgba(255, 255, 255, 0.9)',
                    padding: '10px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    maxWidth: '300px'
                }}>
                    <div><strong>Границы карты:</strong></div>
                    <div>СЗ: {bounds.nw[0].toFixed(6)}, {bounds.nw[1].toFixed(6)}</div>
                    <div>СВ: {bounds.ne[0].toFixed(6)}, {bounds.ne[1].toFixed(6)}</div>
                    <div>ЮЗ: {bounds.sw[0].toFixed(6)}, {bounds.sw[1].toFixed(6)}</div>
                    <div>ЮВ: {bounds.se[0].toFixed(6)}, {bounds.se[1].toFixed(6)}</div>
                    <div>Центр: {viewState.longitude.toFixed(6)}, {viewState.latitude.toFixed(6)}</div>
                    <div>Зум: {viewState.zoom.toFixed(2)}</div>
                </div>
            )}

            <Map
                {...viewState}
                onMove={handleMove}
                onMoveEnd={handleMoveEnd} // Более безопасный вариант - срабатывает после завершения перемещения
                onLoad={handleMoveEnd} // чтобы вывести координаты при загрузке
                style={{ width: '100vw', height: '100vh' }}
                mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
            >
                <Source id="park-source" type="geojson" data={parkGeoJSON}>
                    <Layer {...parkFillLayer} />
                    <Layer {...parkOutlineLayer} />
                </Source>

                <Source id="heatmap-data" type="geojson" data={getHeatMap()}>
                    <Layer {...heatMap} />
                </Source>

                <Marker
                    longitude={60.6825}
                    latitude={56.841}
                    color="#FF5722"
                    anchor="bottom"
                />

                {showPopup && (
                    <Popup
                        longitude={60.6825}
                        latitude={56.841}
                        anchor="top"
                        onClose={() => setShowPopup(false)}
                        closeOnClick={false}
                    >
                        <div>
                            <h3>Парк в Екатеринбурге</h3>
                            <p>Зеленый парк в центре города</p>
                        </div>
                    </Popup>
                )}
            </Map>
        </div>
    );
}

export default App;

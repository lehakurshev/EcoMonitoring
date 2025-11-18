import { useState, useCallback, useEffect } from 'react';
import Map, { Source, Layer, Marker, Popup} from 'react-map-gl/maplibre';
import type { ViewState, MapEvent } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import './App.css';
import { getContainersInArea } from './api';
import type { ContainerInfo } from './types';
import { getContainerColor, getWasteTypeName } from './types';

type Coordinates = [number, number];
type Bounds = {
    sw: Coordinates;
    ne: Coordinates;
    nw: Coordinates;
    se: Coordinates;
};

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
        bearing: 0,
        pitch: 0,
        padding: {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
        }
    });

    const [showPopup, setShowPopup] = useState<boolean>(true);
    const [bounds, setBounds] = useState<Bounds | null>(null);
    const [containers, setContainers] = useState<ContainerInfo[]>([]);
    const [selectedContainer, setSelectedContainer] = useState<ContainerInfo | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const handleMove = useCallback((evt: MapEvent) => {
        if ((evt as any).viewState) {
            setViewState((evt as any).viewState);
        }

        const map = evt.target;
        if (map && (map as any).getBounds) {
            try {
                const bounds = (map as any).getBounds();

                // Получаем координаты углов
                const sw = bounds.getSouthWest();
                const ne = bounds.getNorthEast();
                const nw = bounds.getNorthWest();
                const se = bounds.getSouthEast();

                console.log('Границы карты:');
                console.log('Юго-запад:', [sw.lng, sw.lat]);
                console.log('Северо-восток:', [ne.lng, ne.lat]);
                console.log('Северо-запад:', [nw.lng, nw.lat]);
                console.log('Юго-восток:', [se.lng, se.lat]);
                console.log('Центр:', [viewState.longitude, viewState.latitude]);
                console.log('Зум:', viewState.zoom);
                console.log('---');

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

    useEffect(() => {
        const fetchContainers = async () => {
            if (!bounds) return;

            try {
                setLoading(true);

                const data = await getContainersInArea(
                    bounds.nw[1],
                    bounds.nw[0],
                    bounds.se[1],
                    bounds.se[0]
                );

                setContainers(data);
                console.log(`Загружено ${data.length} контейнеров в видимой области`);
            } catch (error) {
                console.error('Не удалось загрузить контейнеры:', error);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchContainers, 500);

        return () => clearTimeout(timeoutId);
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

    return (
        <div className="App">
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
                    <div><strong>Контейнеров:</strong> {containers.length}</div>
                </div>
            )}

            {loading && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1000,
                    background: 'rgba(255, 255, 255, 0.9)',
                    padding: '20px',
                    borderRadius: '8px',
                    fontSize: '16px'
                }}>
                    Загрузка контейнеров...
                </div>
            )}

            <Map
                {...viewState}
                onMove={handleMove}
                onMoveEnd={handleMoveEnd}
                onLoad={handleMoveEnd}
                style={{ width: '100vw', height: '100vh' }}
                mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
            >
                <Source id="park-source" type="geojson" data={parkGeoJSON}>
                    <Layer {...parkFillLayer} />
                    <Layer {...parkOutlineLayer} />
                </Source>

                {containers.map((container) => {
                    let lng: number, lat: number;
                    if (Array.isArray(container.location.coordinates)) {
                        [lng, lat] = container.location.coordinates;
                    } else if (container.location.coordinates.x !== undefined && container.location.coordinates.y !== undefined) {
                        lng = container.location.coordinates.x;
                        lat = container.location.coordinates.y;
                    } else {
                        console.warn('Неизвестный формат координат:', container.location.coordinates);
                        return null;
                    }

                    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
                        console.warn(`Некорректные координаты для контейнера ${container.id}: lng=${lng}, lat=${lat}`);
                        return null;
                    }

                    const wasteTypes = Array.isArray(container.wasteTypes) ? container.wasteTypes : [];
                    const color = getContainerColor(wasteTypes);

                    return (
                        <Marker
                            key={container.id}
                            longitude={lng}
                            latitude={lat}
                            color={color}
                            anchor="bottom"
                            onClick={(e) => {
                                e.originalEvent.stopPropagation();
                                setSelectedContainer(container);
                            }}
                        />
                    );
                })}

                {selectedContainer && (() => {
                    let lng: number, lat: number;
                    if (Array.isArray(selectedContainer.location.coordinates)) {
                        [lng, lat] = selectedContainer.location.coordinates;
                    } else {
                        lng = selectedContainer.location.coordinates.x;
                        lat = selectedContainer.location.coordinates.y;
                    }

                    return (
                        <Popup
                            longitude={lng}
                            latitude={lat}
                            anchor="top"
                            onClose={() => setSelectedContainer(null)}
                            closeOnClick={false}
                        >
                        <div style={{ maxWidth: '250px' }}>
                            <h3 style={{ margin: '0 0 10px 0' }}>Мусорный контейнер</h3>
                            <div>
                                <strong>Адрес:</strong>
                                <p style={{ margin: '5px 0' }}>
                                    {selectedContainer.address.settlement}, {selectedContainer.address.district}<br />
                                    {selectedContainer.address.street}, {selectedContainer.address.house}
                                </p>
                            </div>
                            <div>
                                <strong>Типы отходов:</strong>
                                <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                                    {(Array.isArray(selectedContainer.wasteTypes) ? selectedContainer.wasteTypes : []).map((type, idx) => (
                                        <li key={idx}>{getWasteTypeName(type)}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </Popup>
                    );
                })()}

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

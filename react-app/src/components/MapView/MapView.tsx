import Map, { Marker } from 'react-map-gl/maplibre';
import type { ViewState, MapEvent } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { ContainerInfo, Bounds, CreateContainerRequest } from '../../types';
import { ClusterLayer } from '../ClusterLayer/ClusterLayer';
import { ContainerSidebar } from '../ContainerSidebar/ContainerSidebar';
import { AddContainerSidebar } from '../AddContainerSidebar/AddContainerSidebar';

interface MapViewProps {
    viewState: ViewState;
    bounds: Bounds | null;
    containers: ContainerInfo[];
    selectedContainer: ContainerInfo | null;
    showContainers: boolean;
    addingContainer: boolean;
    newContainerPosition: { lat: number; lng: number } | null;
    onMove: (evt: MapEvent) => void;
    onMoveEnd: (evt: MapEvent) => void;
    onViewStateChange: (viewState: ViewState) => void;
    onContainerSelect: (container: ContainerInfo | null) => void;
    onToggleContainers: () => void;
    onToggleAddMode: () => void;
    onMapClick: (lat: number, lng: number) => void;
    onSubmitContainer: (container: CreateContainerRequest) => Promise<void>;
    onCancelAddContainer: () => void;
}

export function MapView({
    viewState,
    bounds,
    containers,
    selectedContainer,
    showContainers,
    addingContainer,
    newContainerPosition,
    onMove,
    onMoveEnd,
    onViewStateChange,
    onContainerSelect,
    onToggleContainers,
    onToggleAddMode,
    onMapClick,
    onSubmitContainer,
    onCancelAddContainer
}: MapViewProps) {
    const handleMapClick = (event: any) => {
        if (addingContainer && event.lngLat) {
            onMapClick(event.lngLat.lat, event.lngLat.lng);
        }
    };
    return (
        <>
            {newContainerPosition ? (
                <AddContainerSidebar
                    latitude={newContainerPosition.lat}
                    longitude={newContainerPosition.lng}
                    onSubmit={onSubmitContainer}
                    onCancel={onCancelAddContainer}
                />
            ) : (
                <ContainerSidebar
                    container={selectedContainer}
                    onClose={() => onContainerSelect(null)}
                />
            )}
            
            <button
                className="toggle-containers-button"
                onClick={onToggleContainers}
                title={showContainers ? 'Скрыть контейнеры' : 'Показать контейнеры'}
                style={{ 
                    backgroundColor: showContainers ? '#1976D2' : 'white',
                    borderColor: showContainers ? '#1976D2' : '#666'
                }}
            >
                <span style={{ fontSize: '20px' }}>🗑️</span>
            </button>
            
            {showContainers && (
                <button
                    className="add-container-button"
                    onClick={onToggleAddMode}
                    title={addingContainer ? 'Отменить добавление' : 'Добавить контейнер'}
                    style={{ 
                        backgroundColor: addingContainer ? '#4CAF50' : 'white',
                        borderColor: addingContainer ? '#4CAF50' : '#666'
                    }}
                >
                    <span style={{ fontSize: '20px' }}>➕</span>
                </button>
            )}
            
            {addingContainer && !newContainerPosition && (
                <div className="add-container-hint">
                    Кликните на карту, чтобы выбрать место для контейнера
                </div>
            )}
            
            <Map
            {...viewState}
            onMove={onMove}
            onMoveEnd={onMoveEnd}
            onLoad={onMoveEnd}
            onClick={handleMapClick}
            style={{ 
                width: '100vw', 
                height: '100vh',
                cursor: addingContainer ? 'crosshair' : 'default'
            }}
            mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        >
            {showContainers && (
                <ClusterLayer
                    containers={containers}
                    bounds={bounds}
                    zoom={viewState.zoom}
                    viewState={viewState}
                    selectedContainer={selectedContainer}
                    onViewStateChange={onViewStateChange}
                    onContainerClick={onContainerSelect}
                />
            )}
            
            {newContainerPosition && (
                <Marker
                    longitude={newContainerPosition.lng}
                    latitude={newContainerPosition.lat}
                    anchor="center"
                    offset={[5, 35]}
                >
                    <svg
                        width="24"
                        height="35"
                        viewBox="0 0 24 35"
                        style={{
                            fill: '#4CAF50',
                            stroke: '#FFFFFF',
                            strokeWidth: 1.5,
                            filter: 'drop-shadow(0 0 8px rgba(76, 175, 80, 0.8))',
                            animation: 'pulse 1.5s ease-in-out infinite'
                        }}
                    >
                        <path d="M12 0C7.58 0 4 3.58 4 8c0 7 8 17 8 17s8-10 8-17c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
                    </svg>
                </Marker>
            )}
        </Map>
        </>
    );
}

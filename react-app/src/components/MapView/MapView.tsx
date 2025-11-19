import Map from 'react-map-gl/maplibre';
import type { ViewState, MapEvent } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { ContainerInfo, Bounds } from '../../types';
import { ClusterLayer } from '../ClusterLayer/ClusterLayer';
import { ContainerSidebar } from '../ContainerSidebar/ContainerSidebar';

interface MapViewProps {
    viewState: ViewState;
    bounds: Bounds | null;
    containers: ContainerInfo[];
    selectedContainer: ContainerInfo | null;
    showContainers: boolean;
    onMove: (evt: MapEvent) => void;
    onMoveEnd: (evt: MapEvent) => void;
    onViewStateChange: (viewState: ViewState) => void;
    onContainerSelect: (container: ContainerInfo | null) => void;
    onToggleContainers: () => void;
}

export function MapView({
    viewState,
    bounds,
    containers,
    selectedContainer,
    showContainers,
    onMove,
    onMoveEnd,
    onViewStateChange,
    onContainerSelect,
    onToggleContainers
}: MapViewProps) {
    return (
        <>
            <ContainerSidebar
                container={selectedContainer}
                onClose={() => onContainerSelect(null)}
            />
            
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
            
            <Map
            {...viewState}
            onMove={onMove}
            onMoveEnd={onMoveEnd}
            onLoad={onMoveEnd}
            style={{ width: '100vw', height: '100vh' }}
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
        </Map>
        </>
    );
}

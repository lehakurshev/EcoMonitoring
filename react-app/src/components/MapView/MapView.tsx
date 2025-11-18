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
    onMove: (evt: MapEvent) => void;
    onMoveEnd: (evt: MapEvent) => void;
    onViewStateChange: (viewState: ViewState) => void;
    onContainerSelect: (container: ContainerInfo | null) => void;
}

export function MapView({
    viewState,
    bounds,
    containers,
    selectedContainer,
    onMove,
    onMoveEnd,
    onViewStateChange,
    onContainerSelect
}: MapViewProps) {
    return (
        <>
            <ContainerSidebar
                container={selectedContainer}
                onClose={() => onContainerSelect(null)}
            />
            
            <Map
            {...viewState}
            onMove={onMove}
            onMoveEnd={onMoveEnd}
            onLoad={onMoveEnd}
            style={{ width: '100vw', height: '100vh' }}
            mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        >
            <ClusterLayer
                containers={containers}
                bounds={bounds}
                zoom={viewState.zoom}
                viewState={viewState}
                onViewStateChange={onViewStateChange}
                onContainerClick={onContainerSelect}
            />
        </Map>
        </>
    );
}

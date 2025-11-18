import { useState } from 'react';
import Map, { Marker, Popup } from 'react-map-gl/maplibre';
import type { ViewState, MapEvent } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { ContainerInfo, Bounds } from '../../types';
import { ParkLayer } from '../ParkLayer/ParkLayer';
import { ClusterLayer } from '../ClusterLayer/ClusterLayer';
import { ContainerPopup } from '../ContainerPopup/ContainerPopup';

interface MapViewProps {
    viewState: ViewState;
    bounds: Bounds | null;
    containers: ContainerInfo[];
    onMove: (evt: MapEvent) => void;
    onMoveEnd: (evt: MapEvent) => void;
    onViewStateChange: (viewState: ViewState) => void;
}

export function MapView({
    viewState,
    bounds,
    containers,
    onMove,
    onMoveEnd,
    onViewStateChange
}: MapViewProps) {
    const [showPopup, setShowPopup] = useState<boolean>(true);
    const [selectedContainer, setSelectedContainer] = useState<ContainerInfo | null>(null);

    return (
        <Map
            {...viewState}
            onMove={onMove}
            onMoveEnd={onMoveEnd}
            onLoad={onMoveEnd}
            style={{ width: '100vw', height: '100vh' }}
            mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        >
            <ParkLayer />

            <ClusterLayer
                containers={containers}
                bounds={bounds}
                zoom={viewState.zoom}
                viewState={viewState}
                onViewStateChange={onViewStateChange}
                onContainerClick={setSelectedContainer}
            />

            {selectedContainer && (
                <ContainerPopup
                    container={selectedContainer}
                    onClose={() => setSelectedContainer(null)}
                />
            )}

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
    );
}

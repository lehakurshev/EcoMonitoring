import Map, {Marker} from 'react-map-gl/maplibre';
import {ClusterLayer} from '../ClusterLayer/ClusterLayer';
import {GreenZoneLayer} from '../../../GreenZones/components/GreenZoneLayer/GreenZoneLayer';
import {AirQualityLayer} from '../../../AirQuality/components/AirQualityLayer/AirQualityLayer';
import type {ViewState, MapEvent, MapLayerMouseEvent} from 'react-map-gl/maplibre';
import type {ContainerInfo, Bounds, AirQualityData, GreenZonePoint} from '../../../../types';

interface MapLayersProps {
    viewState: ViewState;
    bounds: Bounds | null;
    containers: ContainerInfo[];
    greenZonePoints: GreenZonePoint[];
    airQualityData: AirQualityData[];
    showContainers: boolean;
    showGreenZones: boolean;
    showAirQuality: boolean;
    selectedContainer: ContainerInfo | null;
    onViewStateChange: (viewState: ViewState) => void;
    onContainerSelect: (container: ContainerInfo | null) => void;
    onAirQualitySelect: (data: AirQualityData | null) => void;
    addingContainer: boolean;
    newContainerPosition: { lat: number; lng: number } | null;
    onMapClick: (lat: number, lng: number) => void;
    onMove: (evt: MapEvent) => void;
    onMoveEnd: (evt: MapEvent) => void;
}

export function MapLayers({
    viewState,
    bounds,
    containers,
    greenZonePoints,
    airQualityData,
    showContainers,
    showGreenZones,
    showAirQuality,
    selectedContainer,
    onViewStateChange,
    onContainerSelect,
    onAirQualitySelect,
    addingContainer,
    newContainerPosition,
    onMapClick,
    onMove,
    onMoveEnd
} : MapLayersProps) {
    const handleMapClick = (event: MapLayerMouseEvent) => {
        if (addingContainer && event.lngLat) {
            onMapClick(event.lngLat.lat, event.lngLat.lng);
        }
    };

    return (
        <Map
            {...viewState}
            onMove={onMove}
            onMoveEnd={onMoveEnd}
            onLoad={onMoveEnd}
            onClick={handleMapClick}
            cursor={addingContainer ? 'crosshair' : undefined}
            mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        >
            {showGreenZones && <GreenZoneLayer greenZones={greenZonePoints} />}
            {showAirQuality && (
                <AirQualityLayer
                    airQualityData={airQualityData}
                    onDistrictClick={onAirQualitySelect}
                />
            )}
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
                        className="new-marker"
                    >
                        <path
                            d="M12 0C7.58 0 4 3.58 4 8c0 7 8 17 8 17s8-10 8-17c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"
                        />
                    </svg>
                </Marker>
            )}
        </Map>
    );
}

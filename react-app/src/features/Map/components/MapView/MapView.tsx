import type {ViewState, MapEvent} from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import type {
    ContainerInfo,
    Bounds,
    CreateContainerRequest,
    AirQualityData,
    GreenZonePoint
} from '../../../../types.ts';
import './MapView.css';
import {Sidebar} from './Sidebar';
import {ControlButtons} from './ControlButtons';
import {MapLayers} from './MapLayers';

interface MapViewProps {
    viewState: ViewState;
    bounds: Bounds | null;
    containers: ContainerInfo[];
    greenZonePoints: GreenZonePoint[]
    airQualityData: AirQualityData[];
    selectedAirQuality: AirQualityData | null;
    selectedContainer: ContainerInfo | null;
    showContainers: boolean;
    showGreenZones: boolean;
    showAirQuality: boolean;
    addingContainer: boolean;
    newContainerPosition: { lat: number; lng: number } | null;
    onMove: (evt: MapEvent) => void;
    onMoveEnd: (evt: MapEvent) => void;
    onViewStateChange: (viewState: ViewState) => void;
    onContainerSelect: (container: ContainerInfo | null) => void;
    onToggleContainers: () => void;
    onToggleGreenZones: () => void;
    onToggleAirQuality: () => void;
    onAirQualitySelect: (data: AirQualityData | null) => void;
    onToggleAddMode: () => void;
    onMapClick: (lat: number, lng: number) => void;
    onSubmitContainer: (container: CreateContainerRequest) => Promise<void>;
    onCancelAddContainer: () => void;
}

export function MapView({
                            viewState,
                            bounds,
                            containers,
                            greenZonePoints,
                            airQualityData,
                            selectedAirQuality,
                            selectedContainer,
                            showContainers,
                            showGreenZones,
                            showAirQuality,
                            addingContainer,
                            newContainerPosition,
                            onMove,
                            onMoveEnd,
                            onViewStateChange,
                            onContainerSelect,
                            onToggleContainers,
                            onToggleGreenZones,
                            onToggleAirQuality,
                            onAirQualitySelect,
                            onToggleAddMode,
                            onMapClick,
                            onSubmitContainer,
                            onCancelAddContainer
                        }: MapViewProps) {
    return (
        <>
            <Sidebar
                newContainerPosition={newContainerPosition}
                selectedAirQuality={selectedAirQuality}
                selectedContainer={selectedContainer}
                onSubmitContainer={onSubmitContainer}
                onCancelAddContainer={onCancelAddContainer}
                onAirQualitySelect={onAirQualitySelect}
                onContainerSelect={onContainerSelect}
            />

            <ControlButtons
                showContainers={showContainers}
                showGreenZones={showGreenZones}
                showAirQuality={showAirQuality}
                addingContainer={addingContainer}
                onToggleContainers={onToggleContainers}
                onToggleGreenZones={onToggleGreenZones}
                onToggleAirQuality={onToggleAirQuality}
                onToggleAddMode={onToggleAddMode}
            />

            <div className={`map-wrapper ${addingContainer ? 'adding' : ''}`}>
                <MapLayers
                    viewState={viewState}
                    bounds={bounds}
                    containers={containers}
                    greenZonePoints={greenZonePoints}
                    airQualityData={airQualityData}
                    showContainers={showContainers}
                    showGreenZones={showGreenZones}
                    showAirQuality={showAirQuality}
                    selectedContainer={selectedContainer}
                    onViewStateChange={onViewStateChange}
                    onContainerSelect={onContainerSelect}
                    onAirQualitySelect={onAirQualitySelect}
                    addingContainer={addingContainer}
                    newContainerPosition={newContainerPosition}
                    onMapClick={onMapClick}
                    onMove={onMove}
                    onMoveEnd={onMoveEnd}
                />
            </div>
        </>
    );
}

import { useState } from 'react';
import type { ViewState, MapEvent } from 'react-map-gl/maplibre';
import { MapView } from '../features/Map/components/MapView/MapView.tsx';
import { useMapBounds } from '../features/Map/hooks/useMapBounds';
import { useContainers } from '../features/Containers/hooks/useContainers';
import { useAirQuality } from '../features/AirQuality/hooks/useAirQuality';
import { createContainer } from '../api';
import type { ContainerInfo, CreateContainerRequest, AirQualityData } from '../types';
import { useGreenZoneDataHeatMap } from '../features/GreenZones/hooks/useGreenZoneDataHeatMap';

export function MapPage() {
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

    const [selectedContainer, setSelectedContainer] = useState<ContainerInfo | null>(null);
    const [showContainers, setShowContainers] = useState(false);
    const [showGreenZones, setShowGreenZones] = useState(false);
    const [showAirQuality, setShowAirQuality] = useState(false);
    const [selectedAirQuality, setSelectedAirQuality] = useState<AirQualityData | null>(null);
    const [addingContainer, setAddingContainer] = useState(false);
    const [newContainerPosition, setNewContainerPosition] = useState<{ lat: number; lng: number } | null>(null);
    const { bounds, updateBounds } = useMapBounds();
    const { containers } = useContainers(bounds);
    const { greenZonePoints } = useGreenZoneDataHeatMap(bounds);
    const { airQualityData } = useAirQuality();

    const handleMove = (evt: MapEvent) => {
        const mapEvent = evt as MapEvent & { viewState?: ViewState };
        if (mapEvent.viewState) {
            setViewState(mapEvent.viewState);
        }
        updateBounds(evt);
    };

    const handleToggleContainers = () => {
        if (!showContainers) {
            setShowGreenZones(false);
            setShowAirQuality(false);
            setSelectedAirQuality(null);
        }
        setShowContainers(!showContainers);
        if (showContainers) {
            setSelectedContainer(null);
            setAddingContainer(false);
            setNewContainerPosition(null);
        }
    };

    const handleToggleGreenZones = () => {
        if (!showGreenZones) {
            setShowContainers(false);
            setShowAirQuality(false);
            setSelectedContainer(null);
            setAddingContainer(false);
            setNewContainerPosition(null);
            setSelectedAirQuality(null);
        }
        setShowGreenZones(!showGreenZones);
    };

    const handleToggleAirQuality = () => {
        if (!showAirQuality) {
            setShowContainers(false);
            setShowGreenZones(false);
            setSelectedContainer(null);
            setAddingContainer(false);
            setNewContainerPosition(null);
            setSelectedAirQuality(airQualityData.length > 0 ? airQualityData[0] : null);
        }
        setShowAirQuality(!showAirQuality);
        if (showAirQuality) {
            setSelectedAirQuality(null);
        }
    };

    const handleToggleAddMode = () => {
        if (!addingContainer) {
            setSelectedContainer(null);
            setNewContainerPosition(null);
            // Автоматически включить режим контейнеров при добавлении
            if (!showContainers) {
                setShowGreenZones(false);
                setShowAirQuality(false);
                setSelectedAirQuality(null);
                setShowContainers(true);
            }
        }
        setAddingContainer(!addingContainer);
    };

    const handleMapClick = (lat: number, lng: number) => {
        if (addingContainer) {
            setNewContainerPosition({ lat, lng });
        }
    };

    const handleCancelAdd = () => {
        setAddingContainer(false);
        setNewContainerPosition(null);
    };

    const handleSaveContainer = async (request: CreateContainerRequest) => {
        try {
            await createContainer(request);
            setAddingContainer(false);
            setNewContainerPosition(null);
        } catch (error) {
            console.error('Ошибка при создании контейнера:', error);
        }
    };

    const handleMarkerClick = (container: ContainerInfo | null) => {
        setSelectedContainer(container);
    };

    const handleSelectAirQuality = (data: AirQualityData | null) => {
        setSelectedAirQuality(data);
    };

    return (
        <MapView
            viewState={viewState}
            bounds={bounds}
            onMove={handleMove}
            onMoveEnd={updateBounds}
            onViewStateChange={setViewState}
            containers={showContainers ? containers : []}
            showGreenZones={showGreenZones}
            greenZonePoints={greenZonePoints}
            showAirQuality={showAirQuality}
            airQualityData={airQualityData}
            selectedAirQuality={selectedAirQuality}
            onAirQualitySelect={handleSelectAirQuality}
            selectedContainer={selectedContainer}
            onContainerSelect={handleMarkerClick}
            onToggleContainers={handleToggleContainers}
            onToggleGreenZones={handleToggleGreenZones}
            onToggleAirQuality={handleToggleAirQuality}
            showContainers={showContainers}
            addingContainer={addingContainer}
            onToggleAddMode={handleToggleAddMode}
            newContainerPosition={newContainerPosition}
            onMapClick={handleMapClick}
            onCancelAddContainer={handleCancelAdd}
            onSubmitContainer={handleSaveContainer}
        />
    );
}

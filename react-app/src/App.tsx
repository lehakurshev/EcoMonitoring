import { useState } from 'react';
import type { ViewState, MapEvent } from 'react-map-gl/maplibre';
import './App.css';
import { MapView } from './components';
import { useMapBounds, useContainers } from './hooks';
import { createContainer } from './api';
import type { ContainerInfo, CreateContainerRequest, AirQualityData } from './types';
import { mockAirQualityData } from './mockAirQualityData';
import { useGreenZoneDataHeatMap } from './hooks';

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

    const [selectedContainer, setSelectedContainer] = useState<ContainerInfo | null>(null);
    const [showContainers, setShowContainers] = useState(false);
    const [showGreenZones, setShowGreenZones] = useState(false);
    const [showAirQuality, setShowAirQuality] = useState(false);
    const [selectedAirQuality, setSelectedAirQuality] = useState<AirQualityData | null>(null);
    const [addingContainer, setAddingContainer] = useState(false);
    const [newContainerPosition, setNewContainerPosition] = useState<{ lat: number; lng: number } | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const { bounds, updateBounds } = useMapBounds();
    const { containers } = useContainers(bounds);
    const { greenZonePoints } = useGreenZoneDataHeatMap(bounds)

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
            setSelectedAirQuality(mockAirQualityData[0]);
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
        }
        setAddingContainer(!addingContainer);
    };

    const handleMapClick = (lat: number, lng: number) => {
        if (addingContainer) {
            setNewContainerPosition({ lat, lng });
        }
    };

    const handleSubmitContainer = async (container: CreateContainerRequest) => {
        await createContainer(container);
        setNewContainerPosition(null);
        setAddingContainer(false);
        setSuccessMessage('Контейнер успешно добавлен');
        setTimeout(() => setSuccessMessage(null), 3000);
    };

    return (
        <div className="App">
            {successMessage && (
                <div className="success-message">
                    {successMessage}
                </div>
            )}

            <MapView
                viewState={viewState}
                bounds={bounds}
                containers={containers}
                greenZonePoints={greenZonePoints}
                airQualityData={mockAirQualityData}
                selectedAirQuality={selectedAirQuality}
                selectedContainer={selectedContainer}
                showContainers={showContainers}
                showGreenZones={showGreenZones}
                showAirQuality={showAirQuality}
                addingContainer={addingContainer}
                newContainerPosition={newContainerPosition}
                onMove={handleMove}
                onMoveEnd={updateBounds}
                onViewStateChange={setViewState}
                onContainerSelect={setSelectedContainer}
                onToggleContainers={handleToggleContainers}
                onToggleGreenZones={handleToggleGreenZones}
                onToggleAirQuality={handleToggleAirQuality}
                onAirQualitySelect={setSelectedAirQuality}
                onToggleAddMode={handleToggleAddMode}
                onMapClick={handleMapClick}
                onSubmitContainer={handleSubmitContainer}
                onCancelAddContainer={() => {
                    setNewContainerPosition(null);
                    setAddingContainer(false);
                }}
            />
        </div>
    );
}

export default App;

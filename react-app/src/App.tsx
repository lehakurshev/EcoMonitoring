import { useState } from 'react';
import type { ViewState, MapEvent } from 'react-map-gl/maplibre';
import './App.css';
import { MapView, LoadingIndicator } from './components';
import { AddContainerSidebar } from './components/AddContainerSidebar/AddContainerSidebar';
import { useMapBounds, useContainers } from './hooks';
import { createContainer } from './api';
import type { ContainerInfo, CreateContainerRequest } from './types';

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
    const [addingContainer, setAddingContainer] = useState(false);
    const [newContainerPosition, setNewContainerPosition] = useState<{ lat: number; lng: number } | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const { bounds, updateBounds } = useMapBounds();
    const { containers, loading } = useContainers(bounds);

    const handleMove = (evt: MapEvent) => {
        if ((evt as any).viewState) {
            setViewState((evt as any).viewState);
        }
        updateBounds(evt);
    };

    const handleToggleContainers = () => {
        setShowContainers(!showContainers);
        if (showContainers) {
            setSelectedContainer(null);
            setAddingContainer(false);
            setNewContainerPosition(null);
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
        try {
            await createContainer(container);
            setNewContainerPosition(null);
            setAddingContainer(false);
            setSuccessMessage('Контейнер успешно добавлен');
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error) {
            throw error;
        }
    };

    return (
        <div className="App">
            {loading && <LoadingIndicator />}
            {successMessage && (
                <div className="success-message">
                    {successMessage}
                </div>
            )}

            <MapView
                viewState={viewState}
                bounds={bounds}
                containers={containers}
                selectedContainer={selectedContainer}
                showContainers={showContainers}
                addingContainer={addingContainer}
                newContainerPosition={newContainerPosition}
                onMove={handleMove}
                onMoveEnd={updateBounds}
                onViewStateChange={setViewState}
                onContainerSelect={setSelectedContainer}
                onToggleContainers={handleToggleContainers}
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

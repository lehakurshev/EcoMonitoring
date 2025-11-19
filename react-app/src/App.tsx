import { useState } from 'react';
import type { ViewState, MapEvent } from 'react-map-gl/maplibre';
import './App.css';
import { MapView, LoadingIndicator } from './components';
import { useMapBounds, useContainers } from './hooks';
import type { ContainerInfo } from './types';

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
        }
    };

    return (
        <div className="App">
            {loading && <LoadingIndicator />}

            <MapView
                viewState={viewState}
                bounds={bounds}
                containers={containers}
                selectedContainer={selectedContainer}
                showContainers={showContainers}
                onMove={handleMove}
                onMoveEnd={updateBounds}
                onViewStateChange={setViewState}
                onContainerSelect={setSelectedContainer}
                onToggleContainers={handleToggleContainers}
            />
        </div>
    );
}

export default App;

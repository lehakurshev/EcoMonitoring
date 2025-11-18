import { Marker } from 'react-map-gl/maplibre';
import type { ContainerInfo } from '../../types';
import { getContainerColor } from '../../types';

interface ContainerMarkerProps {
    container: ContainerInfo;
    onClick: (container: ContainerInfo) => void;
    isSelected?: boolean;
}

export function ContainerMarker({ container, onClick, isSelected = false }: ContainerMarkerProps) {
    let lng: number, lat: number;

    if (Array.isArray(container.location.coordinates)) {
        [lng, lat] = container.location.coordinates;
    } else if (container.location.coordinates.x !== undefined && container.location.coordinates.y !== undefined) {
        lng = container.location.coordinates.x;
        lat = container.location.coordinates.y;
    } else {
        console.warn('Неизвестный формат координат:', container.location.coordinates);
        return null;
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        console.warn(`Некорректные координаты для контейнера ${container.id}: lng=${lng}, lat=${lat}`);
        return null;
    }

    const wasteTypes = Array.isArray(container.wasteTypes) ? container.wasteTypes : [];
    const color = isSelected ? '#FF1744' : getContainerColor(wasteTypes);

    const handleClick = (e: any) => {
        e.originalEvent.stopPropagation();
        onClick(container);
    };

    return (
        <Marker
            longitude={lng}
            latitude={lat}
            anchor="bottom"
            onClick={handleClick}
        >
            <svg
                height="40"
                viewBox="0 0 24 24"
                style={{
                    cursor: 'pointer',
                    fill: color,
                    stroke: isSelected ? '#FFFFFF' : 'none',
                    strokeWidth: isSelected ? 2 : 0,
                    filter: isSelected ? 'drop-shadow(0 0 4px rgba(255, 23, 68, 0.8))' : 'none',
                    transform: 'translate(-12px, -32px)'
                }}
            >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
        </Marker>
    );
}

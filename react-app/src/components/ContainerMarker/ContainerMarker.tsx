import { Marker } from 'react-map-gl/maplibre';
import type { ContainerInfo } from '../../types';
import { getContainerColor } from '../../types';

interface ContainerMarkerProps {
    container: ContainerInfo;
    onClick: (container: ContainerInfo) => void;
}

export function ContainerMarker({ container, onClick }: ContainerMarkerProps) {
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
    const color = getContainerColor(wasteTypes);

    const handleClick = (e: any) => {
        e.originalEvent.stopPropagation();
        onClick(container);
    };

    return (
        <Marker
            longitude={lng}
            latitude={lat}
            color={color}
            anchor="bottom"
            onClick={handleClick}
        />
    );
}

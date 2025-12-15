import {AddContainerSidebar} from '../../../Containers/components/AddContainerSidebar/AddContainerSidebar';
import {AirQualitySidebar} from '../../../AirQuality/components/AirQualitySidebar/AirQualitySidebar';
import {ContainerSidebar} from '../../../Containers/components/ContainerSidebar/ContainerSidebar';
import type {AirQualityData, ContainerInfo, CreateContainerRequest} from '../../../../types';

interface SidebarProps {
    newContainerPosition: { lat: number; lng: number } | null;
    selectedAirQuality: AirQualityData | null;
    selectedContainer: ContainerInfo | null;
    onSubmitContainer: (container: CreateContainerRequest) => Promise<void>;
    onCancelAddContainer: () => void;
    onAirQualitySelect: (data: AirQualityData | null) => void;
    onContainerSelect: (container: ContainerInfo | null) => void;
}

export function Sidebar({
    newContainerPosition,
    selectedAirQuality,
    selectedContainer,
    onSubmitContainer,
    onCancelAddContainer,
    onAirQualitySelect,
    onContainerSelect
} : SidebarProps) {
    if (newContainerPosition) {
        return (
            <AddContainerSidebar
                latitude={newContainerPosition.lat}
                longitude={newContainerPosition.lng}
                onSubmit={onSubmitContainer}
                onCancel={onCancelAddContainer}
            />
        );
    }

    if (selectedAirQuality) {
        return (
            <AirQualitySidebar
                data={selectedAirQuality}
                onClose={() => onAirQualitySelect(null)}
            />
        );
    }

    return (
        <ContainerSidebar
            container={selectedContainer}
            onClose={() => onContainerSelect(null)}
        />
    );
}

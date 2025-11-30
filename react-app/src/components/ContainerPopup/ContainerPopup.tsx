import { Popup } from 'react-map-gl/maplibre';
import type { ContainerInfo } from '../../types';
import { getWasteTypeName } from '../../types';
import './ContainerPopup.css';

interface ContainerPopupProps {
    container: ContainerInfo;
    onClose: () => void;
}

export function ContainerPopup({ container, onClose }: ContainerPopupProps) {
    const lat = container.location.latitude;
    const lng = container.location.longitude;

    return (
        <Popup
            longitude={lng}
            latitude={lat}
            anchor="top"
            onClose={onClose}
            closeOnClick={false}
        >
            <div className="container-popup">
                <h3 className="container-popup__title">Мусорный контейнер</h3>
                <div className="container-popup__section">
                    <strong>Адрес:</strong>
                    <p className="container-popup__address">
                        {container.address.settlement}, {container.address.district}<br />
                        {container.address.street}, {container.address.house}
                    </p>
                </div>
                <div className="container-popup__section">
                    <strong>Типы отходов:</strong>
                    <ul className="container-popup__waste-list">
                        {(Array.isArray(container.wasteTypes) ? container.wasteTypes : []).map((type, idx) => (
                            <li key={idx}>{getWasteTypeName(type)}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </Popup>
    );
}

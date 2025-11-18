import type { Bounds } from '../../types';
import './MapControls.css';

interface MapControlsProps {
    bounds: Bounds | null;
    viewState: {
        longitude: number;
        latitude: number;
        zoom: number;
    };
    containersCount: number;
    onLogBounds: () => void;
}

export function MapControls({ bounds, viewState, containersCount, onLogBounds }: MapControlsProps) {
    return (
        <div className="map-controls">
            <button
                onClick={onLogBounds}
                className="map-controls__button"
            >
                Вывести координаты в консоль
            </button>

            {bounds && (
                <div className="map-controls__info">
                    <div><strong>Границы карты:</strong></div>
                    <div>СЗ: {bounds.nw[0].toFixed(6)}, {bounds.nw[1].toFixed(6)}</div>
                    <div>СВ: {bounds.ne[0].toFixed(6)}, {bounds.ne[1].toFixed(6)}</div>
                    <div>ЮЗ: {bounds.sw[0].toFixed(6)}, {bounds.sw[1].toFixed(6)}</div>
                    <div>ЮВ: {bounds.se[0].toFixed(6)}, {bounds.se[1].toFixed(6)}</div>
                    <div>Центр: {viewState.longitude.toFixed(6)}, {viewState.latitude.toFixed(6)}</div>
                    <div>Зум: {viewState.zoom.toFixed(2)}</div>
                    <div><strong>Контейнеров:</strong> {containersCount}</div>
                </div>
            )}
        </div>
    );
}

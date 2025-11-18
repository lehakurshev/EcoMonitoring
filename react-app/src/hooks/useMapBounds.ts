import { useState, useCallback } from 'react';
import type { MapEvent } from 'react-map-gl/maplibre';
import type { Bounds } from '../types';

export function useMapBounds() {
    const [bounds, setBounds] = useState<Bounds | null>(null);

    const updateBounds = useCallback((evt: MapEvent) => {
        const map = evt.target;
        if (map && (map as any).getBounds) {
            try {
                const mapBounds = (map as any).getBounds();
                const sw = mapBounds.getSouthWest();
                const ne = mapBounds.getNorthEast();
                const nw = mapBounds.getNorthWest();
                const se = mapBounds.getSouthEast();

                console.log('Границы карты:');
                console.log('Юго-запад:', [sw.lng, sw.lat]);
                console.log('Северо-восток:', [ne.lng, ne.lat]);
                console.log('Северо-запад:', [nw.lng, nw.lat]);
                console.log('Юго-восток:', [se.lng, se.lat]);

                setBounds({
                    sw: [sw.lng, sw.lat],
                    ne: [ne.lng, ne.lat],
                    nw: [nw.lng, nw.lat],
                    se: [se.lng, se.lat]
                });
            } catch (error) {
                console.error('Ошибка при получении границ карты:', error);
            }
        }
    }, []);

    const logBounds = useCallback(() => {
        if (bounds) {
            console.log('Текущие границы карты:');
            console.log('СЗ угол:', bounds.nw.map(coord => coord.toFixed(6)).join(', '));
            console.log('СВ угол:', bounds.ne.map(coord => coord.toFixed(6)).join(', '));
            console.log('ЮЗ угол:', bounds.sw.map(coord => coord.toFixed(6)).join(', '));
            console.log('ЮВ угол:', bounds.se.map(coord => coord.toFixed(6)).join(', '));
        } else {
            console.log('Границы карты еще не загружены');
        }
    }, [bounds]);

    return { bounds, updateBounds, logBounds };
}

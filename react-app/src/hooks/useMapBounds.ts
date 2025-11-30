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

                setBounds({
                    sw: [sw.lng, sw.lat],
                    ne: [ne.lng, ne.lat],
                    nw: [nw.lng, nw.lat],
                    se: [se.lng, se.lat]
                });
            } catch (error) {
            }
        };
    }, []);

    return { bounds, updateBounds };
}

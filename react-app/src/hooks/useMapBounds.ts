import { useState, useCallback } from 'react';
import type { MapEvent } from 'react-map-gl/maplibre';
import type { Map as MapLibreMap } from 'maplibre-gl';
import type { Bounds } from '../types';
import {logger} from "../utils/logger.ts";

export function useMapBounds() {
    const [bounds, setBounds] = useState<Bounds | null>(null);

    const updateBounds = useCallback((evt: MapEvent) => {
        const map = evt.target as MapLibreMap;
        if (map && map.getBounds) {
            try {
                const mapBounds = map.getBounds();
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
            } catch {
                logger.error("Ошибка при нахождении границ области");
            }
        }
    }, []);

    return { bounds, updateBounds };
}

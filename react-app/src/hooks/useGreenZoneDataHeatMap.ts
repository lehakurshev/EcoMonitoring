import { useState, useEffect } from 'react';
import type {Bounds, GreenZonePoint} from '../types';
import {getGreenZonesPointsAndAreaInArea} from '../api';

export function useGreenZoneDataHeatMap(bounds: Bounds | null) {
    const [greenZones, setGreenZones] = useState<GreenZonePoint[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!bounds) return;

        const timeoutId = setTimeout(async () => {
            try {
                setLoading(true);
                const minLat = Math.min(bounds.sw[1], bounds.ne[1]);
                const maxLat = Math.max(bounds.sw[1], bounds.ne[1]);
                const minLon = Math.min(bounds.sw[0], bounds.ne[0]);
                const maxLon = Math.max(bounds.sw[0], bounds.ne[0]);

                const zones = await getGreenZonesPointsAndAreaInArea(minLat, maxLat, minLon, maxLon);
                setGreenZones(zones);
            } catch (error) {
                console.error('Ошибка при загрузке зеленых зон:', error);
            } finally {
                setLoading(false);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [bounds]);

    return { greenZones, loading };
}

import { useState, useEffect } from 'react';
import type { Bounds, GreenZone } from '../types';
import { getGreenZonesInArea } from '../api';

export function useGreenZones(bounds: Bounds | null) {
    const [greenZones, setGreenZones] = useState<GreenZone[]>([]);
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

                const zones = await getGreenZonesInArea(minLat, maxLat, minLon, maxLon);
                setGreenZones(zones);
            } catch (error) {
            } finally {
                setLoading(false);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [bounds]);

    return { greenZones, loading };
}

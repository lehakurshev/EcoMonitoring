import { useMemo } from 'react';
import Supercluster from 'supercluster';
import type { ContainerInfo } from '../types';

type BBox = [number, number, number, number];

interface ContainerProperties {
    cluster: boolean;
    containerId: string;
    container: ContainerInfo;
    point_count?: number; // Added to support cluster points
}

interface UseSuperclusterProps {
    containers: ContainerInfo[];
    bounds: [number, number, number, number] | null;
    zoom: number;
}

export function useSupercluster({ containers, bounds, zoom }: UseSuperclusterProps) {
    const supercluster = useMemo(() => {
        const cluster = new Supercluster<ContainerProperties>({
            radius: 120,
            maxZoom: 18,
            minZoom: 0,
            minPoints: 2,
        });

        const points = containers
            .map((container) => {
                const lat = container.location.latitude;
                const lng = container.location.longitude;

                if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
                    return null;
                }

                return {
                    type: 'Feature' as const,
                    properties: {
                        cluster: false,
                        containerId: container.id,
                        container: container,
                    },
                    geometry: {
                        type: 'Point' as const,
                        coordinates: [lng, lat],
                    },
                };
            })
            .filter((point): point is NonNullable<typeof point> => point !== null);

        cluster.load(points);
        return cluster;
    }, [containers]);

    const clusters = useMemo(() => {
        if (!bounds) return [];
        
        return supercluster.getClusters(bounds as BBox, Math.floor(zoom));
    }, [supercluster, bounds, zoom]);

    return { clusters, supercluster };
}

import type { ViewState } from 'react-map-gl/maplibre';
import type { ContainerInfo, Bounds } from '../../types';
import { useSupercluster } from '../../hooks/useSupercluster';
import { ClusterMarker } from '../ClusterMarker/ClusterMarker';
import { ContainerMarker } from '../ContainerMarker/ContainerMarker';

interface ClusterLayerProps {
    containers: ContainerInfo[];
    bounds: Bounds | null;
    zoom: number;
    viewState: ViewState;
    onViewStateChange: (viewState: ViewState) => void;
    onContainerClick: (container: ContainerInfo) => void;
}

export function ClusterLayer({
    containers,
    bounds,
    zoom,
    viewState,
    onViewStateChange,
    onContainerClick
}: ClusterLayerProps) {
    const clusterBounds = bounds 
        ? [bounds.sw[0], bounds.sw[1], bounds.ne[0], bounds.ne[1]] as [number, number, number, number] 
        : null;
    
    const { clusters, supercluster } = useSupercluster({
        containers,
        bounds: clusterBounds,
        zoom,
    });

    return (
        <>
            {clusters.map((cluster) => {
                const [lng, lat] = cluster.geometry.coordinates;
                const { cluster: isCluster, point_count: pointCount } = cluster.properties;

                if (isCluster) {
                    return (
                        <ClusterMarker
                            key={`cluster-${cluster.id}`}
                            longitude={lng}
                            latitude={lat}
                            pointCount={pointCount}
                            clusterId={cluster.id as number}
                            onClusterClick={(lng, lat, zoom) => {
                                onViewStateChange({
                                    ...viewState,
                                    longitude: lng,
                                    latitude: lat,
                                    zoom: zoom,
                                });
                            }}
                            getExpansionZoom={(clusterId) => supercluster.getClusterExpansionZoom(clusterId)}
                        />
                    );
                }

                const container = cluster.properties.container as ContainerInfo;
                return (
                    <ContainerMarker
                        key={`container-${container.id}`}
                        container={container}
                        onClick={onContainerClick}
                    />
                );
            })}
        </>
    );
}

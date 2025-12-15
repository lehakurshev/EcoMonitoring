import { Marker } from 'react-map-gl/maplibre';
import type { MarkerEvent } from 'react-map-gl/maplibre';
import './ClusterMarker.css';
import React from "react";

interface ClusterMarkerProps {
    longitude: number;
    latitude: number;
    pointCount: number;
    clusterId: number;
    onClusterClick: (longitude: number, latitude: number, expansionZoom: number) => void;
    getExpansionZoom: (clusterId: number) => number;
}

export function ClusterMarker({
    longitude,
    latitude,
    pointCount,
    clusterId,
    onClusterClick,
    getExpansionZoom,
}: ClusterMarkerProps) {
    const size = Math.min(50 + Math.sqrt(pointCount) * 5, 80);
    const fontSize = size > 60 ? '16px' : '14px';

    const handleClick = (e: MarkerEvent<MouseEvent>) => {
        e.originalEvent.stopPropagation();
        const expansionZoom = Math.min(getExpansionZoom(clusterId), 20);
        onClusterClick(longitude, latitude, expansionZoom);
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
        e.currentTarget.style.transform = 'scale(1.1)';
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        e.currentTarget.style.transform = 'scale(1)';
    };

    return (
        <Marker
            longitude={longitude}
            latitude={latitude}
            anchor="center"
            onClick={handleClick}
        >
            <div
                className="cluster-marker"
                style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    fontSize: fontSize,
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {pointCount}
            </div>
        </Marker>
    );
}

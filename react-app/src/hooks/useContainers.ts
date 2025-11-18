import { useState, useCallback, useEffect } from 'react';
import type { Bounds } from '../types';
import { getContainersInArea } from '../api';
import type { ContainerInfo } from '../types';

export function useContainers(bounds: Bounds | null) {
    const [containers, setContainers] = useState<ContainerInfo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchContainers = async () => {
            if (!bounds) return;
            
            try {
                setLoading(true);
                
                const data = await getContainersInArea(
                    bounds.nw[1],
                    bounds.nw[0],
                    bounds.se[1],
                    bounds.se[0]
                );
                
                setContainers(data);
                console.log(`Загружено ${data.length} контейнеров в видимой области`);
            } catch (error) {
                console.error('Не удалось загрузить контейнеры:', error);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchContainers, 500);
        
        return () => clearTimeout(timeoutId);
    }, [bounds]);

    return { containers, loading };
}

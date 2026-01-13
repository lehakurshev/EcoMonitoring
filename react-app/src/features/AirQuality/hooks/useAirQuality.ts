import { useState, useEffect } from 'react';
import { getAirQualityData } from '../../../api';
import type { AirQualityData } from '../../../types';

export function useAirQuality() {
    const [airQualityData, setAirQualityData] = useState<AirQualityData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadAirQualityData = async () => {
        setIsLoading(true);
        try {
            const data = await getAirQualityData();
            setAirQualityData(data);
        } catch (error) {
            console.error('Ошибка при загрузке данных о качестве воздуха:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadAirQualityData();
    }, []);

    return { airQualityData, isLoading, refetch: loadAirQualityData };
}

import { useState, useEffect } from 'react';
import { getAirQualityData } from '../../../api';
import { mockAirQualityData } from '../../../mockAirQualityData';
import type { AirQualityData } from '../../../types';

export function useAirQuality() {
    const [airQualityData, setAirQualityData] = useState<AirQualityData[]>(mockAirQualityData);
    const [isLoading, setIsLoading] = useState(true);

    const loadAirQualityData = async () => {
        setIsLoading(true);
        try {
            const data = await getAirQualityData();
            // Если с API пришли данные, используем их, иначе оставляем моковые
            if (data && data.length > 0) {
                setAirQualityData(data);
            }
        } catch (error) {
            console.error('Ошибка при загрузке данных о качестве воздуха, используем моковые данные:', error);
            // При ошибке оставляем моковые данные
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadAirQualityData();
    }, []);

    return { airQualityData, isLoading, refetch: loadAirQualityData };
}

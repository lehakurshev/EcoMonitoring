import type { AirQualityData } from './types';

export const mockAirQualityData: AirQualityData[] = [
    {
        location: { latitude: 56.838631, longitude: 60.601436 },
        district: 'Верх-Исетский',
        pm25: 28,
        pm10: 42,
        so2: 8,
        no2: 25,
        co: 0.5,
        o3: 48,
        aqi: 65
    },
    {
        location: { latitude: 56.801683, longitude: 60.578559 },
        district: 'Ленинский',
        pm25: 52,
        pm10: 78,
        so2: 18,
        no2: 45,
        co: 1.2,
        o3: 62,
        aqi: 110
    },
    {
        location: { latitude: 56.899828, longitude: 60.365216 },
        district: 'Железнодорожный',
        pm25: 38,
        pm10: 55,
        so2: 10,
        no2: 32,
        co: 0.7,
        o3: 50,
        aqi: 80
    },
    {
        location: { latitude: 56.853991, longitude: 60.707818 },
        district: 'Кировский',
        pm25: 48,
        pm10: 70,
        so2: 15,
        no2: 42,
        co: 1.0,
        o3: 58,
        aqi: 100
    },
    {
        location: { latitude: 56.910509, longitude: 60.626292 },
        district: 'Орджоникидзевский',
        pm25: 58,
        pm10: 85,
        so2: 22,
        no2: 52,
        co: 1.5,
        o3: 68,
        aqi: 125
    },
    {
        location: { latitude: 56.69523, longitude: 60.547051 },
        district: 'Чкаловский',
        pm25: 32,
        pm10: 48,
        so2: 9,
        no2: 28,
        co: 0.6,
        o3: 45,
        aqi: 70
    },
    {
        location: { latitude: 56.787036, longitude: 60.838245 },
        district: 'Октябрьский',
        pm25: 42,
        pm10: 62,
        so2: 13,
        no2: 35,
        co: 0.9,
        o3: 52,
        aqi: 88
    },
    {
        location: { latitude: 56.792063, longitude: 60.48703 },
        district: 'Академический',
        pm25: 22,
        pm10: 35,
        so2: 6,
        no2: 20,
        co: 0.4,
        o3: 42,
        aqi: 55
    }
];

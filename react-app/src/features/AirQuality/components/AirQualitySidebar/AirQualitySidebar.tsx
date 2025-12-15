import type { AirQualityData } from '../../../../types.ts';
import './AirQualitySidebar.css';

interface AirQualitySidebarProps {
    data: AirQualityData | null;
    onClose: () => void;
}

export function AirQualitySidebar({ data, onClose }: AirQualitySidebarProps) {
    if (!data) return null;

    const getPollutantLevel = (value: number, thresholds: number[]) => {
        if (value <= thresholds[0]) return { level: 'Хорошо', color: '#4CAF50' };
        if (value <= thresholds[1]) return { level: 'Умеренно', color: '#FDD835' };
        if (value <= thresholds[2]) return { level: 'Плохо', color: '#FF9800' };
        return { level: 'Опасно', color: '#E53935' };
    };

    const getAQILevel = (aqi: number) => {
        if (aqi <= 50) return { level: 'Хорошо', color: '#4CAF50' };
        if (aqi <= 100) return { level: 'Умеренно', color: '#FDD835' };
        if (aqi <= 150) return { level: 'Нездорово для чувствительных групп', color: '#FF9800' };
        if (aqi <= 200) return { level: 'Нездорово', color: '#E53935' };
        if (aqi <= 300) return { level: 'Очень нездорово', color: '#9C27B0' };
        return { level: 'Опасно', color: '#B71C1C' };
    };

    const pollutants = [
        { name: 'PM2.5', value: data.pm25, unit: 'мкг/м³', thresholds: [12, 35, 55] },
        { name: 'PM10', value: data.pm10, unit: 'мкг/м³', thresholds: [54, 154, 254] },
        { name: 'SO₂', value: data.so2, unit: 'мкг/м³', thresholds: [20, 80, 250] },
        { name: 'NO₂', value: data.no2, unit: 'мкг/м³', thresholds: [40, 70, 150] },
        { name: 'CO', value: data.co, unit: 'мг/м³', thresholds: [4, 9, 15] },
        { name: 'O₃', value: data.o3, unit: 'мкг/м³', thresholds: [60, 100, 140] }
    ];

    const aqiStatus = getAQILevel(data.aqi);

    return (
        <div className="air-quality-sidebar">
            <div className="air-quality-sidebar__header">
                <h2 className="air-quality-sidebar__title">Качество воздуха</h2>
                <button
                    className="air-quality-sidebar__close"
                    onClick={onClose}
                    aria-label="Закрыть"
                >
                    ×
                </button>
            </div>

            <div className="air-quality-sidebar__content">
                <div className="air-quality-sidebar__district">
                    <h3>Район: {data.district}</h3>
                </div>

                <div className="air-quality-sidebar__aqi" style={{ backgroundColor: aqiStatus.color }}>
                    <div className="aqi-value">{data.aqi}</div>
                    <div className="aqi-level">{aqiStatus.level}</div>
                </div>

                <div className="air-quality-sidebar__pollutants">
                    <h3>Загрязнители</h3>
                    {pollutants.map((pollutant) => {
                        const status = getPollutantLevel(pollutant.value, pollutant.thresholds);
                        const percentage = Math.min((pollutant.value / pollutant.thresholds[2]) * 100, 100);

                        return (
                            <div key={pollutant.name} className="pollutant-item">
                                <div className="pollutant-header">
                                    <span className="pollutant-name">{pollutant.name}</span>
                                    <span className="pollutant-value">
                                        {pollutant.value} {pollutant.unit}
                                    </span>
                                </div>
                                <div className="pollutant-bar-container">
                                    <div
                                        className="pollutant-bar"
                                        style={{
                                            width: `${percentage}%`,
                                            backgroundColor: status.color
                                        }}
                                    />
                                </div>
                                <div className="pollutant-status" style={{ color: status.color }}>
                                    {status.level}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

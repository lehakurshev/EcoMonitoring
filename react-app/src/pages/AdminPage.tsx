import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { uploadAirQualityData } from '../api';
import type { AirQualityData } from '../types';
import './AdminPage.css';

export function AdminPage() {
    const [file, setFile] = useState<File | null>(null);
    const [jsonInput, setJsonInput] = useState('');
    const [uploadMode, setUploadMode] = useState<'file' | 'json'>('file');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setMessage(null);
        }
    };

    const validateAirQualityData = (data: any): data is AirQualityData[] => {
        if (!Array.isArray(data)) return false;
        
        return data.every(item => {
            return (
                item.location &&
                typeof item.location.latitude === 'number' &&
                typeof item.location.longitude === 'number' &&
                typeof item.district === 'string' &&
                typeof item.pm25 === 'number' &&
                typeof item.pm10 === 'number' &&
                typeof item.so2 === 'number' &&
                typeof item.no2 === 'number' &&
                typeof item.co === 'number' &&
                typeof item.o3 === 'number' &&
                typeof item.aqi === 'number'
            );
        });
    };

    const handleFileUpload = async () => {
        if (!file) {
            setMessage({ type: 'error', text: 'Пожалуйста, выберите файл' });
            return;
        }

        setIsLoading(true);
        setMessage(null);
        
        try {
            const text = await file.text();
            const data = JSON.parse(text);

            if (!validateAirQualityData(data)) {
                setMessage({ type: 'error', text: 'Неверный формат данных. Проверьте структуру JSON.' });
                setIsLoading(false);
                return;
            }

            await uploadAirQualityData(data);
            setMessage({ type: 'success', text: `Успешно загружено ${data.length} записей` });
            setFile(null);
        } catch (error) {
            console.error('Ошибка при загрузке файла:', error);
            const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
            setMessage({ type: 'error', text: `Ошибка при загрузке файла: ${errorMessage}` });
        } finally {
            setIsLoading(false);
        }
    };

    const handleJsonUpload = async () => {
        if (!jsonInput.trim()) {
            setMessage({ type: 'error', text: 'Пожалуйста, введите JSON данные' });
            return;
        }

        setIsLoading(true);
        setMessage(null);
        
        try {
            const data = JSON.parse(jsonInput);

            if (!validateAirQualityData(data)) {
                setMessage({ type: 'error', text: 'Неверный формат данных. Проверьте структуру JSON.' });
                setIsLoading(false);
                return;
            }

            await uploadAirQualityData(data);
            setMessage({ type: 'success', text: `Успешно загружено ${data.length} записей` });
            setJsonInput('');
        } catch (error) {
            console.error('Ошибка при обработке JSON:', error);
            const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
            setMessage({ type: 'error', text: `Ошибка при обработке JSON: ${errorMessage}` });
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const exampleJson = `[
  {
    "location": { "latitude": 56.8386, "longitude": 60.6014 },
    "district": "Верх-Исетский",
    "pm25": 28,
    "pm10": 42,
    "so2": 8,
    "no2": 25,
    "co": 0.5,
    "o3": 48,
    "aqi": 65
  }
]`;

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>Админ-панель</h1>
                <div className="admin-actions">
                    <button onClick={() => navigate('/')} className="btn-secondary">
                        Вернуться на карту
                    </button>
                    <button onClick={handleLogout} className="btn-logout">
                        Выйти
                    </button>
                </div>
            </div>

            <div className="admin-content">
                <div className="upload-section">
                    <h2>Загрузка данных о качестве воздуха</h2>
                    
                    <div className="mode-selector">
                        <button
                            className={uploadMode === 'file' ? 'active' : ''}
                            onClick={() => setUploadMode('file')}
                        >
                            Загрузить файл
                        </button>
                        <button
                            className={uploadMode === 'json' ? 'active' : ''}
                            onClick={() => setUploadMode('json')}
                        >
                            Вставить JSON
                        </button>
                    </div>

                    {uploadMode === 'file' ? (
                        <div className="upload-file">
                            <div className="file-input-wrapper">
                                <input
                                    type="file"
                                    id="file-upload"
                                    accept=".json"
                                    onChange={handleFileChange}
                                />
                                <label htmlFor="file-upload" className="file-label">
                                    {file ? file.name : 'Выберите JSON файл'}
                                </label>
                            </div>
                            <button
                                onClick={handleFileUpload}
                                disabled={!file || isLoading}
                                className="btn-upload"
                            >
                                {isLoading ? 'Загрузка...' : 'Загрузить'}
                            </button>
                        </div>
                    ) : (
                        <div className="upload-json">
                            <textarea
                                value={jsonInput}
                                onChange={(e) => setJsonInput(e.target.value)}
                                placeholder="Вставьте JSON данные здесь..."
                                rows={12}
                            />
                            <button
                                onClick={handleJsonUpload}
                                disabled={!jsonInput.trim() || isLoading}
                                className="btn-upload"
                            >
                                {isLoading ? 'Загрузка...' : 'Загрузить'}
                            </button>
                        </div>
                    )}

                    {message && (
                        <div className={`message ${message.type}`}>
                            {message.text}
                        </div>
                    )}
                </div>

                <div className="info-section">
                    <h3>Формат данных</h3>
                    <p>Данные должны быть в формате JSON массива объектов со следующей структурой:</p>
                    <pre className="code-example">{exampleJson}</pre>
                    
                    <div className="info-block">
                        <h4>Описание полей:</h4>
                        <ul>
                            <li><strong>location</strong> - координаты точки замера (latitude, longitude)</li>
                            <li><strong>district</strong> - название района</li>
                            <li><strong>pm25</strong> - концентрация частиц PM2.5 (мкг/м³)</li>
                            <li><strong>pm10</strong> - концентрация частиц PM10 (мкг/м³)</li>
                            <li><strong>so2</strong> - диоксид серы (мкг/м³)</li>
                            <li><strong>no2</strong> - диоксид азота (мкг/м³)</li>
                            <li><strong>co</strong> - угарный газ (мг/м³)</li>
                            <li><strong>o3</strong> - озон (мкг/м³)</li>
                            <li><strong>aqi</strong> - индекс качества воздуха (0-500)</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

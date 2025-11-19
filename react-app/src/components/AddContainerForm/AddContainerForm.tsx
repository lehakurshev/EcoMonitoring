import { useState } from 'react';
import type { CreateContainerRequest } from '../../types';
import { WasteType, getWasteTypeName } from '../../types';
import './AddContainerForm.css';

interface AddContainerFormProps {
    latitude: number;
    longitude: number;
    onSubmit: (container: CreateContainerRequest) => Promise<void>;
    onCancel: () => void;
}

export function AddContainerForm({ latitude, longitude, onSubmit, onCancel }: AddContainerFormProps) {
    const [wasteTypes, setWasteTypes] = useState<number[]>([]);
    const [settlement, setSettlement] = useState('');
    const [district, setDistrict] = useState('');
    const [street, setStreet] = useState('');
    const [house, setHouse] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const allWasteTypes = Object.values(WasteType).filter(v => typeof v === 'number') as number[];

    const toggleWasteType = (type: number) => {
        if (wasteTypes.includes(type)) {
            setWasteTypes(wasteTypes.filter(t => t !== type));
        } else {
            setWasteTypes([...wasteTypes, type]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (wasteTypes.length === 0) {
            setError('Выберите хотя бы один тип отходов');
            return;
        }

        if (!settlement.trim() || !street.trim()) {
            setError('Заполните обязательные поля адреса');
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            await onSubmit({
                wasteTypes,
                latitude,
                longitude,
                settlement: settlement.trim(),
                district: district.trim(),
                street: street.trim(),
                house: house.trim()
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка при создании контейнера');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="add-container-overlay" onClick={onCancel}>
            <div className="add-container-form" onClick={(e) => e.stopPropagation()}>
                <div className="form-header">
                    <h2>Добавить контейнер</h2>
                    <button className="close-button" onClick={onCancel}>×</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-section">
                        <h3>Координаты</h3>
                        <div className="coordinates">
                            <span>Широта: {latitude.toFixed(6)}</span>
                            <span>Долгота: {longitude.toFixed(6)}</span>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Типы отходов</h3>
                        <div className="waste-types-grid">
                            {allWasteTypes.map((type) => (
                                <label key={type} className="waste-type-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={wasteTypes.includes(type)}
                                        onChange={() => toggleWasteType(type)}
                                        disabled={submitting}
                                    />
                                    <span>{getWasteTypeName(type as import('../../types').WasteType)}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Адрес</h3>
                        <div className="form-group">
                            <label>Населенный пункт *</label>
                            <input
                                type="text"
                                value={settlement}
                                onChange={(e) => setSettlement(e.target.value)}
                                placeholder="Например: Екатеринбург"
                                required
                                disabled={submitting}
                            />
                        </div>

                        <div className="form-group">
                            <label>Район</label>
                            <input
                                type="text"
                                value={district}
                                onChange={(e) => setDistrict(e.target.value)}
                                placeholder="Например: Верх-Исетский"
                                disabled={submitting}
                            />
                        </div>

                        <div className="form-group">
                            <label>Улица *</label>
                            <input
                                type="text"
                                value={street}
                                onChange={(e) => setStreet(e.target.value)}
                                placeholder="Например: ул. Ленина"
                                required
                                disabled={submitting}
                            />
                        </div>

                        <div className="form-group">
                            <label>Дом</label>
                            <input
                                type="text"
                                value={house}
                                onChange={(e) => setHouse(e.target.value)}
                                placeholder="Например: 10"
                                disabled={submitting}
                            />
                        </div>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <div className="form-actions">
                        <button type="button" onClick={onCancel} disabled={submitting}>
                            Отмена
                        </button>
                        <button type="submit" disabled={submitting}>
                            {submitting ? 'Создание...' : 'Добавить контейнер'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

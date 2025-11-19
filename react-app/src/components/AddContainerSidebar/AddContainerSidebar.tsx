import { useState } from 'react';
import type { CreateContainerRequest } from '../../types';
import { WasteType, getWasteTypeName } from '../../types';
import './AddContainerSidebar.css';

interface AddContainerSidebarProps {
    latitude: number;
    longitude: number;
    onSubmit: (container: CreateContainerRequest) => Promise<void>;
    onCancel: () => void;
}

export function AddContainerSidebar({ latitude, longitude, onSubmit, onCancel }: AddContainerSidebarProps) {
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

        if (!settlement.trim() || !district.trim() || !street.trim() || !house.trim()) {
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
            setSubmitting(false);
        }
    };

    return (
        <div className="add-container-sidebar">
            <div className="add-container-sidebar__header">
                <h2 className="add-container-sidebar__title">Добавить контейнер</h2>
                <button 
                    className="add-container-sidebar__close"
                    onClick={onCancel}
                    aria-label="Закрыть"
                >
                    ×
                </button>
            </div>
            
            <div className="add-container-sidebar__content">
                <form onSubmit={handleSubmit}>
                    <div className="add-container-sidebar__section">
                        <h3 className="add-container-sidebar__section-title">Координаты</h3>
                        <div className="coordinates-display">
                            <div>Широта: {latitude.toFixed(6)}</div>
                            <div>Долгота: {longitude.toFixed(6)}</div>
                        </div>
                    </div>

                    <div className="add-container-sidebar__section">
                        <h3 className="add-container-sidebar__section-title">Типы отходов</h3>
                        <div className="waste-types-list">
                            {allWasteTypes.map((type) => (
                                <label key={type} className="waste-type-item">
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

                    <div className="add-container-sidebar__section">
                        <h3 className="add-container-sidebar__section-title">Адрес</h3>
                        
                        <div className="form-field">
                            <label>Населенный пункт *</label>
                            <input
                                type="text"
                                value={settlement}
                                onChange={(e) => setSettlement(e.target.value)}
                                placeholder="Екатеринбург"
                                required
                                disabled={submitting}
                            />
                        </div>

                        <div className="form-field">
                            <label>Район *</label>
                            <select
                                value={district}
                                onChange={(e) => setDistrict(e.target.value)}
                                required
                                disabled={submitting}
                            >
                                <option value="">Выберите район</option>
                                <option value="Академический">Академический</option>
                                <option value="Верх-Исетский">Верх-Исетский</option>
                                <option value="Железнодорожный">Железнодорожный</option>
                                <option value="Кировский">Кировский</option>
                                <option value="Ленинский">Ленинский</option>
                                <option value="Октябрьский">Октябрьский</option>
                                <option value="Орджоникидзевский">Орджоникидзевский</option>
                                <option value="Чкаловский">Чкаловский</option>
                            </select>
                        </div>

                        <div className="form-field">
                            <label>Улица *</label>
                            <input
                                type="text"
                                value={street}
                                onChange={(e) => setStreet(e.target.value)}
                                placeholder="ул. Ленина"
                                required
                                disabled={submitting}
                            />
                        </div>

                        <div className="form-field">
                            <label>Дом *</label>
                            <input
                                type="text"
                                value={house}
                                onChange={(e) => setHouse(e.target.value)}
                                placeholder="10"
                                required
                                disabled={submitting}
                            />
                        </div>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <div className="form-actions">
                        <button type="button" onClick={onCancel} disabled={submitting} className="cancel-button">
                            Отмена
                        </button>
                        <button type="submit" disabled={submitting} className="submit-button">
                            {submitting ? 'Создание...' : 'Добавить'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

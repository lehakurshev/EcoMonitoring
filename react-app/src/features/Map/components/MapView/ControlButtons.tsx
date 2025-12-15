interface ControlButtonsProps {
    showContainers: boolean;
    showGreenZones: boolean;
    showAirQuality: boolean;
    addingContainer: boolean;
    onToggleContainers: () => void;
    onToggleGreenZones: () => void;
    onToggleAirQuality: () => void;
    onToggleAddMode: () => void;
}

export function ControlButtons({
    showContainers,
    showGreenZones,
    showAirQuality,
    addingContainer,
    onToggleContainers,
    onToggleGreenZones,
    onToggleAirQuality,
    onToggleAddMode
} : ControlButtonsProps) {
    return (
        <>
            <button
                className={`toggle-containers-button ${showContainers ? 'active' : ''}`}
                onClick={onToggleContainers}
                title={showContainers ? 'Скрыть контейнеры' : 'Показать контейнеры'}
            >
                <span>🗑️</span>
            </button>

            <button
                className={`toggle-greenzones-button ${showGreenZones ? 'active' : ''}`}
                onClick={onToggleGreenZones}
                title={showGreenZones ? 'Скрыть зеленые зоны' : 'Показать зеленые зоны'}
            >
                <span>🌳</span>
            </button>

            <button
                className={`toggle-airquality-button ${showAirQuality ? 'active' : ''}`}
                onClick={onToggleAirQuality}
                title={showAirQuality ? 'Скрыть качество воздуха' : 'Показать качество воздуха'}
            >
                <span>🌫️</span>
            </button>

            {showContainers && (
                <button
                    className={`add-container-button ${addingContainer ? 'active' : ''}`}
                    onClick={onToggleAddMode}
                    title={addingContainer ? 'Отменить добавление' : 'Добавить контейнер'}
                >
                    <span>➕</span>
                </button>
            )}

            {addingContainer && (
                <div className="add-container-hint">
                    Кликните на карту, чтобы выбрать место для контейнера
                </div>
            )}
        </>
    );
}

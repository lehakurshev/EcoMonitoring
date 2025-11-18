import type { ContainerInfo } from '../../types';
import './ContainerSidebar.css';

interface ContainerSidebarProps {
    container: ContainerInfo | null;
    onClose: () => void;
}

export function ContainerSidebar({ container, onClose }: ContainerSidebarProps) {
    if (!container) return null;

    return (
        <div className="container-sidebar">
            <div className="container-sidebar__header">
                <h2 className="container-sidebar__title">Мусорный контейнер</h2>
                <button 
                    className="container-sidebar__close"
                    onClick={onClose}
                    aria-label="Закрыть"
                >
                    ×
                </button>
            </div>
            
            <div className="container-sidebar__content">
                <div className="container-sidebar__section">
                    <h3 className="container-sidebar__section-title">Адрес</h3>
                    <p className="container-sidebar__address">
                        {container.address.settlement}<br />
                        {container.address.district}<br />
                        {container.address.street}, {container.address.house}
                    </p>
                </div>
            </div>
        </div>
    );
}

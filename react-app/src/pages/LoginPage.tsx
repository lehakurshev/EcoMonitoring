import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

export function LoginPage() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        const success = await login(password);
        
        if (success) {
            navigate('/admin');
        } else {
            setError('Неверный пароль');
            setPassword('');
        }
        
        setIsLoading(false);
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h1>Вход в админ-панель</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="password">Пароль:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Введите пароль"
                            disabled={isLoading}
                            autoFocus
                        />
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <button type="submit" className="login-button" disabled={isLoading}>
                        {isLoading ? 'Проверка...' : 'Войти'}
                    </button>
                </form>
                <div className="back-link">
                    <a href="/">← Вернуться на карту</a>
                </div>
            </div>
        </div>
    );
}

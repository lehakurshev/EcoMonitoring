import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (password: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_PASSWORD_HASH = import.meta.env.VITE_ADMIN_PASSWORD_HASH;

async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'EcoMonitoring_Salt_2026');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        const authTime = localStorage.getItem('authTime');
        const isAuth = localStorage.getItem('isAdminAuthenticated');

        if (authTime && isAuth === 'true') {
            const timeDiff = Date.now() - parseInt(authTime);
            const hoursDiff = timeDiff / (1000 * 60 * 60);
            if (hoursDiff < 24) {
                return true;
            }
        }

        localStorage.removeItem('isAdminAuthenticated');
        localStorage.removeItem('authTime');
        return false;
    });

    const login = async (password: string): Promise<boolean> => {
        try {
            const hash = await hashPassword(password);
            
            if (hash === ADMIN_PASSWORD_HASH) {
                setIsAuthenticated(true);
                localStorage.setItem('isAdminAuthenticated', 'true');
                localStorage.setItem('authTime', Date.now().toString());
                return true;
            }

            await new Promise(resolve => setTimeout(resolve, 1000));
            return false;
        } catch (error) {
            console.error('Ошибка аутентификации:', error);
            return false;
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('isAdminAuthenticated');
        localStorage.removeItem('authTime');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

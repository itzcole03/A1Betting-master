import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { errorLogger } from '../utils/errorLogger';
const AuthContext = createContext(undefined);
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const currentUser = await authService.getCurrentUser();
                setUser(currentUser);
            }
            catch (err) {
                errorLogger.logError(err, { context: 'AuthProvider.initializeAuth' });
            }
            finally {
                setLoading(false);
            }
        };
        initializeAuth();
    }, []);
    const login = async (email, password) => {
        try {
            setLoading(true);
            setError(null);
            const user = await authService.login(email, password);
            setUser(user);
        }
        catch (err) {
            const error = err;
            setError(error.message);
            errorLogger.logError(error, { context: 'AuthProvider.login' });
            throw error;
        }
        finally {
            setLoading(false);
        }
    };
    const logout = async () => {
        try {
            setLoading(true);
            await authService.logout();
            setUser(null);
        }
        catch (err) {
            const error = err;
            setError(error.message);
            errorLogger.logError(error, { context: 'AuthProvider.logout' });
            throw error;
        }
        finally {
            setLoading(false);
        }
    };
    const register = async (email, password, name) => {
        try {
            setLoading(true);
            setError(null);
            const user = await authService.register(email, password, name);
            setUser(user);
        }
        catch (err) {
            const error = err;
            setError(error.message);
            errorLogger.logError(error, { context: 'AuthProvider.register' });
            throw error;
        }
        finally {
            setLoading(false);
        }
    };
    const value = {
        user,
        loading,
        error,
        login,
        logout,
        register,
    };
    return _jsx(AuthContext.Provider, { value: value, children: children });
};

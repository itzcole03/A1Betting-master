import { jsx as _jsx } from "react/jsx-runtime";
import React, { createContext, useContext, useState, useEffect } from 'react';
export const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const validateToken = React.useCallback(async (token) => {
        try {
            const response = await fetch('https://api.betproai.com/auth/validate', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            }
            else {
                localStorage.removeItem('auth_token');
            }
        }
        catch (error) {
            console.error('Token validation failed:', error);
            localStorage.removeItem('auth_token');
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            validateToken(token);
        }
        else {
            setIsLoading(false);
        }
    }, [validateToken]);
    const login = async (email, password) => {
        setIsLoading(true);
        try {
            const response = await fetch('https://api.betproai.com/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            if (!response.ok) {
                throw new Error('Login failed');
            }
            const { token, user: userData } = await response.json();
            localStorage.setItem('auth_token', token);
            setUser(userData);
        }
        catch (error) {
            console.error('Login error:', error);
            throw error;
        }
        finally {
            setIsLoading(false);
        }
    };
    const register = async (email, password, username) => {
        setIsLoading(true);
        try {
            const response = await fetch('https://api.betproai.com/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, username }),
            });
            if (!response.ok) {
                throw new Error('Registration failed');
            }
            const { token, user: userData } = await response.json();
            localStorage.setItem('auth_token', token);
            setUser(userData);
        }
        catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
        finally {
            setIsLoading(false);
        }
    };
    const logout = () => {
        localStorage.removeItem('auth_token');
        setUser(null);
    };
    const updateProfile = async (data) => {
        const token = localStorage.getItem('auth_token');
        if (!token)
            throw new Error('Not authenticated');
        try {
            const response = await fetch('https://api.betproai.com/auth/profile', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error('Profile update failed');
            }
            const updatedUser = await response.json();
            setUser(updatedUser);
        }
        catch (error) {
            console.error('Profile update error:', error);
            throw error;
        }
    };
    return (_jsx(AuthContext.Provider, { value: {
            user,
            isLoading,
            login,
            logout,
            register,
            updateProfile,
        }, children: children }));
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

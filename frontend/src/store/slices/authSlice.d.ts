import type { StateCreator } from 'zustand';
import { AppStore } from '../../stores/useAppStore';
export interface AuthSlice {
    user: any | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    webSocketAuthStatus: 'pending' | 'success' | 'failure' | 'required' | null;
    webSocketClientId: string | null;
    initializeAuth: () => Promise<void>;
    login: (credentials: {
        email: string;
        password: string;
    }) => Promise<void>;
    logout: () => Promise<void>;
    setUser: (user: any | null) => void;
    setToken: (token: string | null) => void;
    setWebSocketAuthStatus: (status: AuthSlice['webSocketAuthStatus']) => void;
    setWebSocketClientId: (clientId: string | null) => void;
}
export declare const initialAuthState: Omit<AuthSlice, 'initializeAuth' | 'login' | 'logout' | 'setUser' | 'setToken' | 'setWebSocketAuthStatus' | 'setWebSocketClientId'>;
export declare function getAuthService(): Promise<any>;
export declare const createAuthSlice: StateCreator<AppStore, [], [], AuthSlice>;

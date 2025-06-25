import React from 'react';
import { User } from '../types/core';
interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    register: (email: string, password: string, username: string) => Promise<void>;
    updateProfile: (data: Partial<User>) => Promise<void>;
}
export declare const AuthContext: React.Context<AuthContextType | undefined>;
export declare const AuthProvider: React.FC<{
    children: React.ReactNode;
}>;
export declare const useAuth: () => AuthContextType;
export {};

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    status: 'active' | 'suspended';
    lastLogin: string;
}
export interface SystemLog {
    id: string;
    message: string;
    level: 'info' | 'warning' | 'error';
    timestamp: string;
}
export interface SystemMetrics {
    totalUsers: number;
    activeSessions: number;
    totalPredictions: number;
    uptime: string;
}
declare class AdminService {
    getUsers(): Promise<User[]>;
    updateUserStatus(userId: string, status: 'active' | 'suspended'): Promise<void>;
    getLogs(): Promise<SystemLog[]>;
    getMetrics(): Promise<SystemMetrics>;
    updateSystemSettings(settings: {
        maintenanceMode: boolean;
        logLevel: string;
        backupSchedule: string;
    }): Promise<void>;
    refreshCache(): Promise<void>;
    backupDatabase(): Promise<void>;
}
export declare const adminService: AdminService;
export {};

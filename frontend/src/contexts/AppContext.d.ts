import React from "react";
interface AppState {
    darkMode: boolean;
    connectedSources: number;
    dataQuality: number;
    totalSources: number;
    isLoading: boolean;
    lastUpdate: Date | null;
    connectionStatus: "connected" | "connecting" | "disconnected";
    notifications: Notification[];
}
interface Notification {
    id: string;
    message: string;
    type: "success" | "warning" | "error" | "info";
    timestamp: Date;
}
interface AppContextValue {
    state: AppState;
    toggleDarkMode: () => void;
    setConnectedSources: (count: number) => void;
    setDataQuality: (quality: number) => void;
    setLoading: (loading: boolean) => void;
    updateConnectionStatus: (status: "connected" | "connecting" | "disconnected") => void;
    addNotification: (notification: Omit<Notification, "id" | "timestamp">) => void;
    removeNotification: (id: string) => void;
    refreshData: () => Promise<void>;
}
declare const AppContext: React.Context<AppContextValue | undefined>;
export declare const AppProvider: React.FC<{
    children: React.ReactNode;
}>;
export declare const useApp: () => AppContextValue;
export default AppContext;

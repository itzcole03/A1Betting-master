export type AlertType = 'INJURY' | 'LINEUP' | 'WEATHER' | 'LINE_MOVEMENT' | 'ARBITRAGE';
export interface Alert {
    id: string;
    type: AlertType;
    severity: 'low' | 'medium' | 'high';
    title: string;
    message: string;
    timestamp: number;
    metadata: {
        sportId?: string;
        gameId?: string;
        playerId?: string;
        teamId?: string;
        impactScore?: number;
        lineMovement?: {
            from: number;
            to: number;
            book: string;
        };
    };
    read: boolean;
}
interface SmartAlertsConfig {
    enabledTypes?: AlertType[];
    minSeverity?: 'low' | 'medium' | 'high';
    wsEndpoint: string;
    onNewAlert?: (alert: Alert) => void;
}
interface SmartAlertsResult {
    alerts: Alert[];
    unreadCount: number;
    markAsRead: (alertId: string) => void;
    markAllAsRead: () => void;
    clearAlerts: () => void;
    isConnected: boolean;
}
export declare function useSmartAlerts({ enabledTypes, minSeverity, wsEndpoint, onNewAlert }: SmartAlertsConfig): SmartAlertsResult;
export {};

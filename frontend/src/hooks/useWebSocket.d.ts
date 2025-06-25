import { WSMessage } from "../types";
interface UseWebSocketOptions {
    url: string;
    onMessage?: (message: WSMessage) => void;
    reconnectAttempts?: number;
    reconnectDelay?: number;
    autoReconnect?: boolean;
}
export declare const useWebSocket: ({ url, onMessage, reconnectAttempts, reconnectDelay, autoReconnect, }: UseWebSocketOptions) => {
    send: (data: any) => void;
    disconnect: () => void;
    reconnect: () => void;
    isConnected: boolean;
};
export {};

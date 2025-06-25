import React from 'react';
interface WebSocketContextType {
    isConnected: boolean;
    lastMessage: any;
    subscribe: (event: string, callback: (data: any) => void) => void;
    unsubscribe: (event: string, callback: (data: any) => void) => void;
}
export declare const useWebSocket: () => WebSocketContextType;
export declare const WebSocketProvider: React.FC<{
    children: React.ReactNode;
}>;
export {};

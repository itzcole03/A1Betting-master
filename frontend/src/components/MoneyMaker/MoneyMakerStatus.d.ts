import React from 'react';
import { EngineStatus } from '@/types';
interface MoneyMakerStatusProps {
    status: EngineStatus;
    lastUpdate: string;
    isConnected: boolean;
}
export declare const MoneyMakerStatus: React.FC<MoneyMakerStatusProps>;
export {};

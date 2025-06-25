import { useMemo } from 'react';

export interface ConfigFlags {
    enableBetSlip: boolean;
    enableAdvancedAnalytics: boolean;
    enableRealTimeData: boolean;
    enablePrizePicks: boolean;
    enableLineupBuilder: boolean;
    debugMode: boolean;
    mockMode: boolean;
    [key: string]: boolean;
}

export const useConfigFlags = (): ConfigFlags => {
    return useMemo(() => ({
        enableBetSlip: true,
        enableAdvancedAnalytics: true,
        enableRealTimeData: true,
        enablePrizePicks: true,
        enableLineupBuilder: true,
        debugMode: process.env.NODE_ENV === 'development',
        mockMode: false,
    }), []);
};

export default useConfigFlags;

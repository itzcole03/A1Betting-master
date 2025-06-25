import type { PlayerProp, Opportunity, OddsUpdate } from '../types/core';
import type { Sport, PropType } from '../types/common';
interface UseBettingDataOptions {
    sport?: Sport;
    propType?: PropType;
    autoRefresh?: boolean;
    refreshInterval?: number;
    minOddsChange?: number;
    onNewOpportunity?: (opportunity: Opportunity) => void;
}
export declare const useBettingData: ({ sport, propType, autoRefresh, refreshInterval, minOddsChange, onNewOpportunity }?: UseBettingDataOptions) => {
    props: PlayerProp[];
    oddsUpdates: OddsUpdate[];
    opportunities: Opportunity[];
    isLoading: boolean;
    isConnected: any;
    error: Error | null;
    refresh: () => void;
};
export {};

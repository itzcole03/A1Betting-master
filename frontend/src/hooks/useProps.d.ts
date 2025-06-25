import type { Sport, PropType } from '@/types/core';
interface UsePropsOptions {
    autoRefresh?: boolean;
    refreshInterval?: number;
    sport?: Sport;
    propType?: PropType;
}
export declare const useProps: ({ autoRefresh, refreshInterval, sport, propType }?: UsePropsOptions) => {
    props: PlayerProp[];
    opportunities: Opportunity[];
    isLoading: boolean;
    error: Error | null;
    refreshProps: () => void;
};
export {};

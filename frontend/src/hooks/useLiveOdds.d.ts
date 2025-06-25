import { PlayerProp, Sport, PropType } from '@/types';
interface UseLiveOddsOptions {
    sport?: Sport;
    propType?: PropType;
    minOddsChange?: number;
}
export declare const useLiveOdds: ({ sport, propType, minOddsChange }?: UseLiveOddsOptions) => {
    updates: OddsUpdate[];
    activeProps: PlayerProp[];
    isConnected: boolean;
    subscribe: (props: PlayerProp[]) => void;
    unsubscribe: (propIds: string[]) => void;
    clearUpdates: () => void;
};
export {};

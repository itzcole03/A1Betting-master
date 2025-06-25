import { StateCreator } from 'zustand';
import { PrizePicksEntry, PrizePicksProps, PrizePicksPlayer, PrizePicksLines } from '../../../../shared/prizePicks';
import { AppStore } from '../../stores/useAppStore';
export interface PrizePicksSlice {
    props: PrizePicksProps[];
    currentPrizePicksPlayer: PrizePicksPlayer | null;
    currentPrizePicksLines: PrizePicksLines | null;
    entries: PrizePicksEntry[];
    isLoadingProps: boolean;
    isLoadingEntries: boolean;
    isLoadingPlayer: boolean;
    isLoadingLines: boolean;
    error: string | null;
    fetchProps: (league?: string, statType?: string) => Promise<void>;
    fetchPrizePicksPlayer: (playerIdOrName: string) => Promise<void>;
    fetchPrizePicksLines: (propId: string) => Promise<void>;
    setProps: (props: PrizePicksProps[]) => void;
    fetchEntries: () => Promise<void>;
    addEntry: (entry: PrizePicksEntry) => void;
    updateEntry: (entry: PrizePicksEntry) => void;
}
export declare const initialPrizePicksState: Pick<PrizePicksSlice, 'props' | 'currentPrizePicksPlayer' | 'currentPrizePicksLines' | 'entries' | 'isLoadingProps' | 'isLoadingEntries' | 'isLoadingPlayer' | 'isLoadingLines' | 'error'>;
export declare const createPrizePicksSlice: StateCreator<AppStore, [], [], PrizePicksSlice>;

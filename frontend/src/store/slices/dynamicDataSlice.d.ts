import type { StateCreator } from 'zustand';
import type { DailyFantasyProjection } from '../../types/fantasy';
import type { ESPNHeadline } from '../../types/news';
import type { SocialSentimentData } from '../../types/sentiment';
import type { OddsData } from '../../types/betting';
export type ActiveSubscription = {
    feedName: string;
    subscribedAt: string;
    [key: string]: unknown;
};
import type { AppStore } from '../useAppStore';
export interface DynamicDataSlice {
    sentiments: Record<string, SocialSentimentData>;
    headlines: ESPNHeadline[];
    dailyFantasyProjections: DailyFantasyProjection[];
    liveOdds: Record<string, OddsData>;
    activeSubscriptions: ActiveSubscription[];
    isLoadingSentiments: boolean;
    isLoadingHeadlines: boolean;
    isLoadingFantasyProjections: boolean;
    error: string | null;
    fetchSentiments: (topic: string) => Promise<void>;
    fetchHeadlines: () => Promise<void>;
    fetchDailyFantasyProjections: (date: string, league?: string) => Promise<void>;
    updateLiveOdd: (odd: OddsData) => void;
    addSubscription: (subscription: ActiveSubscription) => void;
    removeSubscription: (feedName: string) => void;
}
export declare const initialDynamicDataState: Pick<DynamicDataSlice, 'sentiments' | 'headlines' | 'dailyFantasyProjections' | 'liveOdds' | 'activeSubscriptions' | 'isLoadingSentiments' | 'isLoadingHeadlines' | 'isLoadingFantasyProjections' | 'error'>;
export declare const createDynamicDataSlice: StateCreator<AppStore, [], [], DynamicDataSlice>;

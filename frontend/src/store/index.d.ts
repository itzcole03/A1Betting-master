import { User, Bet, Prop, UserStats, PerformanceData, Headline } from '@/types';
interface AppState {
    user: User | null;
    setUser: (user: User | null) => void;
    bets: Bet[];
    addBet: (bet: Bet) => void;
    removeBet: (betId: string) => void;
    updateBet: (betId: string, updates: Partial<Bet>) => void;
    props: Prop[];
    setProps: (props: Prop[]) => void;
    updateProp: (propId: string, updates: Partial<Prop>) => void;
    stats: UserStats | null;
    setStats: (stats: UserStats | null) => void;
    performance: PerformanceData[];
    setPerformance: (data: PerformanceData[]) => void;
    headlines: Headline[];
    setHeadlines: (headlines: Headline[]) => void;
    isDarkMode: boolean;
    toggleDarkMode: () => void;
    isBetSlipOpen: boolean;
    toggleBetSlip: () => void;
    selectedSport: string;
    setSelectedSport: (sport: string) => void;
    selectedLeague: string;
    setSelectedLeague: (league: string) => void;
}
export declare const useStore: import("zustand").UseBoundStore<import("zustand").StoreApi<AppState>>;
export {};

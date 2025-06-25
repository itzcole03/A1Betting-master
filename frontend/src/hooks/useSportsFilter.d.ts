interface Sport {
    id: string;
    name: string;
    icon: string;
    isActive: boolean;
}
interface SportsFilterState {
    sports: Sport[];
    activeSport: Sport | null;
    setActiveSport: (sport: Sport) => void;
    toggleSport: (sportId: string) => void;
    addSport: (sport: Sport) => void;
    removeSport: (sportId: string) => void;
}
export declare const useSportsFilter: import("zustand").UseBoundStore<import("zustand").StoreApi<SportsFilterState>>;
export {};

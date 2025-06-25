export type RiskProfile = 'conservative' | 'balanced' | 'aggressive';
export type FilterValues = {
    activeFilters: string[];
    riskProfile: RiskProfile;
    stakeSizing: number;
    model: string;
    confidenceThreshold: number;
};
interface FilterState {
    activeFilters: Set<string>;
    riskProfile: RiskProfile;
    setRiskProfile: (profile: RiskProfile) => void;
    stakeSizing: number;
    setStakeSizing: (value: number) => void;
    model: string;
    setModel: (model: string) => void;
    confidenceThreshold: number;
    setConfidenceThreshold: (value: number) => void;
    toggleFilter: (filterId: string) => void;
    clearFilters: () => void;
}
interface FilterPreset {
    name: string;
    filters: FilterValues;
}
export declare const useFilterStore: import("zustand").UseBoundStore<import("zustand").StoreApi<FilterState & {
    savePreset: (name: string) => void;
    loadPreset: (name: string) => void;
    removePreset: (name: string) => void;
    listPresets: () => FilterPreset[];
}>>;
export {};

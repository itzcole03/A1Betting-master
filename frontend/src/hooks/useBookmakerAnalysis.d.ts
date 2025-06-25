export interface BookmakerAnalysisState {
    isLoading: boolean;
    error: string | null;
    analysis: {
        suspiciousLevel: number;
        warning?: string;
        adjustedProbability: number;
        riskScore: number;
    } | null;
}
export interface PropData {
    playerId: string;
    propType: string;
    projectedValue: number;
    tag: 'demon' | 'goblin' | 'normal';
    currentOdds: number;
    historicalAverage: number;
}
export declare const useBookmakerAnalysis: (propData: PropData | null) => {
    refreshAnalysis: () => Promise<void>;
    isLoading: boolean;
    error: string | null;
    analysis: {
        suspiciousLevel: number;
        warning?: string;
        adjustedProbability: number;
        riskScore: number;
    } | null;
};
export default useBookmakerAnalysis;

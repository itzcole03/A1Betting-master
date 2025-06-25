import { MoneyMakerOpportunity } from '@/types/predictions';
import { Lineup } from '@/types/lineup';
interface PredictionSettings {
    enableSocialSentiment: boolean;
    enableWeatherData: boolean;
    enableInjuryData: boolean;
    enableMarketData: boolean;
    enableHistoricalData: boolean;
    enableSentimentData: boolean;
}
interface AnalyticsMetrics {
    accuracy: number;
    profitLoss: number;
    sampleSize: number;
    winRate: number;
    roi: number;
    averageOdds: number;
    bestPerformingSport: string;
    bestPerformingProp: string;
}
interface PredictionState {
    currentLineup: Lineup | null;
    savedLineups: Lineup[];
    opportunities: MoneyMakerOpportunity[];
    settings: PredictionSettings;
    analytics: AnalyticsMetrics;
    isLoading: boolean;
    error: string | null;
    setCurrentLineup: (lineup: Lineup | null) => void;
    addSavedLineup: (lineup: Lineup) => void;
    setOpportunities: (opportunities: MoneyMakerOpportunity[]) => void;
    updateSettings: (settings: Partial<PredictionSettings>) => void;
    updateAnalytics: (metrics: Partial<AnalyticsMetrics>) => void;
    setIsLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
    automatedStrategies: Record<string, boolean>;
    setStrategyAutomation: (strategyName: string, enabled: boolean) => void;
}
export declare const usePredictionStore: import("zustand").UseBoundStore<import("zustand").StoreApi<PredictionState>>;
export {};

declare class EventEmitter {
    private events;
    on(event: string, listener: Function): void;
    off(event: string, listener: Function): void;
    emit(event: string, ...args: any[]): void;
}
import { BettingOdds, MarketMetrics, MarketEfficiencyMetrics, MarketAnomaly } from "../types/betting";
export declare class MarketAnalysisService extends EventEmitter {
    private static instance;
    private marketMetrics;
    private anomalies;
    private readonly ANOMALY_THRESHOLD;
    private readonly EFFICIENCY_WINDOW;
    private readonly VOLUME_WINDOW;
    private readonly TREND_WINDOW;
    private readonly advancedML;
    private readonly hyperAdvancedML;
    private readonly ultraML;
    private constructor();
    static getInstance(): MarketAnalysisService;
    updateMarketMetrics(eventId: string, odds: BettingOdds[]): void;
    private updateVolumeMetrics;
    private updateLiquidityMetrics;
    private updateVolatilityMetrics;
    private updateTrendMetrics;
    private detectAnomalies;
    private detectPriceAnomaly;
    private detectSpreadAnomaly;
    private detectLiquidityAnomaly;
    private getAnomalySeverity;
    private calculateMarketEfficiency;
    private calculateSpreadEfficiency;
    private calculateVolumeEfficiency;
    private calculatePriceDiscovery;
    private calculateMarketDepth;
    getMarketMetrics(eventId: string): MarketMetrics | undefined;
    getAnomalies(eventId: string): MarketAnomaly[];
    getMarketEfficiency(eventId: string): MarketEfficiencyMetrics | undefined;
    getOddsMovements(eventId: string, timeRange: string): Promise<any>;
    getVolumeAnalysis(eventId: string, timeRange: string): Promise<any>;
    getSentimentData(eventId: string): Promise<any>;
    getArbitrageOpportunities(eventId: string): Promise<any[]>;
    getMarketDepth(eventId: string): Promise<any>;
    getLiquidityMetrics(eventId: string): Promise<any>;
    getVolatilityData(eventId: string, timeRange: string): Promise<any>;
    private cache;
}
export {};

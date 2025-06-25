import { OddsUpdate } from '../types/core';
export interface ArbitrageConfig {
    minProfitMargin: number;
    maxExposure: number;
    minOdds: number;
    maxOdds: number;
    maxBetDelay: number;
    refreshInterval: number;
}
export interface ArbitrageOpportunity {
    id: string;
    timestamp: number;
    profitMargin: number;
    totalStake: number;
    expectedProfit: number;
    legs: Array<{
        bookId: string;
        propId: string;
        odds: number;
        stake: number;
        maxStake: number;
    }>;
    risk: {
        exposure: number;
        confidence: number;
        timeSensitivity: number;
    };
    status: 'pending' | 'executed' | 'expired' | 'failed';
}
export declare class ArbitrageService {
    private static instance;
    private readonly eventBus;
    private readonly configManager;
    private readonly config;
    private readonly opportunities;
    private readonly marketData;
    private isScanning;
    private constructor();
    static getInstance(): ArbitrageService;
    private initializeConfig;
    private setupEventListeners;
    private updateMarketData;
    private startScanning;
    private scanAllMarkets;
    private checkForArbitrage;
    private findArbitrageOpportunities;
    private calculateArbitrage;
    private calculateConfidence;
    private calculateTimeSensitivity;
    private isValidOpportunity;
    private updateOpportunityStatus;
    getOpportunities(): ArbitrageOpportunity[];
    getOpportunity(id: string): ArbitrageOpportunity | undefined;
    clearOpportunities(): void;
    isMarketActive(propId: string): boolean;
    getMarketData(propId: string): Map<string, OddsUpdate> | undefined;
    clearMarketData(): void;
}

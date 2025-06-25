import { StrategyRecommendation, BettingDecision, BetRecord } from '@/types/core';
declare class StrategyService {
    private static instance;
    private activeStrategies;
    private constructor();
    static getInstance(): StrategyService;
    getStrategies(): Promise<StrategyRecommendation[]>;
    analyzeStrategy(strategyId: string): Promise<StrategyRecommendation>;
    executeStrategy(strategyId: string): Promise<BettingDecision[]>;
    getStrategyPerformance(strategyId: string): Promise<{
        winRate: number;
        profitLoss: number;
        roi: number;
        totalBets: number;
    }>;
    getStrategyHistory(strategyId: string): Promise<BetRecord[]>;
    activateStrategy(strategy: StrategyRecommendation): void;
    deactivateStrategy(strategyId: string): void;
    getActiveStrategies(): StrategyRecommendation[];
    isStrategyActive(strategyId: string): boolean;
    updateStrategySettings(strategyId: string, settings: any): Promise<void>;
    getStrategyRecommendations(): Promise<StrategyRecommendation[]>;
}
export declare const strategyService: StrategyService;
export default strategyService;

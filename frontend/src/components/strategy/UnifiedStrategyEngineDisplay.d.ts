import React from "react";
export interface StrategyRecommendation {
    strategyId: string;
    strategyName: string;
    confidence: number;
    expectedReturn: number;
    riskLevel: "low" | "medium" | "high";
    recommendation: string;
    reasoning: string[];
    data: {
        winProbability: number;
        expectedValue: number;
        kellyFraction: number;
        sharpeRatio: number;
        maxDrawdown: number;
    };
    timeframe: string;
    sport: string;
    lastUpdated: number;
}
interface Props {
    recommendations?: StrategyRecommendation[];
    showDebug?: boolean;
}
declare const UnifiedStrategyEngineDisplay: React.FC<Props>;
export default UnifiedStrategyEngineDisplay;

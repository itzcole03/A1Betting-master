import { AdvancedPrediction } from '../../types/prediction';
import { MarketContext, BettingContext } from '@/types/core';
import { ShapExplanation } from '../../types/ml';
export declare class AdvancedEnsemble {
    private static instance;
    private readonly MIN_WEIGHT;
    private readonly MAX_WEIGHT;
    private readonly UNCERTAINTY_THRESHOLD;
    private constructor();
    static getInstance(): AdvancedEnsemble;
    calculateDynamicWeights(predictions: Array<{
        value: number;
        confidence: number;
        weight: number;
        metadata: Record<string, any>;
    }>, marketContext: MarketContext, bettingContext: BettingContext): number[];
    private calculateConfidenceAdjustments;
    private calculateMarketFactors;
    private calculateBettingFactors;
    private calculateMarketAdjustments;
    private calculateBettingAdjustments;
    private normalizeWeight;
    private normalizeWeights;
    private calculateLiquidityScore;
    private calculateVolatilityScore;
    private calculateMarketEfficiency;
    private calculateRiskScore;
    private calculateValueScore;
    private calculateEdgeScore;
    private calculatePriceVolatility;
    private calculateOddsValue;
    calculateUncertainty(predictions: Array<{
        value: number;
        confidence: number;
        weight: number;
        metadata: Record<string, any>;
    }>, weights: number[]): {
        lower: number;
        upper: number;
    };
    private calculateVariance;
    generateShapExplanations(prediction: AdvancedPrediction, marketContext: MarketContext, bettingContext: BettingContext): ShapExplanation[];
    private calculateMarketImpact;
    private calculateBettingContextImpact;
    private calculateEnsembleWeightImpact;
    private calculateFeatureImportance;
    private calculateConfidence;
    private calculateDataQualityFactor;
}

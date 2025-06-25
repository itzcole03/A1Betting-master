import * as tf from '@tensorflow/tfjs';
interface BetMetrics {
    accuracy: number;
    roi: number;
    expectedValue: number;
    confidence: number;
    riskLevel: number;
    edge: number;
}
interface BetSelection {
    selectedBets: number[];
    metrics: BetMetrics;
    confidenceThreshold: number;
    edgeThreshold: number;
}
export declare class BestBetSelector {
    private logger;
    private kellyCriterion;
    private readonly minConfidence;
    private readonly minEdge;
    private readonly maxRiskLevel;
    constructor();
    selectBets(predictions: tf.Tensor, labels: tf.Tensor): Promise<BetSelection>;
    private calculateBetMetrics;
    private calculateAccuracy;
    private calculateROI;
    private calculateExpectedValue;
    private calculateConfidence;
    private calculateRiskLevel;
    private calculateEdge;
    private calculateStandardDeviation;
    private calculateActualProbability;
    private filterBets;
    private calculateEdgeForBet;
    getBetRecommendations(selection: BetSelection, bankroll: number): Array<{
        betIndex: number;
        stake: number;
        confidence: number;
        expectedValue: number;
    }>;
}
export {};

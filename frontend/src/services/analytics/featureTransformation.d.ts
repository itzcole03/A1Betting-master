import { FeatureConfig } from '@/types';
export declare class FeatureTransformer {
    private readonly config;
    private readonly logger;
    constructor(config: FeatureConfig);
    transformNumerical(features: Record<string, number[]>): Promise<Record<string, number[]>>;
    transformCategorical(features: Record<string, string[]>): Promise<Record<string, string[]>>;
    transformTemporal(features: Record<string, number[]>): Promise<Record<string, number[]>>;
    transformDerived(features: Record<string, number[]>): Promise<Record<string, number[]>>;
    private createFeatureMatrix;
    private normalizeFeatures;
    private scaleFeatures;
    private applyNonlinearTransformations;
    private applyCategoricalTransformations;
    private stemWord;
    private detrendFeatures;
    private deseasonalizeFeatures;
    private calculateSeasonality;
    private findSeasonalPeriod;
    private calculateAutocorrelation;
    private applyTemporalTransformations;
    private applyTemporalTransformationsToColumn;
    private applyDerivedTransformations;
    private applyDerivedTransformationsToColumn;
    private calculateLinearRegressionSlope;
    private calculateLinearRegressionIntercept;
}

import React from 'react';
interface FeatureInsightsProps {
    features: {
        name: string;
        importance: number;
        correlation: number;
        entropy: number;
        uniqueness: number;
        missing: number;
        stats: {
            mean: number;
            std: number;
            min: number;
            max: number;
            q25: number;
            q50: number;
            q75: number;
        };
    }[];
    interactions: {
        feature1: string;
        feature2: string;
        strength: number;
        type: 'linear' | 'nonlinear' | 'categorical';
    }[];
    embeddings: {
        feature: string;
        vector: number[];
    }[];
    signals: {
        source: string;
        features: {
            name: string;
            value: number;
            impact: number;
        }[];
    }[];
    eventId?: string;
    modelType?: string;
}
declare const _default: React.NamedExoticComponent<FeatureInsightsProps>;
export default _default;

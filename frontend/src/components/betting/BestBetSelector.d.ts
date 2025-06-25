import React from 'react';
interface Prediction {
    id: string;
    timestamp: string;
    prediction: number;
    confidence: number;
    shapValues: Record<string, number>;
    kellyValue: number;
    marketEdge: number;
}
interface BestBetSelectorProps {
    predictions: Prediction[];
}
declare const _default: React.NamedExoticComponent<BestBetSelectorProps>;
export default _default;

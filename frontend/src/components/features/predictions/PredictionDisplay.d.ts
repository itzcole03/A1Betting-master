import React from 'react';
interface PredictionDisplayProps {
    propId?: string;
    initialFeatures?: {
        [key: string]: number;
    };
    context?: {
        [key: string]: any;
    };
}
export declare const PredictionDisplay: React.FC<PredictionDisplayProps>;
export {};

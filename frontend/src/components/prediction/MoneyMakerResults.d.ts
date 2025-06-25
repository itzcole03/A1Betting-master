import React from 'react';
import { PredictionModelOutput } from '../../hooks/usePredictions';
interface MoneyMakerResultsProps {
    event: string;
    market: string;
    selection: string;
    odds: number;
    modelOutput: PredictionModelOutput;
    kellyFraction: number;
    expectedValue: number;
    timestamp: number;
    onPlaceBet: () => void;
    className?: string;
}
export declare const MoneyMakerResults: React.FC<MoneyMakerResultsProps>;
export {};

import React from 'react';
import { Sport, PropType } from '@/types';
interface StrategyInput {
    stake: number;
    minConfidence: number;
    selectedStrategies: string[];
    maxPayout: number;
    minPayout: number;
    selectedSports: Sport[];
    selectedPropTypes: PropType[];
}
interface StrategyInputContextType {
    strategyInput: StrategyInput;
    updateStrategyInput: (input: Partial<StrategyInput>) => void;
    resetStrategyInput: () => void;
}
export declare const StrategyInputProvider: React.FC<{
    children: React.ReactNode;
}>;
export declare const useStrategyInput: () => StrategyInputContextType;
export {};

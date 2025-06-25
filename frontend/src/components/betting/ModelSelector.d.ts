import React from 'react';
export interface BettingModel {
    id: string;
    name: string;
    description: string;
    accuracy: number;
    winRate: number;
    lastUpdated: string;
    features: string[];
    isActive: boolean;
}
interface ModelSelectorProps {
    selectedModel: string;
    onModelChange: (modelId: string) => void;
}
export declare const ModelSelector: React.FC<ModelSelectorProps>;
export {};

import React from 'react';
export interface SmartControlsBarProps {
    investment: number;
    onInvestmentChange: (v: number) => void;
    strategy: string;
    onStrategyChange: (v: string) => void;
    confidence: number;
    onConfidenceChange: (v: number) => void;
    model: string;
    onModelChange: (v: string) => void;
    dataQuality: number;
    onDataQualityChange: (v: number) => void;
    patternStrength: number;
    onPatternStrengthChange: (v: number) => void;
    className?: string;
}
export declare const SmartControlsBar: React.FC<SmartControlsBarProps>;
export default SmartControlsBar;

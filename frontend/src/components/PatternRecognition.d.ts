import React from 'react';
interface Pattern {
    name: string;
    description: string;
    confidence: number;
    matchScore: number;
    lastOccurrence: Date;
    successRate: number;
    sampleSize: number;
}
interface LineMovement {
    initial: number;
    current: number;
    change: number;
    timestamp: Date;
    significance: 'high' | 'medium' | 'low';
}
interface PatternRecognitionProps {
    patterns: Pattern[];
    lineMovement: LineMovement;
    onPatternSelect: (pattern: Pattern) => void;
}
declare const _default: React.NamedExoticComponent<PatternRecognitionProps>;
export default _default;

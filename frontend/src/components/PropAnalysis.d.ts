import React from 'react';
interface PropAnalysisProps {
    playerId: string;
    playerName: string;
    propType: string;
    projectedValue: number;
    tag: 'demon' | 'goblin' | 'normal';
    currentOdds: number;
    historicalAverage: number;
    className?: string;
}
export declare const PropAnalysis: React.FC<PropAnalysisProps>;
declare const _default: React.NamedExoticComponent<PropAnalysisProps>;
export default _default;

import React from 'react';
interface RiskInsightsProps {
    riskMetrics: Record<string, number>;
    recommendations: {
        shouldBet: boolean;
        confidence: number;
        maxStake: number;
        expectedValue: number;
    };
    simulation: {
        distribution: number[];
        var: number;
        cvar: number;
        sharpeRatio: number;
        maxDrawdown: number;
    };
}
declare const _default: React.NamedExoticComponent<RiskInsightsProps>;
export default _default;

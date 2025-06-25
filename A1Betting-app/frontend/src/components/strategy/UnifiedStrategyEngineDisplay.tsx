import { Badge } from '@/components/ui/badge';
import { Tooltip } from '@/components/ui/Tooltip';
import React from 'react';

export interface StrategyRecommendationDisplay {
    strategyId: string;
    type: 'OVER' | 'UNDER';
    confidence: number;
    expectedValue: number;
    riskAssessment: {
        riskScore: number;
        factors: string[];
        timestamp: number;
    };
    timestamp: number;
    success: boolean;
    riskReasoning?: string[];
    traceId?: string;
}

export interface UnifiedStrategyEngineDisplayProps {
    recommendations: StrategyRecommendationDisplay[];
    showDebug?: boolean;
}

export const UnifiedStrategyEngineDisplay: React.FC<UnifiedStrategyEngineDisplayProps> = ({
    recommendations,
    showDebug = false,
}) => {
    return (
        <div className="glass bg-gradient-to-br from-purple-100/60 to-blue-100/40 rounded-xl p-4 shadow-lg">
            <table className="min-w-full text-sm">
                <thead>
                    <tr className="text-left">
                        <th className="p-2">Strategy</th>
                        <th className="p-2">Type</th>
                        <th className="p-2">Confidence</th>
                        <th className="p-2">EV</th>
                        <th className="p-2">Risk</th>
                        <th className="p-2">Reasoning</th>
                        {showDebug && <th className="p-2">Trace ID</th>}
                    </tr>
                </thead>
                <tbody>
                    {recommendations.map((rec) => (
                        <tr key={rec.strategyId} className="border-b last:border-0">
                            <td className="p-2 font-semibold">{rec.strategyId}</td>
                            <td className="p-2">
                                <Badge variant={rec.type === 'OVER' ? 'success' : 'danger'}>{rec.type}</Badge>
                            </td>
                            <td className="p-2">
                                <Badge variant={rec.confidence >= 0.7 ? 'success' : rec.confidence >= 0.5 ? 'warning' : 'danger'}>
                                    {(rec.confidence * 100).toFixed(1)}%
                                </Badge>
                            </td>
                            <td className="p-2">
                                <Badge variant={rec.expectedValue > 0 ? 'success' : 'danger'}>
                                    {(rec.expectedValue * 100).toFixed(1)}%
                                </Badge>
                            </td>
                            <td className="p-2">
                                <Badge variant={rec.riskAssessment.riskScore < 0.3 ? 'success' : rec.riskAssessment.riskScore < 0.7 ? 'warning' : 'danger'}>
                                    {rec.riskAssessment.riskScore.toFixed(2)}
                                </Badge>
                            </td>
                            <td className="p-2">
                                {rec.riskReasoning && rec.riskReasoning.length > 0 ? (
                                    <Tooltip content={<ul className="text-xs max-w-xs">{rec.riskReasoning.map((r, i) => <li key={i}>{r}</li>)}</ul>}>
                                        <Badge variant="warning" className="cursor-pointer">View</Badge>
                                    </Tooltip>
                                ) : (
                                    <span className="text-gray-400">-</span>
                                )}
                            </td>
                            {showDebug && <td className="p-2 text-xs text-gray-400">{rec.traceId || '-'}</td>}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// Unified Analyzer interface for the betting system

export interface AnalysisRequest {
    playerId: string;
    metric: string;
    data: Record<string, unknown>;
    context?: Record<string, unknown>;
}

export interface AnalysisResponse {
    confidence: number;
    recommendation: 'over' | 'under' | 'pass';
    reasoning: string[];
    factors: Array<{
        name: string;
        impact: number;
        description: string;
    }>;
    riskLevel: 'low' | 'medium' | 'high';
    timestamp: number;
}

export abstract class Analyzer {
    abstract analyze(request: AnalysisRequest): Promise<AnalysisResponse>;

    protected validateRequest(request: AnalysisRequest): boolean {
        return !!(request.playerId && request.metric && request.data);
    }

    protected createResponse(
        confidence: number,
        recommendation: 'over' | 'under' | 'pass',
        reasoning: string[],
        factors: Array<{ name: string; impact: number; description: string }> = [],
        riskLevel: 'low' | 'medium' | 'high' = 'medium'
    ): AnalysisResponse {
        return {
            confidence,
            recommendation,
            reasoning,
            factors,
            riskLevel,
            timestamp: Date.now(),
        };
    }
}

export default Analyzer;

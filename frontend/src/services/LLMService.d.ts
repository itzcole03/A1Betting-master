// TypeScript declarations for LLMService
export interface LLMChatOptions {
    previousMessages?: Array<{ id: string; type: string; content: string; timestamp: Date }>;
    gameData?: {
        activeAnalyses: number;
        liveGames: number;
        confidencePicks: number;
        valueBets: number;
    };
    userPreferences?: {
        riskTolerance: string;
        preferredSports: string[];
        betTypes: string[];
    };
}

export interface LLMResponse {
    content: string;
    confidence?: number;
    type?: string;
}

export interface LLMAnalysisOptions {
    scenario_type?: string;
    impact_magnitude?: number;
    impact_direction?: string;
}

declare class LLMService {
    processChatMessage(message: string, options?: LLMChatOptions): Promise<LLMResponse>;
    generateAnalysis(prompt: string, options?: LLMAnalysisOptions): Promise<LLMResponse>;
    explainBet(betDetails: any): Promise<LLMResponse>;
    generateScenarios(context: any): Promise<LLMResponse>;
    analyzeSentiment(text: string): Promise<LLMResponse>;
    checkHealth(): Promise<{ status: string; model: string }>;
}

export declare const llmService: LLMService;

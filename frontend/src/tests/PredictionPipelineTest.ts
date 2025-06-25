// Integration test for the prediction pipeline
import { AdvancedAnalysisEngine } from '../core/AdvancedAnalysisEngine';
import { DataIntegrationHub } from '../core/DataIntegrationHub';
import { UnifiedPredictionEngine } from '../core/UnifiedPredictionEngine';
import { llmService } from '../services/LLMService';

// Test interface for prediction pipeline
export interface PredictionPipelineTest {
    testBasicPrediction(): Promise<boolean>;
    testDataIntegration(): Promise<boolean>;
    testLLMIntegration(): Promise<boolean>;
    testAnalysisEngine(): Promise<boolean>;
}

export class PredictionPipelineIntegration implements PredictionPipelineTest {
    private predictionEngine: UnifiedPredictionEngine;
    private dataHub: DataIntegrationHub;
    private analysisEngine: AdvancedAnalysisEngine;

    constructor() {
        this.predictionEngine = UnifiedPredictionEngine.getInstance();
        this.dataHub = DataIntegrationHub.getInstance();
        this.analysisEngine = AdvancedAnalysisEngine.getInstance();
    }

    async testBasicPrediction(): Promise<boolean> {
        try {
            console.log('Testing basic prediction functionality...');

            const testContext = {
                playerId: 'test-player-123',
                metric: 'points',
                timestamp: Date.now(),
                marketState: {
                    line: 25.5,
                    volume: 1000,
                    movement: 'up' as const
                }
            };

            const prediction = await this.predictionEngine.generatePrediction(testContext);

            console.log('Prediction result:', {
                value: prediction.value,
                confidence: prediction.confidence,
                hasFactors: prediction.factors.length > 0
            });

            return prediction &&
                typeof prediction.value === 'number' &&
                typeof prediction.confidence === 'number' &&
                prediction.confidence >= 0 && prediction.confidence <= 1;

        } catch (error) {
            console.error('Basic prediction test failed:', error);
            return false;
        }
    }

    async testDataIntegration(): Promise<boolean> {
        try {
            console.log('Testing data integration...');

            const integratedData = await this.dataHub.getIntegratedData();

            console.log('Integrated data structure:', {
                hasProjections: Object.keys(integratedData.projections).length > 0,
                hasSentiment: Object.keys(integratedData.sentiment).length > 0,
                hasOdds: Object.keys(integratedData.odds).length > 0
            });

            return integratedData &&
                typeof integratedData.timestamp === 'number' &&
                typeof integratedData.projections === 'object';

        } catch (error) {
            console.error('Data integration test failed:', error);
            return false;
        }
    }

    async testLLMIntegration(): Promise<boolean> {
        try {
            console.log('Testing LLM integration...');

            const testMessage = "Analyze this NBA player's performance: LeBron James is averaging 25 points this season.";
            const response = await llmService.processChatMessage(testMessage, {
                previousMessages: [],
                gameData: { activeAnalyses: 1, liveGames: 1, confidencePicks: 1, valueBets: 1 },
                userPreferences: { riskTolerance: 'moderate', preferredSports: ['NBA'], betTypes: ['player_props'] }
            });

            console.log('LLM response:', {
                hasContent: !!response.content,
                contentLength: response.content?.length || 0
            });

            return response && typeof response.content === 'string' && response.content.length > 0;

        } catch (error) {
            console.error('LLM integration test failed:', error);
            return false;
        }
    }

    async testAnalysisEngine(): Promise<boolean> {
        try {
            console.log('Testing analysis engine...');

            const testData = {
                playerId: 'test-player-123',
                sport: 'nba',
                position: 'forward',
                recentStats: { points: 25, rebounds: 8, assists: 6 }
            };

            const analysis = await this.analysisEngine.analyzePlayer(testData.playerId);

            console.log('Analysis result:', {
                hasPlayerAnalysis: !!analysis.predictions,
                hasTrends: !!analysis.trends,
                hasRisks: !!analysis.risks
            });

            return analysis &&
                typeof analysis.predictions === 'object' &&
                typeof analysis.trends === 'object';

        } catch (error) {
            console.error('Analysis engine test failed:', error);
            return false;
        }
    }

    async runAllTests(): Promise<{
        basicPrediction: boolean;
        dataIntegration: boolean;
        llmIntegration: boolean;
        analysisEngine: boolean;
        overall: boolean;
    }> {
        console.log('Running comprehensive prediction pipeline tests...');

        const results = {
            basicPrediction: await this.testBasicPrediction(),
            dataIntegration: await this.testDataIntegration(),
            llmIntegration: await this.testLLMIntegration(),
            analysisEngine: await this.testAnalysisEngine(),
            overall: false
        };

        results.overall = Object.values(results).slice(0, -1).every(result => result === true);

        console.log('Test Results Summary:', results);

        if (results.overall) {
            console.log('✅ All prediction pipeline tests passed!');
        } else {
            console.log('❌ Some prediction pipeline tests failed. Check individual results above.');
        }

        return results;
    }
}

// Export singleton instance for easy testing
export const predictionPipelineTest = new PredictionPipelineIntegration();

// Helper function to run tests from browser console
(window as any).testPredictionPipeline = () => predictionPipelineTest.runAllTests();

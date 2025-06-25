import { EventBus } from './EventBus.js';
export class UnifiedConfigManager {
    constructor() {
        this.eventBus = EventBus.getInstance();
        this.config = {
            system: {
                errorHandling: {
                    maxRetries: 3,
                    backoffFactor: 1.5,
                    timeoutMs: 5000,
                },
                emergencyMode: false,
            },
            strategy: {
                riskTolerance: 0.5,
                maxExposure: 1000,
                adaptiveStaking: false,
                hedgingEnabled: false,
                stopLoss: 0.2,
            },
            data: {
                retryAttempts: 0,
                refreshInterval: 60000,
            },
            prediction: {
                minConfidence: 0.7,
                ensembleSize: 3,
            },
            features: {},
            experiments: {
                testExperiment: {
                    id: 'testExperiment',
                    name: 'Test Experiment',
                    description: 'A minimal test experiment',
                    status: 'active',
                    variants: [
                        { id: 'control', name: 'Control', weight: 1 },
                        { id: 'variant', name: 'Variant', weight: 1 }
                    ],
                    audience: { percentage: 100 },
                    startDate: Date.now(),
                    metadata: {}
                }
            }
        };
    }
    static getInstance() {
        if (!UnifiedConfigManager.instance) {
            UnifiedConfigManager.instance = new UnifiedConfigManager();
        }
        return UnifiedConfigManager.instance;
    }
    getConfig() {
        return { ...this.config };
    }
    async updateConfig(updates) {
        this.config = {
            ...this.config,
            ...updates,
        };
        // Emit config update event
        this.eventBus.emit('config:updated', {
            section: 'system',
            timestamp: Date.now(),
            config: this.config,
        });
    }
}
export const configManager = UnifiedConfigManager.getInstance();

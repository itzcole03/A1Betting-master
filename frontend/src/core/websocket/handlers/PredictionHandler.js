export class PredictionHandler {
    constructor(wsManager, predictionEngine, logger) {
        this.wsManager = wsManager;
        this.predictionEngine = predictionEngine;
        this.logger = logger;
        this.PREDICTION_TOPIC = 'predictions';
        this.UPDATE_INTERVAL = 5000; // 5 seconds
        this.updateInterval = null;
        this.setupEventHandlers();
    }
    setupEventHandlers() {
        this.wsManager.on('message', (clientId, message, topic) => {
            if (message.type === 'prediction_request' && topic === this.PREDICTION_TOPIC) {
                this.handlePredictionRequest(clientId, message.data);
            }
        });
        this.wsManager.on('disconnect', clientId => {
            this.logger.info(`Client ${clientId} disconnected from predictions`);
        });
    }
    async handlePredictionRequest(clientId, request) {
        try {
            const prediction = await this.predictionEngine.generatePrediction(request);
            this.wsManager.sendMessage(clientId, {
                type: 'prediction_response',
                data: prediction,
                timestamp: Date.now(),
            });
        }
        catch (error) {
            this.logger.error(`Error generating prediction for client ${clientId}: ${error}`);
            this.wsManager.sendMessage(clientId, {
                type: 'error',
                data: { message: 'Failed to generate prediction' },
                timestamp: Date.now(),
            });
        }
    }
    startRealTimeUpdates() {
        if (this.updateInterval) {
            return;
        }
        this.updateInterval = setInterval(async () => {
            try {
                const activeClients = this.wsManager.getSubscriberCount(this.PREDICTION_TOPIC);
                if (activeClients === 0) {
                    return;
                }
                // Get predictions for active events
                const request = {
                    sport: 'all',
                    eventId: 'active',
                    riskProfile: { level: 'medium' },
                };
                const prediction = await this.predictionEngine.generatePrediction(request);
                this.wsManager.broadcast({
                    type: 'prediction_update',
                    data: prediction,
                    timestamp: Date.now(),
                }, this.PREDICTION_TOPIC);
            }
            catch (error) {
                this.logger.error(`Error in real-time prediction updates: ${error}`);
            }
        }, this.UPDATE_INTERVAL);
    }
    stopRealTimeUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
    cleanup() {
        this.stopRealTimeUpdates();
    }
}

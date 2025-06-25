export class UnifiedMetrics {
    constructor() {
        this.metrics = new Map();
        this.operations = new Map();
    }
    static getInstance() {
        if (!UnifiedMetrics.instance) {
            UnifiedMetrics.instance = new UnifiedMetrics();
        }
        return UnifiedMetrics.instance;
    }
    startOperation(operationName) {
        this.operations.set(operationName, { startTime: Date.now() });
    }
    endOperation(operationName, error) {
        const operation = this.operations.get(operationName);
        if (operation) {
            const duration = Date.now() - operation.startTime;
            this.recordMetric(`${operationName}_duration`, duration);
            if (error) {
                this.recordMetric(`${operationName}_error`, 1);
            }
            this.operations.delete(operationName);
        }
    }
    recordMetric(name, value) {
        const currentValue = this.metrics.get(name) || 0;
        this.metrics.set(name, currentValue + value);
    }
    getMetrics() {
        return new Map(this.metrics);
    }
    resetMetrics() {
        this.metrics.clear();
    }
}

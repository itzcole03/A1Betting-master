// Minimal browser-compatible EventEmitter
class EventEmitter {
    constructor() {
        this.listeners = {};
    }
    on(event, fn) {
        this.listeners[event] = this.listeners[event] || [];
        this.listeners[event].push(fn);
    }
    off(event, fn) {
        if (!this.listeners[event])
            return;
        this.listeners[event] = this.listeners[event].filter(f => f !== fn);
    }
    emit(event, ...args) {
        (this.listeners[event] || []).forEach(fn => fn(...args));
    }
}
export class ResourceManager extends EventEmitter {
    constructor() {
        super();
        this.allocations = new Map();
        this.totalGPUMemory = 0;
        this.totalCPUMemory = 0;
        this.gpuMemoryLimit = 0;
        this.cpuMemoryLimit = 0;
        this.initializeResources();
    }
    static getInstance() {
        if (!ResourceManager.instance) {
            ResourceManager.instance = new ResourceManager();
        }
        return ResourceManager.instance;
    }
    async initializeResources() {
        try {
            // GPU/CPU info collection disabled for browser build
            this.totalGPUMemory = 0;
            this.gpuMemoryLimit = 0;
            this.totalCPUMemory = 0;
            this.cpuMemoryLimit = 0;
        }
        catch (error) {
            console.error('Failed to initialize resources:', error);
            // Fallback to conservative limits
            this.totalGPUMemory = 4 * 1024 * 1024 * 1024; // 4GB
            this.gpuMemoryLimit = this.totalGPUMemory * 0.5;
            this.totalCPUMemory = 8 * 1024 * 1024 * 1024; // 8GB
            this.cpuMemoryLimit = this.totalCPUMemory * 0.5;
        }
    }
    async allocateResources(model) {
        const modelId = model.config.name;
        if (this.allocations.has(modelId)) {
            throw new Error(`Resources already allocated for model ${modelId}`);
        }
        try {
            // Get model resource requirements
            const requirements = await this.getModelRequirements(model);
            // Check if resources are available
            await this.checkResourceAvailability(requirements);
            // Allocate resources
            this.allocations.set(modelId, {
                modelId,
                gpuMemory: requirements.gpuMemory,
                cpuMemory: requirements.cpuMemory,
                startTime: Date.now(),
            });
            this.emit('resourcesAllocated', {
                modelId,
                allocation: this.allocations.get(modelId),
            });
        }
        catch (error) {
            this.emit('allocationError', { modelId, error });
            throw error;
        }
    }
    async releaseResources(modelId) {
        const allocation = this.allocations.get(modelId);
        if (allocation) {
            this.allocations.delete(modelId);
            this.emit('resourcesReleased', { modelId, allocation });
        }
    }
    async getModelRequirements(model) {
        // Estimate resource requirements based on model type and configuration
        const baseMemory = 100 * 1024 * 1024; // 100MB base memory
        let gpuMemory = baseMemory;
        let cpuMemory = baseMemory;
        switch (model.config.type) {
            case 'deepLearning':
                gpuMemory *= 4; // Deep learning models need more GPU memory
                break;
            case 'timeSeries':
                cpuMemory *= 2; // Time series models need more CPU memory
                break;
            case 'optimization':
                cpuMemory *= 3; // Optimization models need more CPU memory
                break;
        }
        return { gpuMemory, cpuMemory };
    }
    async checkResourceAvailability(requirements) {
        const currentGPUUsage = this.getCurrentGPUUsage();
        const currentCPUUsage = this.getCurrentCPUUsage();
        if (currentGPUUsage + requirements.gpuMemory > this.gpuMemoryLimit) {
            throw new Error('Insufficient GPU memory available');
        }
        if (currentCPUUsage + requirements.cpuMemory > this.cpuMemoryLimit) {
            throw new Error('Insufficient CPU memory available');
        }
    }
    getCurrentGPUUsage() {
        return Array.from(this.allocations.values()).reduce((total, allocation) => total + allocation.gpuMemory, 0);
    }
    getCurrentCPUUsage() {
        return Array.from(this.allocations.values()).reduce((total, allocation) => total + allocation.cpuMemory, 0);
    }
    getResourceUtilization() {
        const gpuUsed = this.getCurrentGPUUsage();
        const cpuUsed = this.getCurrentCPUUsage();
        return {
            gpu: {
                used: gpuUsed,
                total: this.totalGPUMemory,
                percentage: (gpuUsed / this.totalGPUMemory) * 100,
            },
            cpu: {
                used: cpuUsed,
                total: this.totalCPUMemory,
                percentage: (cpuUsed / this.totalCPUMemory) * 100,
            },
        };
    }
    async cleanup() {
        // Release all allocated resources
        const modelIds = Array.from(this.allocations.keys());
        await Promise.all(modelIds.map(id => this.releaseResources(id)));
        // Clear GPU memory
        await tf.disposeVariables();
        this.emit('cleanupComplete');
    }
}

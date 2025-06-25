import { EventBus } from '@/core/EventBus';
import { PerformanceMonitor } from './PerformanceMonitor';
export class StrategyRegistry {
    constructor() {
        this.strategies = new Map();
        this.eventBus = EventBus.getInstance();
        this.performanceMonitor = PerformanceMonitor.getInstance();
    }
    static getInstance() {
        if (!StrategyRegistry.instance) {
            StrategyRegistry.instance = new StrategyRegistry();
        }
        return StrategyRegistry.instance;
    }
    registerStrategy(strategy) {
        if (this.strategies.has(strategy.id)) {
            throw new Error(`Strategy with ID ${strategy.id} is already registered`);
        }
        // Validate dependencies
        for (const depId of strategy.dependencies) {
            if (!this.strategies.has(depId)) {
                throw new Error(`Dependency ${depId} not found for strategy ${strategy.id}`);
            }
        }
        this.strategies.set(strategy.id, strategy);
        this.eventBus.publish({
            type: 'strategy:registered',
            payload: {
                strategyId: strategy.id,
                name: strategy.name,
                version: strategy.version,
                timestamp: Date.now(),
            },
        });
    }
    async evaluate(strategyId, input, context) {
        const strategy = this.strategies.get(strategyId);
        if (!strategy) {
            throw new Error(`Strategy ${strategyId} not found`);
        }
        const traceId = this.performanceMonitor.startTrace(`strategy-${strategy.id}`, {
            strategyId: strategy.id,
            version: strategy.version,
        });
        try {
            if (!strategy.canHandle(input)) {
                throw new Error(`Strategy ${strategy.id} cannot handle the provided input`);
            }
            if (strategy.validate && !(await strategy.validate(input))) {
                throw new Error(`Input validation failed for strategy ${strategy.id}`);
            }
            const startTime = Date.now();
            const result = await strategy.evaluate(input, context);
            const duration = Date.now() - startTime;
            const metrics = this.calculateMetrics(result);
            const strategyResult = {
                id: `${strategy.id}-${startTime}`,
                timestamp: startTime,
                duration,
                data: result,
                confidence: this.calculateConfidence(result),
                metadata: {
                    strategy: strategy.id,
                    version: strategy.version,
                    parameters: context.parameters,
                },
                metrics,
            };
            this.eventBus.publish({
                type: 'strategy:evaluated',
                payload: {
                    strategyId: strategy.id,
                    resultId: strategyResult.id,
                    duration,
                    metrics,
                    timestamp: Date.now(),
                },
            });
            this.performanceMonitor.endTrace(traceId);
            return strategyResult;
        }
        catch (error) {
            this.performanceMonitor.endTrace(traceId, error);
            throw error;
        }
    }
    async evaluateWithPipeline(strategies, input, context) {
        const sortedStrategies = this.sortStrategiesByDependencies(strategies);
        let currentInput = input;
        let lastResult = null;
        for (const strategyId of sortedStrategies) {
            lastResult = await this.evaluate(strategyId, currentInput, {
                ...context,
                parameters: {
                    ...context.parameters,
                    previousResults: lastResult ? [lastResult] : [],
                },
            });
            currentInput = lastResult.data;
        }
        return lastResult;
    }
    sortStrategiesByDependencies(strategyIds) {
        const graph = new Map();
        const visited = new Set();
        const sorted = [];
        // Build dependency graph
        for (const id of strategyIds) {
            const strategy = this.strategies.get(id);
            if (!strategy)
                continue;
            graph.set(id, new Set(strategy.dependencies));
        }
        // Topological sort
        const visit = (id) => {
            if (visited.has(id))
                return;
            visited.add(id);
            const deps = graph.get(id) || new Set();
            for (const dep of deps) {
                visit(dep);
            }
            sorted.push(id);
        };
        for (const id of strategyIds) {
            visit(id);
        }
        return sorted;
    }
    calculateConfidence(result) {
        if (typeof result === 'object' && result !== null) {
            if ('confidence' in result)
                return result.confidence;
            if ('probability' in result)
                return result.probability;
            if ('score' in result)
                return result.score;
        }
        return 1;
    }
    calculateMetrics(result) {
        return {
            accuracy: this.calculateAccuracy(result),
            reliability: this.calculateReliability(result),
            performance: this.calculatePerformance(result),
        };
    }
    calculateAccuracy(result) {
        if (typeof result === 'object' && result !== null) {
            if ('accuracy' in result)
                return result.accuracy;
            if ('confidence' in result)
                return result.confidence;
        }
        return 1;
    }
    calculateReliability(result) {
        if (typeof result === 'object' && result !== null) {
            if ('reliability' in result)
                return result.reliability;
            if ('stability' in result)
                return result.stability;
        }
        return 1;
    }
    calculatePerformance(result) {
        if (typeof result === 'object' && result !== null) {
            if ('performance' in result)
                return result.performance;
            if ('efficiency' in result)
                return result.efficiency;
        }
        return 1;
    }
    getStrategy(strategyId) {
        return this.strategies.get(strategyId);
    }
    listStrategies() {
        return Array.from(this.strategies.values()).map(s => ({
            id: s.id,
            name: s.name,
            version: s.version,
        }));
    }
}
export class ComposableStrategy {
    constructor(id, name, version, priority, dependencies, evaluator, validator, handler) {
        this.id = id;
        this.name = name;
        this.version = version;
        this.priority = priority;
        this.dependencies = dependencies;
        this.evaluator = evaluator;
        this.validator = validator;
        this.handler = handler;
    }
    async evaluate(input, context) {
        return this.evaluator(input, context);
    }
    async validate(input) {
        if (this.validator) {
            return this.validator(input);
        }
        return true;
    }
    canHandle(input) {
        if (this.handler) {
            return this.handler(input);
        }
        return true;
    }
    compose(next) {
        return new ComposableStrategy(`${this.id}->${next.id}`, `${this.name} -> ${next.name}`, `${this.version}+${next.version}`, Math.max(this.priority, next.priority), [...this.dependencies, ...next.dependencies], async (input, context) => {
            const intermediate = await this.evaluate(input, context);
            return next.evaluate(intermediate, context);
        });
    }
}

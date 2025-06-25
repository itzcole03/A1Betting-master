import { OptimizationStrategy, } from './OptimizationStrategy';
export class SimulatedAnnealing extends OptimizationStrategy {
    constructor(config) {
        super(config);
        this.currentSolution = [];
        this.currentValue = Infinity;
        if (config.type !== 'simulatedAnnealing') {
            throw new Error('SimulatedAnnealing requires simulatedAnnealing optimization type');
        }
        this.temperature = config.parameters.temperature;
    }
    async optimize() {
        const startTime = Date.now();
        this.initializeSolution();
        const maxIterations = this.config.parameters.generations || 1000;
        const coolingRate = this.config.parameters.coolingRate;
        for (let iteration = 0; iteration < maxIterations; iteration++) {
            this.currentIteration = iteration;
            // Generate and evaluate neighbor
            const neighbor = this.generateNeighbor();
            if (this.checkConstraints(neighbor)) {
                const neighborValue = await this.evaluateObjective(neighbor);
                // Accept or reject neighbor
                if (this.acceptNeighbor(neighborValue)) {
                    this.currentSolution = neighbor;
                    this.currentValue = neighborValue;
                    // Update best solution if needed
                    if (neighborValue < this.bestValue) {
                        this.updateBest(neighbor, neighborValue);
                    }
                }
            }
            // Cool down
            this.temperature *= coolingRate;
            // Check for convergence
            if (this.checkConvergence()) {
                break;
            }
            this.emit('iterationComplete', {
                iteration,
                temperature: this.temperature,
                currentValue: this.currentValue,
                bestValue: this.bestValue,
            });
        }
        return this.getResult();
    }
    initializeSolution() {
        const dimension = this.getDimension();
        this.currentSolution = this.generateRandomSolution(dimension);
        if (this.checkConstraints(this.currentSolution)) {
            this.evaluateObjective(this.currentSolution).then(value => {
                this.currentValue = value;
                this.updateBest(this.currentSolution, value);
            });
        }
    }
    getDimension() {
        if (this.config.constraints?.min) {
            return this.config.constraints.min.length;
        }
        if (this.config.constraints?.max) {
            return this.config.constraints.max.length;
        }
        throw new Error('Cannot determine parameter dimension from constraints');
    }
    generateRandomSolution(dimension) {
        const solution = Array(dimension).fill(0);
        const { min, max } = this.config.constraints;
        for (let i = 0; i < dimension; i++) {
            const minVal = min?.[i] ?? -10;
            const maxVal = max?.[i] ?? 10;
            solution[i] = minVal + Math.random() * (maxVal - minVal);
        }
        return solution;
    }
    generateNeighbor() {
        const neighbor = [...this.currentSolution];
        const dimension = neighbor.length;
        const { min, max } = this.config.constraints;
        // Select a random dimension to modify
        const dimensionToModify = Math.floor(Math.random() * dimension);
        // Generate a random step size based on temperature
        const stepSize = this.temperature * (Math.random() * 2 - 1);
        // Apply the step
        neighbor[dimensionToModify] += stepSize;
        // Ensure bounds
        if (min) {
            neighbor[dimensionToModify] = Math.max(neighbor[dimensionToModify], min[dimensionToModify]);
        }
        if (max) {
            neighbor[dimensionToModify] = Math.min(neighbor[dimensionToModify], max[dimensionToModify]);
        }
        return neighbor;
    }
    acceptNeighbor(neighborValue) {
        // Always accept better solutions
        if (neighborValue < this.currentValue) {
            return true;
        }
        // Calculate acceptance probability
        const deltaE = neighborValue - this.currentValue;
        const probability = Math.exp(-deltaE / this.temperature);
        // Accept with probability
        return Math.random() < probability;
    }
    checkConvergence() {
        if (this.history.length < 10) {
            return false;
        }
        // Check if temperature is low enough
        if (this.temperature < 1e-6) {
            return true;
        }
        // Check if solution has stabilized
        const recentHistory = this.history.slice(-10);
        const valueConvergence = super.checkConvergence();
        return valueConvergence;
    }
}

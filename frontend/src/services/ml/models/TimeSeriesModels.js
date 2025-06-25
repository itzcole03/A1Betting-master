import { BaseModel } from './BaseModel.js';
class ARIMAModel extends BaseModel {
    constructor(config) {
        super(config);
    }
    async predict(input) {
        return {
            modelName: this.config.name,
            probability: 0.7,
            confidence: 0.8,
            weight: this.config.weight || 1,
            features: input,
            metadata: {},
        };
    }
    async train() { }
    async evaluate() {
        return {};
    }
    async save() { }
    async load() { }
}
class ProphetModel extends BaseModel {
    constructor(config) {
        super(config);
    }
    async predict(input) {
        return {
            modelName: this.config.name,
            probability: 0.75,
            confidence: 0.82,
            weight: this.config.weight || 1,
            features: input,
            metadata: {},
        };
    }
    async train() { }
    async evaluate() {
        return {};
    }
    async save() { }
    async load() { }
}
export { ARIMAModel, ProphetModel };

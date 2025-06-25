export class ModelMetadataManager {
    constructor(metadata) {
        this.metadata = metadata;
    }
    getMetadata() {
        return this.metadata;
    }
    updateMetadata(updates) {
        this.metadata = {
            ...this.metadata,
            ...updates,
        };
    }
    addTag(tag) {
        if (!this.metadata.tags.includes(tag)) {
            this.metadata.tags.push(tag);
        }
    }
    removeTag(tag) {
        this.metadata.tags = this.metadata.tags.filter(t => t !== tag);
    }
    updateParameter(key, value) {
        this.metadata.parameters[key] = value;
    }
    removeParameter(key) {
        delete this.metadata.parameters[key];
    }
    addDependency(dependency) {
        if (!this.metadata.dependencies.includes(dependency)) {
            this.metadata.dependencies.push(dependency);
        }
    }
    removeDependency(dependency) {
        this.metadata.dependencies = this.metadata.dependencies.filter(d => d !== dependency);
    }
    toJSON() {
        return JSON.stringify(this.metadata, null, 2);
    }
    static fromJSON(json) {
        const metadata = JSON.parse(json);
        return new ModelMetadataManager(metadata);
    }
}

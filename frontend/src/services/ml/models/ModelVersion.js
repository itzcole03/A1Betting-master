export class ModelVersion {
    constructor(major, minor, patch, metadata, metrics) {
        this.major = major;
        this.minor = minor;
        this.patch = patch;
        this.metadata = metadata;
        this.metrics = metrics;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
    getVersion() {
        return `${this.major}.${this.minor}.${this.patch}`;
    }
    getMetadata() {
        return this.metadata;
    }
    getMetrics() {
        return this.metrics;
    }
    getCreatedAt() {
        return this.createdAt;
    }
    getUpdatedAt() {
        return this.updatedAt;
    }
    isCompatible(other) {
        return this.major === other.major;
    }
    isNewerThan(other) {
        if (this.major !== other.major)
            return this.major > other.major;
        if (this.minor !== other.minor)
            return this.minor > other.minor;
        return this.patch > other.patch;
    }
    incrementPatch() {
        return new ModelVersion(this.major, this.minor, this.patch + 1, this.metadata, this.metrics);
    }
    incrementMinor() {
        return new ModelVersion(this.major, this.minor + 1, 0, this.metadata, this.metrics);
    }
    incrementMajor() {
        return new ModelVersion(this.major + 1, 0, 0, this.metadata, this.metrics);
    }
    toJSON() {
        return {
            version: this.getVersion(),
            metadata: this.metadata,
            metrics: this.metrics,
            createdAt: this.createdAt.toISOString(),
            updatedAt: this.updatedAt.toISOString(),
        };
    }
    static fromJSON(json) {
        return new ModelVersion(json.version.split('.')[0], json.version.split('.')[1], json.version.split('.')[2], json.metadata, json.metrics);
    }
}

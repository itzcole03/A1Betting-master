export class UnifiedMetrics {
  private static instance: UnifiedMetrics;
  private metrics: Map<string, number>;
  private operations: Map<string, { startTime: number; error?: unknown }>;

  private constructor() {
    this.metrics = new Map();
    this.operations = new Map();
  }

  public static getInstance(): UnifiedMetrics {
    if (!UnifiedMetrics.instance) {
      UnifiedMetrics.instance = new UnifiedMetrics();
    }
    return UnifiedMetrics.instance;
  }

  public startOperation(operationName: string): void {
    this.operations.set(operationName, { startTime: Date.now() });
  }

  public endOperation(operationName: string, error?: unknown): void {
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

  public recordMetric(name: string, value: number): void {
    const currentValue = this.metrics.get(name) || 0;
    this.metrics.set(name, currentValue + value);
  }

  public getMetrics(): Map<string, number> {
    return new Map(this.metrics);
  }

  public resetMetrics(): void {
    this.metrics.clear();
  }

  public track(name: string, value?: number, tags?: Record<string, string>): void {
    this.recordMetric(name, value || 1);
    // TODO: Handle tags when metrics system is enhanced
  }

  public increment(name: string, value?: number, tags?: Record<string, string>): void {
    const current = this.metrics.get(name) || 0;
    this.metrics.set(name, current + (value || 1));
    // TODO: Handle tags when metrics system is enhanced
  }

  public gauge(name: string, value: number, tags?: Record<string, string>): void {
    this.metrics.set(name, value);
    // TODO: Handle tags when metrics system is enhanced
  }

  public timing(name: string, value: number, tags?: Record<string, string>): void {
    this.recordMetric(`${name}_timing`, value);
    // TODO: Handle tags when metrics system is enhanced
  }

  public histogram(name: string, value: number, tags?: Record<string, string>): void {
    this.recordMetric(`${name}_histogram`, value);
    // TODO: Handle tags when metrics system is enhanced
  }
}

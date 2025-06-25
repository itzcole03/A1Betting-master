export class UnifiedMonitor {
  constructor() {
    this.metrics = new Map();
    this.userContext = null;
  }

  static getInstance() {
    if (!UnifiedMonitor.instance) {
      UnifiedMonitor.instance = new UnifiedMonitor();
    }
    return UnifiedMonitor.instance;
  }

  startTrace(name, type, description) {
    return {
      name,
      type,
      description,
      startTime: Date.now(),
      setHttpStatus: (status) => {
        console.debug(`[TRACE] ${name} HTTP Status: ${status}`);
      },
      setDuration: (duration) => {
        console.debug(`[TRACE] ${name} Duration: ${duration}ms`);
      },
    };
  }

  endTrace(trace) {
    const duration = Date.now() - trace.startTime;
    console.debug(`[TRACE] ${trace.name} completed in ${duration}ms`);
  }

  reportError(error, context) {
    console.error("Error:", error, "Context:", context);

    // Record error as metric
    this.recordMetric("error.count", 1, {
      component: context?.component || "unknown",
      action: context?.action || "unknown",
      error_type: error?.name || "Error",
    });
  }

  recordMetric(name, value, tags) {
    // Simple implementation - in production this would integrate with monitoring services
    if (typeof console !== "undefined") {
      console.debug(`[METRIC] ${name}: ${value}`, tags || {});
    }

    // Store metrics for potential retrieval
    if (!this.metrics) {
      this.metrics = new Map();
    }
    this.metrics.set(name, { value, tags, timestamp: Date.now() });
  }

  captureMessage(message, level = "info", extra) {
    console.log(`[${level.toUpperCase()}] ${message}`, extra || {});
  }

  captureException(error, context) {
    console.error("Exception captured:", error, context || {});
    this.reportError(error, context);
  }

  setUserContext(context) {
    this.userContext = context;
  }

  getMetrics(name) {
    return this.metrics.get(name) || null;
  }

  getAllMetrics() {
    return Object.fromEntries(this.metrics);
  }

  clearMetrics(name) {
    if (name) {
      this.metrics.delete(name);
    } else {
      this.metrics.clear();
    }
  }
}

export const unifiedMonitor = new UnifiedMonitor();

// Example Usage:
// unifiedMonitor.reportError(new Error('Something went wrong in payment processing'), { orderId: '12345' });
// unifiedMonitor.setUserContext({ id: 'user-6789', username: 'jane.doe' });
// const trace = unifiedMonitor.startTrace('checkout_flow', 'user.action');
// // ... some operations ...
// unifiedMonitor.recordMetric('items_in_cart', 3, { type: 'gauge'});
// unifiedMonitor.endTrace(trace);

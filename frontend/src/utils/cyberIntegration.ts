// Utility functions for integrating existing services with cyber UI

export interface CyberServiceConfig {
  serviceName: string;
  endpoint?: string;
  retryAttempts?: number;
  timeout?: number;
}

export class CyberServiceIntegrator {
  private services: Map<string, any> = new Map();

  // Register existing services with the cyber interface
  registerService(name: string, service: any, config?: CyberServiceConfig) {
    this.services.set(name, {
      service,
      config: {
        serviceName: name,
        retryAttempts: 3,
        timeout: 5000,
        ...config,
      },
    });
    console.log(`🚀 Cyber Integration: ${name} service registered`);
  }

  // Get service instance
  getService(name: string) {
    return this.services.get(name)?.service;
  }

  // Wrap service calls with cyber styling and error handling
  async callService(serviceName: string, method: string, ...args: any[]) {
    const serviceEntry = this.services.get(serviceName);
    if (!serviceEntry) {
      throw new Error(`Service ${serviceName} not found`);
    }

    const { service, config } = serviceEntry;
    console.log(`⚡ Cyber Call: ${serviceName}.${method}()`);

    try {
      const result = await service[method](...args);
      console.log(`✅ Cyber Success: ${serviceName}.${method}() completed`);
      return {
        success: true,
        data: result,
        service: serviceName,
        method,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error(
        `❌ Cyber Error: ${serviceName}.${method}() failed:`,
        error,
      );
      return {
        success: false,
        error,
        service: serviceName,
        method,
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Get all registered services
  getRegisteredServices() {
    return Array.from(this.services.keys());
  }

  // Health check for all services
  async healthCheck() {
    const results = {};
    for (const [name, serviceEntry] of this.services) {
      try {
        // Try to call a health check method if it exists
        const service = serviceEntry.service;
        if (typeof service.healthCheck === "function") {
          results[name] = await service.healthCheck();
        } else {
          results[name] = {
            status: "registered",
            message: "No health check method",
          };
        }
      } catch (error) {
        results[name] = { status: "error", error: error.message };
      }
    }
    return results;
  }
}

// Global cyber service integrator instance
export const cyberIntegrator = new CyberServiceIntegrator();

// Helper function to format cyber notifications
export const formatCyberNotification = (
  type: "success" | "error" | "warning" | "info",
  title: string,
  message: string,
) => {
  const icons = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "💡",
  };

  const colors = {
    success: "text-green-400",
    error: "text-red-400",
    warning: "text-yellow-400",
    info: "text-blue-400",
  };

  return {
    icon: icons[type],
    title,
    message,
    colorClass: colors[type],
    timestamp: new Date().toLocaleTimeString(),
  };
};

// Helper to generate cyber-styled loading states
export const createCyberLoadingState = (message: string = "Processing...") => {
  return {
    isLoading: true,
    message,
    animation: "animate-pulse",
    icon: "fa-spinner fa-spin",
    colorClass: "text-electric-400",
  };
};

// Helper to convert existing data to cyber metrics format
export const convertToCyberMetrics = (data: any) => {
  if (!data || typeof data !== "object") return null;

  return {
    value: data.value || data.count || data.amount || "---",
    label: data.label || data.name || data.title || "Metric",
    icon: data.icon || "fa-chart-line",
    change: data.change || data.delta || data.trend || null,
    trend:
      data.trend ||
      (data.change && data.change > 0 ? "up" : "down") ||
      "neutral",
    timestamp: data.timestamp || new Date().toISOString(),
  };
};

// Convert existing component props to cyber styling
export const applyCyberStyling = (props: any) => {
  return {
    ...props,
    className: `${props.className || ""} glass-card rounded-2xl transition-all duration-300 hover:shadow-neon`,
    style: {
      background: "rgba(255, 255, 255, 0.05)",
      backdropFilter: "blur(20px) saturate(180%)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
      ...props.style,
    },
  };
};

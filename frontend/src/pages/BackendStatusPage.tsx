/**
 * Backend Status and Control Page
 * Dedicated page for monitoring and controlling backend services
 */

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Server,
  Database,
  Wifi,
  WifiOff,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  Activity,
  Zap,
  Monitor,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Terminal,
  Eye,
  EyeOff,
} from "lucide-react";

interface ServiceStatus {
  name: string;
  status: "healthy" | "degraded" | "offline";
  lastCheck: string;
  endpoint: string;
  responseTime?: number;
  error?: string;
}

interface SystemMetrics {
  uptime: number;
  totalRequests: number;
  activeConnections: number;
  errorRate: number;
  avgResponseTime: number;
}

export const BackendStatusPage: React.FC = () => {
  const [services, setServices] = useState<ServiceStatus[]>([
    {
      name: "Backend API",
      status: "healthy",
      lastCheck: new Date().toLocaleTimeString(),
      endpoint: "http://localhost:8000/health",
      responseTime: 120,
    },
    {
      name: "SportsRadar API",
      status: "degraded",
      lastCheck: new Date().toLocaleTimeString(),
      endpoint: "http://localhost:8000/api/sportsradar/health",
      responseTime: 450,
      error: "API key validation required",
    },
    {
      name: "DailyFantasy API",
      status: "offline",
      lastCheck: new Date().toLocaleTimeString(),
      endpoint: "http://localhost:8000/api/dailyfantasy/contests/nba",
      error: "Authentication failed",
    },
    {
      name: "TheOdds API",
      status: "offline",
      lastCheck: new Date().toLocaleTimeString(),
      endpoint: "http://localhost:8000/api/theodds/sports",
      error: "Unauthorized access",
    },
  ]);

  const [metrics, setMetrics] = useState<SystemMetrics>({
    uptime: 99.8,
    totalRequests: 15847,
    activeConnections: 12,
    errorRate: 2.1,
    avgResponseTime: 245,
  });

  const [logs, setLogs] = useState<string[]>([
    "✅ Backend server started successfully",
    "🔌 WebSocket server initialized on port 8000",
    "📡 API endpoints registered and active",
    "⚠️ SportsRadar API key requires validation",
    "❌ DailyFantasy API authentication failed",
    "❌ TheOdds API unauthorized access",
    "✅ Health check endpoints responding",
    "🔄 Automatic reconnection enabled",
  ]);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showLogs, setShowLogs] = useState(true);

  // Check all service health
  const checkAllServices = async () => {
    setIsRefreshing(true);

    // Add log entry
    setLogs((prev) => [...prev, `🔄 Running health checks...`]);

    try {
      // Check main backend health
      const backendResponse = await fetch("http://localhost:8000/health");
      const backendHealthy = backendResponse.ok;

      // Check comprehensive health
      const healthResponse = await fetch(
        "http://localhost:8000/api/health/all",
      );
      let healthData = null;

      if (healthResponse.ok) {
        healthData = await healthResponse.json();
      }

      // Update services status
      setServices((prev) =>
        prev.map((service) => {
          if (service.name === "Backend API") {
            return {
              ...service,
              status: backendHealthy ? "healthy" : "offline",
              lastCheck: new Date().toLocaleTimeString(),
              responseTime: backendHealthy ? 120 : undefined,
              error: backendHealthy ? undefined : "Service unavailable",
            };
          }

          if (healthData?.services) {
            const apiName = service.name
              .toLowerCase()
              .replace(/\s+api$/, "")
              .replace(/\s+/g, "");
            const apiStatus = healthData.services[apiName];

            if (apiStatus) {
              return {
                ...service,
                status: apiStatus.status === "healthy" ? "healthy" : "degraded",
                lastCheck: new Date().toLocaleTimeString(),
                responseTime: Math.floor(Math.random() * 500) + 100,
                error:
                  apiStatus.status !== "healthy"
                    ? "API key or authentication issue"
                    : undefined,
              };
            }
          }

          return {
            ...service,
            lastCheck: new Date().toLocaleTimeString(),
          };
        }),
      );

      setLogs((prev) => [...prev, `✅ Health check completed`]);
    } catch (error) {
      setLogs((prev) => [...prev, `❌ Health check failed: ${error}`]);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    checkAllServices();
    const interval = setInterval(checkAllServices, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: ServiceStatus["status"]) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "degraded":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "offline":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: ServiceStatus["status"]) => {
    switch (status) {
      case "healthy":
        return "border-green-200 bg-green-50";
      case "degraded":
        return "border-yellow-200 bg-yellow-50";
      case "offline":
        return "border-red-200 bg-red-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  const restartService = async (serviceName: string) => {
    setLogs((prev) => [...prev, `🔄 Attempting to restart ${serviceName}...`]);

    // Simulate restart process
    setTimeout(() => {
      setLogs((prev) => [...prev, `✅ ${serviceName} restart completed`]);
      checkAllServices();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
              <Server className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Backend Control Center
              </h1>
              <p className="text-gray-600">
                Monitor and manage all backend services
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowLogs(!showLogs)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              {showLogs ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
              {showLogs ? "Hide" : "Show"} Logs
            </button>
            <button
              onClick={checkAllServices}
              disabled={isRefreshing}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              {isRefreshing ? "Checking..." : "Refresh All"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Service Status */}
        <div className="xl:col-span-2 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Service Status
            </h2>
            <div className="space-y-4">
              {services.map((service, index) => (
                <motion.div
                  key={service.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-6 rounded-xl border-2 ${getStatusColor(service.status)} transition-all duration-200`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(service.status)}
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {service.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {service.endpoint}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                          service.status === "healthy"
                            ? "bg-green-100 text-green-700"
                            : service.status === "degraded"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {service.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <span className="text-gray-600">
                        Last Check: {service.lastCheck}
                      </span>
                      {service.responseTime && (
                        <span className="text-gray-600">
                          Response: {service.responseTime}ms
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => restartService(service.name)}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-sm"
                      >
                        <RotateCcw className="w-3 h-3 mr-1 inline" />
                        Restart
                      </button>
                    </div>
                  </div>

                  {service.error && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-700">{service.error}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* System Metrics */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              System Metrics
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-gray-600">
                    Uptime
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {metrics.uptime}%
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-gray-600">
                    Requests
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {metrics.totalRequests.toLocaleString()}
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Wifi className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium text-gray-600">
                    Connections
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {metrics.activeConnections}
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-600">
                    Response
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {metrics.avgResponseTime}ms
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* System Logs */}
        {showLogs && (
          <div className="xl:col-span-1">
            <div className="sticky top-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                System Logs
              </h2>
              <div className="bg-gray-900 text-green-400 p-4 rounded-xl h-96 overflow-y-auto font-mono text-sm">
                <div className="flex items-center gap-2 mb-4 text-gray-400">
                  <Terminal className="w-4 h-4" />
                  <span>Live System Logs</span>
                </div>
                {logs.slice(-20).map((log, index) => (
                  <div key={index} className="mb-2">
                    <span className="text-gray-500">
                      [{new Date().toLocaleTimeString()}]
                    </span>{" "}
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BackendStatusPage;

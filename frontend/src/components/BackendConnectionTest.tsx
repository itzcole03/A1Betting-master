/**
 * Backend Connection Test Component
 * Tests and displays the status of backend connectivity
 */

import React, { useState, useEffect } from "react";
import {
  backendApi,
  HealthStatus,
  BettingOpportunity,
} from "../services/backendApi";
import IntegrationStatus from "./IntegrationStatus";
import DevelopmentGuide from "./DevelopmentGuide";
import SimpleAdvancedIntegrationStatus from "./SimpleAdvancedIntegrationStatus";
import OllamaStatus from "./OllamaStatus";
import EnhancedFeaturesStatus from "./EnhancedFeaturesStatus";

interface ConnectionStatus {
  backend: "connected" | "disconnected" | "loading";
  websocket: "connected" | "disconnected" | "loading";
  lastUpdate: string;
}

export const BackendConnectionTest: React.FC = () => {
  const [status, setStatus] = useState<ConnectionStatus>({
    backend: "loading",
    websocket: "loading",
    lastUpdate: new Date().toISOString(),
  });
  const [healthData, setHealthData] = useState<HealthStatus | null>(null);
  const [bettingOpps, setBettingOpps] = useState<BettingOpportunity[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    testBackendConnection();
    setupWebSocketListeners();

    // Test connection every 30 seconds
    const interval = setInterval(testBackendConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  const testBackendConnection = async () => {
    try {
      setError(null);
      setStatus((prev) => ({ ...prev, backend: "loading" }));

      // Test health endpoint
      const health = await backendApi.getHealth();
      setHealthData(health);
      setStatus((prev) => ({
        ...prev,
        backend: "connected",
        lastUpdate: new Date().toISOString(),
      }));

      // Test a data endpoint
      const opportunities = await backendApi.getBettingOpportunities(
        undefined,
        3,
      );
      setBettingOpps(opportunities);
    } catch (err: any) {
      console.error("Backend connection test failed:", err);
      setError(err.message || "Failed to connect to backend");
      setStatus((prev) => ({
        ...prev,
        backend: "disconnected",
        lastUpdate: new Date().toISOString(),
      }));
    }
  };

  const setupWebSocketListeners = () => {
    backendApi.onWebSocketEvent("connection", () => {
      setStatus((prev) => ({ ...prev, websocket: "connected" }));
    });

    backendApi.onWebSocketEvent("disconnection", () => {
      setStatus((prev) => ({ ...prev, websocket: "disconnected" }));
    });

    backendApi.onWebSocketEvent("odds_update", (data) => {
      console.log("Received odds update:", data);
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "text-green-600";
      case "disconnected":
        return "text-red-600";
      case "loading":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return "✅";
      case "disconnected":
        return "❌";
      case "loading":
        return "⏳";
      default:
        return "❓";
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Development Setup Guide */}
      <DevelopmentGuide />

      {/* Enhanced Features Status */}
      <EnhancedFeaturesStatus />

      {/* Simple-to-Advanced Integration Status */}
      <SimpleAdvancedIntegrationStatus />

      {/* Ollama AI Engine Status */}
      <OllamaStatus />

      {/* Comprehensive Integration Status */}
      <IntegrationStatus />

      {/* Detailed Connection Test */}
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Detailed Connection Test
        </h2>

        {/* Connection Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">API Connection</h3>
            <div
              className={`flex items-center ${getStatusColor(status.backend)}`}
            >
              <span className="mr-2">{getStatusIcon(status.backend)}</span>
              <span className="capitalize">{status.backend}</span>
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">WebSocket Connection</h3>
            <div
              className={`flex items-center ${getStatusColor(status.websocket)}`}
            >
              <span className="mr-2">{getStatusIcon(status.websocket)}</span>
              <span className="capitalize">{status.websocket}</span>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Health Data */}
        {healthData && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Backend Health</h3>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Status</div>
                  <div className="font-medium">{healthData.status}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Version</div>
                  <div className="font-medium">{healthData.version}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Uptime</div>
                  <div className="font-medium">
                    {Math.round(healthData.uptime)}s
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Last Check</div>
                  <div className="font-medium text-xs">
                    {new Date(status.lastUpdate).toLocaleTimeString()}
                  </div>
                </div>
              </div>

              {/* Services Status */}
              <div className="mt-4">
                <div className="text-sm text-gray-600 mb-2">Services</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {Object.entries(healthData.services).map(
                    ([service, serviceStatus]) => (
                      <div key={service} className="flex items-center">
                        <span className="mr-1">
                          {serviceStatus === "operational" ? "✅" : "❌"}
                        </span>
                        <span className="text-xs">
                          {service.replace("_", " ")}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sample Data */}
        {bettingOpps.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">
              Sample Betting Opportunities
            </h3>
            <div className="space-y-2">
              {bettingOpps.map((opp) => (
                <div key={opp.id} className="p-3 bg-blue-50 rounded border">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{opp.event}</div>
                      <div className="text-sm text-gray-600">
                        {opp.sport} • {opp.market} • Odds: {opp.odds}
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          opp.recommendation === "STRONG_BUY"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {opp.recommendation}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Confidence: {Math.round(opp.confidence * 100)}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={testBackendConnection}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            disabled={status.backend === "loading"}
          >
            {status.backend === "loading" ? "Testing..." : "Test Connection"}
          </button>

          <button
            onClick={() =>
              window.open("http://localhost:8000/health", "_blank")
            }
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Open Backend Health
          </button>
        </div>
      </div>
    </div>
  );
};

export default BackendConnectionTest;

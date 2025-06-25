/**
 * API Debug Component
 * Simple component to test API connections and display detailed error information
 */

import React, { useState, useEffect } from "react";
import { backendApi } from "../services/backendApi";

interface ApiTestResult {
  endpoint: string;
  status: "success" | "error" | "loading";
  data?: any;
  error?: string;
  responseTime?: number;
}

export const ApiDebug: React.FC = () => {
  const [results, setResults] = useState<ApiTestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<any>(null);

  const testEndpoints = [
    { name: "Health Check", fn: () => backendApi.getHealth() },
    {
      name: "Betting Opportunities",
      fn: () => backendApi.getBettingOpportunities(),
    },
    { name: "Advanced Analytics", fn: () => backendApi.getAdvancedAnalytics() },
    { name: "Model Performance", fn: () => backendApi.getModelPerformance() },
  ];

  const runTests = async () => {
    setIsRunning(true);
    setResults([]);

    // First, get connection status
    try {
      const status = await backendApi.getConnectionStatus();
      setConnectionStatus(status);
      console.log("[Debug] Connection status:", status);
    } catch (error) {
      console.error("[Debug] Failed to get connection status:", error);
    }

    for (const test of testEndpoints) {
      const startTime = Date.now();
      try {
        setResults((prev) => [
          ...prev,
          { endpoint: test.name, status: "loading" },
        ]);

        const data = await test.fn();
        const responseTime = Date.now() - startTime;

        setResults((prev) =>
          prev.map((r) =>
            r.endpoint === test.name
              ? { ...r, status: "success", data, responseTime }
              : r,
          ),
        );
      } catch (error: any) {
        const responseTime = Date.now() - startTime;

        setResults((prev) =>
          prev.map((r) =>
            r.endpoint === test.name
              ? {
                  ...r,
                  status: "error",
                  error: error.message || "Unknown error",
                  responseTime,
                }
              : r,
          ),
        );
      }
    }

    setIsRunning(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-400";
      case "error":
        return "text-red-400";
      case "loading":
        return "text-yellow-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "loading":
        return "⏳";
      default:
        return "❓";
    }
  };

  return (
    <div className="w-full h-full overflow-auto bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            API Connection Debug
          </h2>
          <button
            onClick={runTests}
            disabled={isRunning}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg disabled:opacity-50 transition-colors"
          >
            {isRunning ? "Testing..." : "Run Tests"}
          </button>
        </div>

        <div className="space-y-4">
          {results.map((result, index) => (
            <div
              key={index}
              className="bg-black/30 backdrop-blur-lg rounded-lg p-4 border border-cyan-500/20"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span>{getStatusIcon(result.status)}</span>
                  <h3 className="font-semibold text-white">
                    {result.endpoint}
                  </h3>
                  <span
                    className={`text-sm ${result.status === "success" ? "text-green-400" : result.status === "error" ? "text-red-400" : "text-yellow-400"}`}
                  >
                    {result.status}
                  </span>
                </div>
                {result.responseTime && (
                  <span className="text-sm text-gray-400">
                    {result.responseTime}ms
                  </span>
                )}
              </div>

              {result.error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded p-3 mb-2">
                  <p className="text-red-400 text-sm font-medium">Error:</p>
                  <p className="text-red-300 text-sm">{result.error}</p>
                </div>
              )}

              {result.data && (
                <div className="bg-gray-800/30 border border-gray-600/30 rounded p-3">
                  <p className="text-gray-300 text-sm font-medium mb-2">
                    Response:
                  </p>
                  <pre className="text-xs text-gray-200 overflow-auto max-h-40 bg-black/20 p-2 rounded">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg backdrop-blur-sm">
          <h3 className="font-semibold text-cyan-400 mb-2">
            Debug Information
          </h3>
          <div className="text-sm text-gray-300 space-y-1">
            <p>
              <strong>Environment:</strong>{" "}
              {import.meta.env.DEV ? "Development" : "Production"}
            </p>
            <p>
              <strong>API Base URL:</strong>{" "}
              {import.meta.env.VITE_API_URL || "http://localhost:8000"}
            </p>
            <p>
              <strong>WebSocket URL:</strong>{" "}
              {import.meta.env.VITE_WEBSOCKET_URL || "ws://localhost:8000"}
            </p>
            <p>
              <strong>Current Time:</strong> {new Date().toISOString()}
            </p>
            <p>
              <strong>Cloud Environment:</strong>{" "}
              {window.location.hostname.includes("fly.dev")
                ? "Yes (Mock Service Active)"
                : "No"}
            </p>
          </div>
        </div>

        {connectionStatus && (
          <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg backdrop-blur-sm">
            <h3 className="font-semibold text-purple-400 mb-2">
              Connection Status
            </h3>
            <div className="text-sm space-y-2">
              <div className="flex items-center space-x-2">
                <span>{connectionStatus.isConnected ? "✅" : "❌"}</span>
                <span className="text-gray-300">
                  <strong>Backend Connection:</strong>{" "}
                  {connectionStatus.isConnected ? "Connected" : "Disconnected"}
                </span>
              </div>
              <p className="text-gray-300">
                <strong>Base URL:</strong> {connectionStatus.baseURL}
              </p>
              {connectionStatus.error && (
                <p className="text-red-400">
                  <strong>Error:</strong> {connectionStatus.error}
                </p>
              )}

              <div className="mt-2">
                <p className="font-medium mb-1 text-gray-300">
                  Endpoint Status:
                </p>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  {Object.entries(connectionStatus.endpoints).map(
                    ([endpoint, isWorking]) => (
                      <div
                        key={endpoint}
                        className="flex items-center space-x-1"
                      >
                        <span>{isWorking ? "✅" : "❌"}</span>
                        <span className="text-gray-400">{endpoint}</span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiDebug;

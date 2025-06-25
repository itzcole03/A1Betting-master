import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, Clock, Wifi } from "lucide-react";

interface ApiEndpoint {
  name: string;
  url: string;
  status: "pending" | "success" | "error";
  response?: any;
  error?: string;
}

export const DebugApiStatus: React.FC = () => {
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>([
    { name: "Health", url: "/health", status: "pending" },
    {
      name: "Betting Opportunities",
      url: "/api/betting-opportunities",
      status: "pending",
    },
    { name: "Predictions", url: "/api/predictions", status: "pending" },
    { name: "Analytics", url: "/api/analytics/advanced", status: "pending" },
  ]);

  const [environment, setEnvironment] = useState({
    isDev: import.meta.env.DEV,
    hostname: window.location.hostname,
    protocol: window.location.protocol,
    port: window.location.port,
  });

  useEffect(() => {
    const testEndpoints = async () => {
      const results = await Promise.allSettled(
        endpoints.map(async (endpoint) => {
          try {
            const response = await fetch(endpoint.url);
            const data = await response.json();
            return { ...endpoint, status: "success", response: data };
          } catch (error: any) {
            return { ...endpoint, status: "error", error: error.message };
          }
        }),
      );

      setEndpoints(
        results.map((result, index) =>
          result.status === "fulfilled"
            ? result.value
            : { ...endpoints[index], status: "error", error: "Request failed" },
        ),
      );
    };

    testEndpoints();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-400 animate-spin" />;
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="bg-black/80 backdrop-blur-lg border border-gray-700 rounded-lg p-4 text-sm">
        <div className="flex items-center gap-2 mb-3">
          <Wifi className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-cyan-400">API Status</span>
        </div>

        <div className="space-y-2 mb-3">
          {endpoints.map((endpoint, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-gray-300">{endpoint.name}</span>
              <div className="flex items-center gap-2">
                {getStatusIcon(endpoint.status)}
                <span
                  className={`text-xs ${
                    endpoint.status === "success"
                      ? "text-green-400"
                      : endpoint.status === "error"
                        ? "text-red-400"
                        : "text-yellow-400"
                  }`}
                >
                  {endpoint.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-700 pt-2 text-xs text-gray-400">
          <div>
            Environment: {environment.isDev ? "Development" : "Production"}
          </div>
          <div>
            Host: {environment.hostname}:{environment.port}
          </div>
          <div>Protocol: {environment.protocol}</div>
        </div>
      </div>
    </div>
  );
};

export default DebugApiStatus;

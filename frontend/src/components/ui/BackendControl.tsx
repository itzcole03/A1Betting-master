import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Server,
  Play,
  RefreshCw,
  Square,
  Wifi,
  WifiOff,
  CheckCircle,
  XCircle,
  Clock,
  Settings,
  Terminal,
} from "lucide-react";
import { api } from "../../services/api";
import { BackendStarter } from "../../utils/backendStarter";
import toast from "react-hot-toast";

interface BackendControlProps {
  isOffline: boolean;
  onStatusChange?: (isOnline: boolean) => void;
}

// Detect if user is on Windows
const isWindows = () => {
  if (typeof navigator === "undefined") return false;
  const isWin =
    navigator.platform.includes("Win") ||
    navigator.userAgent.includes("Windows");
  console.log("🪟 Windows detection:", {
    platform: navigator.platform,
    userAgent: navigator.userAgent,
    isWindows: isWin,
  });
  return isWin;
};

export const BackendControl: React.FC<BackendControlProps> = ({
  isOffline,
  onStatusChange,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [backendStatus, setBackendStatus] = useState<
    "online" | "offline" | "starting" | "error"
  >("offline");

  // Update backend status when isOffline prop changes
  useEffect(() => {
    setBackendStatus(isOffline ? "offline" : "online");
  }, [isOffline]);

  const testConnection = async () => {
    setIsLoading(true);

    try {
      toast.loading("Testing backend connection...", { id: "connection-test" });

      const status = await BackendStarter.checkBackendStatusWithScan();

      if (status.isOnline) {
        setBackendStatus("online");
        toast.success(
          <>
            <div className="font-semibold">✅ Backend Online</div>
            <div className="text-sm">All services are responding normally</div>
          </>,
          { id: "connection-test" },
        );
        onStatusChange?.(true);
      } else {
        setBackendStatus("offline");

        // Check if we're in a cloud environment
        const isCloudEnv =
          !window.location.hostname.includes("localhost") &&
          !window.location.hostname.includes("127.0.0.1");

        toast.error(
          <>
            <div className="font-semibold">❌ Backend Offline</div>
            <div className="text-sm">
              {status.error || "Services are not responding"}
            </div>
            <div className="text-xs mt-1 opacity-75">
              {isCloudEnv
                ? "In production, ensure your backend service is deployed and accessible"
                : "Try starting the backend or check if it's running on a different port"}
            </div>
          </>,
          {
            id: "connection-test",
            duration: 6000,
          },
        );
        onStatusChange?.(false);
      }
    } catch (error) {
      setBackendStatus("error");
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      toast.error(
        <>
          <div className="font-semibold">🚫 Connection Error</div>
          <div className="text-sm">{errorMessage}</div>
          <div className="text-xs mt-1 opacity-75">
            Backend may not be running or accessible
          </div>
        </>,
        {
          id: "connection-test",
          duration: 6000,
        },
      );

      console.error("Connection test error:", error);
      onStatusChange?.(false);
    } finally {
      setIsLoading(false);
    }
  };

  const startBackend = async () => {
    console.log("🚀 Start backend button clicked!");
    setIsLoading(true);
    setBackendStatus("starting");

    try {
      // Always show immediate feedback that the button was clicked
      toast.loading("Checking backend status...", { id: "backend-start" });
      console.log("📡 Calling BackendStarter.startBackend()...");

      // First, try multiple connection attempts
      const result = await BackendStarter.startBackend();
      console.log("🔄 Backend start result:", result);

      // Always process the result, whether success or failure
      if (result?.success) {
        setBackendStatus("online");
        toast.success(result.message, { id: "backend-start" });
        onStatusChange?.(true);

        // Retest connection after a short delay
        setTimeout(async () => {
          const status = await BackendStarter.checkBackendStatus();
          if (!status.isOnline) {
            setBackendStatus("offline");
            toast.error(
              "Backend started but connection lost. Please check manually.",
              {
                id: "backend-recheck",
                duration: 8000,
              },
            );
          }
        }, 3000);
      } else {
        setBackendStatus("offline");

        // Always show the message to the user, even if it's about environment restrictions
        const isEnvironmentMessage = result?.message?.includes(
          "only available in local development",
        );
        const windowsPlatform = isWindows();

        toast.error(
          <>
            <div className="font-semibold mb-2">
              {isEnvironmentMessage
                ? "🌐 Production Environment"
                : "🪟 Backend Start Failed"}
            </div>
            <div className="text-sm space-y-1">
              {isEnvironmentMessage ? (
                <>
                  <div>
                    Backend control is only available in local development
                  </div>
                  <div className="text-xs opacity-75 mt-2">
                    In production, the backend should be managed by your
                    deployment platform (fly.dev, vercel, etc.)
                  </div>
                  <div className="text-xs opacity-75 mt-1">
                    For local development (
                    {windowsPlatform ? "Windows" : "Unix/Linux"}):
                  </div>
                  <div className="font-mono bg-gray-700 px-2 py-1 rounded text-xs">
                    {windowsPlatform ? (
                      <>
                        cd backend
                        <br />
                        python main_enhanced.py
                      </>
                    ) : (
                      "cd backend && python main_enhanced.py"
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div>
                    Manual start required for{" "}
                    {windowsPlatform ? "Windows" : "Unix/Linux"}:
                  </div>
                  <div className="font-mono bg-gray-800 p-2 rounded text-xs">
                    {windowsPlatform ? (
                      <>
                        cd backend
                        <br />
                        python main_enhanced.py
                      </>
                    ) : (
                      "cd backend && python main_enhanced.py"
                    )}
                  </div>
                  <div className="text-xs opacity-75">
                    {windowsPlatform
                      ? "Run each command separately in PowerShell/CMD"
                      : "Commands can be chained with &&"}
                  </div>
                  <div>Backend should start on http://localhost:8000</div>
                </>
              )}
            </div>
          </>,
          {
            id: "backend-start",
            duration: isEnvironmentMessage ? 8000 : 12000,
          },
        );
      }
    } catch (error) {
      console.error("🚨 Backend start error:", error);
      setBackendStatus("error");
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      const windowsPlatform = isWindows();

      // Check if it's a network error
      const isNetworkError =
        errorMessage.includes("fetch") ||
        errorMessage.includes("network") ||
        errorMessage.includes("timeout");

      toast.error(
        <>
          <div className="font-semibold mb-2">
            {isNetworkError
              ? "🌐 Network Connection Error"
              : "❌ Backend Start Error"}
          </div>
          <div className="text-sm space-y-1">
            <div>Error: {errorMessage}</div>
            <div className="mt-2">
              Manual start required for{" "}
              {windowsPlatform ? "Windows" : "Unix/Linux"}:
            </div>
            <div className="font-mono bg-gray-800 p-2 rounded text-xs">
              {windowsPlatform ? (
                <>
                  cd backend
                  <br />
                  python main_enhanced.py
                </>
              ) : (
                "cd backend && python main_enhanced.py"
              )}
            </div>
            <div className="text-xs opacity-75">
              {windowsPlatform
                ? "Run each command separately in PowerShell/CMD"
                : "Commands can be chained with &&"}
            </div>
            <div>Backend should start on http://localhost:8000</div>
          </div>
        </>,
        {
          id: "backend-start",
          duration: 12000,
        },
      );

      console.error("Backend start error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const restartBackend = async () => {
    setIsLoading(true);
    setBackendStatus("starting");

    try {
      toast.loading("Restarting backend services...", {
        id: "backend-restart",
      });

      const result = await BackendStarter.restartBackend();

      if (result.success) {
        setBackendStatus("online");
        toast.success(result.message, { id: "backend-restart" });
        onStatusChange?.(true);
      } else {
        setBackendStatus("offline");
        toast.error(result.message, {
          id: "backend-restart",
          duration: 6000,
        });
      }
    } catch (error) {
      setBackendStatus("error");
      toast.error("Failed to restart backend services", {
        id: "backend-restart",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = () => {
    switch (backendStatus) {
      case "online":
        return "text-green-400 border-green-500/30 bg-green-500/10";
      case "offline":
        return "text-red-400 border-red-500/30 bg-red-500/10";
      case "starting":
        return "text-yellow-400 border-yellow-500/30 bg-yellow-500/10";
      case "error":
        return "text-red-400 border-red-500/30 bg-red-500/10";
      default:
        return "text-gray-400 border-gray-500/30 bg-gray-500/10";
    }
  };

  const getStatusIcon = () => {
    switch (backendStatus) {
      case "online":
        return <CheckCircle className="w-4 h-4" />;
      case "offline":
        return <XCircle className="w-4 h-4" />;
      case "starting":
        return <Clock className="w-4 h-4 animate-spin" />;
      case "error":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Server className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-black/80 backdrop-blur-xl border border-gray-600/50 rounded-xl shadow-2xl"
      >
        {/* Main Control Panel */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Server className="w-6 h-6 text-blue-400" />
                {backendStatus === "online" && (
                  <Wifi className="w-3 h-3 text-green-400 absolute -top-1 -right-1" />
                )}
                {backendStatus === "offline" && (
                  <WifiOff className="w-3 h-3 text-red-400 absolute -top-1 -right-1" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">
                  Backend Control
                </h3>
                <div
                  className={`text-xs font-medium ${getStatusColor().split(" ")[0]}`}
                >
                  {backendStatus.charAt(0).toUpperCase() +
                    backendStatus.slice(1)}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowDetails(!showDetails)}
              className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700/50"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>

          {/* Status Indicator */}
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border mb-4 ${getStatusColor()}`}
          >
            {getStatusIcon()}
            <span className="text-sm font-medium">
              {backendStatus === "online" && "Backend Online"}
              {backendStatus === "offline" && "Backend Offline"}
              {backendStatus === "starting" && "Starting..."}
              {backendStatus === "error" && "Connection Error"}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={testConnection}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Wifi className="w-4 h-4" />
              Test
            </motion.button>

            {(backendStatus === "offline" || backendStatus === "error") && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.preventDefault();
                  console.log("🎯 Start button onClick triggered");
                  startBackend();
                }}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Play className="w-4 h-4" />
                Start
              </motion.button>
            )}

            {backendStatus === "online" && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={restartBackend}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Restart
              </motion.button>
            )}
          </div>
        </div>

        {/* Detailed Information Panel */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-600/50 p-4 bg-gray-900/50"
            >
              <div className="flex items-center gap-2 mb-3">
                <Terminal className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-300">
                  Connection Details
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Endpoint:</span>
                  <span className="text-gray-300 font-mono break-all">
                    {BackendStarter.getBackendUrl()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span
                    className={`font-mono ${
                      backendStatus === "online"
                        ? "text-green-400"
                        : backendStatus === "starting"
                          ? "text-yellow-400"
                          : "text-red-400"
                    }`}
                  >
                    {backendStatus.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Platform:</span>
                  <span className="text-gray-300 font-mono">
                    {isWindows() ? "🪟 Windows" : "🐧 Unix/Linux"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">User Agent:</span>
                  <span className="text-gray-300 font-mono text-xs truncate">
                    {navigator.userAgent.substring(0, 20)}...
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Last Check:</span>
                  <span className="text-gray-300">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-600/30">
                <div className="text-xs text-gray-400">
                  <strong>Manual Start:</strong>
                  <div className="mt-1">
                    {(() => {
                      const windowsDetected = isWindows();
                      return windowsDetected ? (
                        <>
                          <div className="text-gray-300">
                            Windows PowerShell/CMD:
                          </div>
                          <div className="font-mono bg-gray-700 px-2 py-1 rounded text-xs mt-1">
                            cd backend
                            <br />
                            pip install -r requirements.txt
                            <br />
                            python main_enhanced.py
                          </div>
                          <div className="text-xs opacity-75 mt-1">
                            (Run each command separately, first time only needs
                            pip install)
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="text-gray-300">
                            Unix/Linux Terminal:
                          </div>
                          <div className="font-mono bg-gray-700 px-2 py-1 rounded text-xs mt-1">
                            cd backend && pip install -r requirements.txt &&
                            python main_enhanced.py
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default BackendControl;

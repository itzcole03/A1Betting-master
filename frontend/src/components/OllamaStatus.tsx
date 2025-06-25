/**
 * Ollama Status Component
 * Shows the status of local Ollama installation and available models
 */

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  CheckCircle,
  XCircle,
  Download,
  ExternalLink,
  RefreshCw,
  Server,
  Cpu,
  AlertTriangle,
  Info,
} from "lucide-react";
import { ollamaLLMService } from "../services/ollamaLLMService";

interface OllamaStatusData {
  connected: boolean;
  endpoint: string;
  models: Array<{
    name: string;
    size?: number;
    modified_at?: string;
  }>;
  currentModel: string;
  responseTime?: number;
}

export const OllamaStatus: React.FC = () => {
  const [status, setStatus] = useState<OllamaStatusData>({
    connected: false,
    endpoint: "http://localhost:11434",
    models: [],
    currentModel: "none",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [testResponse, setTestResponse] = useState<string>("");

  useEffect(() => {
    checkOllamaStatus();
  }, []);

  const checkOllamaStatus = async () => {
    setIsLoading(true);

    try {
      const connectionStatus = ollamaLLMService.getConnectionStatus();
      const availableModels = ollamaLLMService.getAvailableModels();
      const currentModel = ollamaLLMService.getCurrentModel();

      setStatus({
        connected: connectionStatus.connected,
        endpoint: connectionStatus.endpoint,
        models: availableModels,
        currentModel: currentModel,
      });

      // Test Ollama with a simple query if connected
      if (connectionStatus.connected) {
        await testOllamaResponse();
      }
    } catch (error) {
      console.error("Error checking Ollama status:", error);
      setStatus((prev) => ({ ...prev, connected: false }));
    }

    setIsLoading(false);
  };

  const testOllamaResponse = async () => {
    try {
      const startTime = Date.now();
      const testResult = await ollamaLLMService.generateResponse({
        message: "Give me a very brief test response (max 20 words)",
        analysisType: "general",
      });

      const responseTime = Date.now() - startTime;
      setStatus((prev) => ({ ...prev, responseTime }));
      setTestResponse(testResult.content.substring(0, 100) + "...");
    } catch (error) {
      setTestResponse("Test failed: " + error);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (!bytes) return "Unknown size";
    const gb = bytes / (1024 * 1024 * 1024);
    return `${gb.toFixed(1)} GB`;
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-900 rounded-lg shadow-2xl">
        <div className="flex items-center justify-center">
          <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin mr-3" />
          <span className="text-white">Checking Ollama Status...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 rounded-lg shadow-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
          <Brain className="w-6 h-6 text-purple-400 mr-3" />
          PropOllama AI Engine Status
        </h2>
        <p className="text-gray-300">
          Local Ollama integration for AI-powered sports betting analysis
        </p>
      </div>

      {/* Connection Status */}
      <div
        className={`p-4 rounded-lg border mb-6 ${
          status.connected
            ? "bg-green-500/10 border-green-500/30"
            : "bg-red-500/10 border-red-500/30"
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-white flex items-center">
            <Server className="w-5 h-5 mr-2" />
            Ollama Connection
          </h3>
          {status.connected ? (
            <CheckCircle className="w-5 h-5 text-green-400" />
          ) : (
            <XCircle className="w-5 h-5 text-red-400" />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Endpoint: </span>
            <span className="text-white">{status.endpoint}</span>
          </div>
          <div>
            <span className="text-gray-400">Status: </span>
            <span
              className={status.connected ? "text-green-400" : "text-red-400"}
            >
              {status.connected ? "Connected" : "Disconnected"}
            </span>
          </div>
          {status.responseTime && (
            <div>
              <span className="text-gray-400">Response Time: </span>
              <span className="text-white">{status.responseTime}ms</span>
            </div>
          )}
          <div>
            <span className="text-gray-400">Models: </span>
            <span className="text-white">{status.models.length}</span>
          </div>
        </div>
      </div>

      {/* Models Status */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
          <Cpu className="w-5 h-5 text-cyan-400 mr-2" />
          Available Models
        </h3>

        {status.models.length > 0 ? (
          <div className="space-y-2">
            {status.models.map((model, index) => (
              <motion.div
                key={model.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded border ${
                  model.name === status.currentModel
                    ? "bg-purple-500/20 border-purple-500/50"
                    : "bg-gray-800/50 border-gray-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-white">{model.name}</span>
                    {model.name === status.currentModel && (
                      <span className="ml-2 px-2 py-1 bg-purple-500 text-white text-xs rounded">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-400">
                    {model.size ? formatFileSize(model.size) : "Unknown size"}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-yellow-400 mr-3 mt-0.5" />
              <div>
                <p className="text-yellow-300 font-medium">No Models Found</p>
                <p className="text-yellow-200 text-sm mt-1">
                  Install Ollama and download models to enable AI features
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Test Response */}
      {testResponse && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">
            Test Response
          </h3>
          <div className="p-3 bg-gray-800/50 border border-gray-700 rounded">
            <p className="text-gray-300 text-sm">{testResponse}</p>
          </div>
        </div>
      )}

      {/* Installation Guide */}
      {!status.connected && (
        <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-300 mb-3 flex items-center">
            <Info className="w-5 h-5 mr-2" />
            Enable AI Features
          </h3>

          <div className="space-y-3 text-sm">
            <div className="flex items-start">
              <span className="inline-block w-6 h-6 bg-blue-500 text-white rounded-full text-center text-xs leading-6 mr-3 mt-0.5">
                1
              </span>
              <div>
                <p className="text-blue-200 font-medium">Install Ollama</p>
                <p className="text-blue-100">
                  Download and install from ollama.ai
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <span className="inline-block w-6 h-6 bg-blue-500 text-white rounded-full text-center text-xs leading-6 mr-3 mt-0.5">
                2
              </span>
              <div>
                <p className="text-blue-200 font-medium">Download a Model</p>
                <p className="text-blue-100">
                  Run:{" "}
                  <code className="bg-gray-800 px-1 rounded">
                    ollama pull llama3.2
                  </code>
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <span className="inline-block w-6 h-6 bg-blue-500 text-white rounded-full text-center text-xs leading-6 mr-3 mt-0.5">
                3
              </span>
              <div>
                <p className="text-blue-200 font-medium">
                  Restart Development Server
                </p>
                <p className="text-blue-100">
                  PropOllama will automatically detect Ollama
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={checkOllamaStatus}
          disabled={isLoading}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center"
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh Status
        </button>

        <a
          href="https://ollama.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Ollama
        </a>

        <button
          onClick={testOllamaResponse}
          disabled={!status.connected || isLoading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center"
        >
          <Brain className="w-4 h-4 mr-2" />
          Test AI Response
        </button>
      </div>

      <div className="mt-4 p-3 bg-gray-800/30 rounded text-xs text-gray-400">
        <p>
          💡 <strong>Tip:</strong> For best PropOllama performance, use models
          like llama3.2, mistral, or phi3. Larger models provide better analysis
          but require more system resources.
        </p>
      </div>
    </div>
  );
};

export default OllamaStatus;

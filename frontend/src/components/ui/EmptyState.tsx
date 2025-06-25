import React from "react";
import { motion } from "framer-motion";
import { WifiOff, RefreshCw, AlertCircle } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "Service Unavailable",
  message = "This feature requires backend services to be running.",
  icon = <WifiOff className="w-16 h-16 text-gray-400" />,
  action,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-12 text-center bg-gray-800/20 backdrop-blur-sm border border-gray-600/30 rounded-2xl"
    >
      <div className="mb-6 opacity-60">{icon}</div>

      <h3 className="text-xl font-semibold text-gray-200 mb-3">{title}</h3>

      <p className="text-gray-400 max-w-md mb-6">{message}</p>

      {action && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={action.onClick}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          {action.label}
        </motion.button>
      )}

      <div className="mt-6 text-xs text-gray-500 flex items-center gap-1">
        <AlertCircle className="w-3 h-3" />
        <span>No mock or placeholder data is shown</span>
      </div>
    </motion.div>
  );
};

export default EmptyState;

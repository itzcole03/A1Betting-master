import React from "react";
import { motion } from "framer-motion";
import { WifiOff, AlertCircle, RefreshCw } from "lucide-react";

interface OfflineIndicatorProps {
  show: boolean;
  service?: string;
  onRetry?: () => void;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  show,
  service = "Betting services",
  onRetry,
}) => {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-20 right-4 z-50 bg-red-500/90 backdrop-blur-sm text-white px-4 py-3 rounded-lg shadow-lg border border-red-400/50 flex items-center gap-3"
    >
      <div className="flex items-center gap-2">
        <WifiOff className="w-5 h-5 animate-pulse" />
        <AlertCircle className="w-4 h-4" />
      </div>
      <div className="flex-1">
        <div className="font-semibold text-sm">{service} Offline</div>
        <div className="text-xs text-red-200">
          Backend services are temporarily unavailable
        </div>
      </div>
      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-xs font-medium transition-colors flex items-center gap-1"
        >
          <RefreshCw className="w-3 h-3" />
          Retry
        </motion.button>
      )}
    </motion.div>
  );
};

export default OfflineIndicator;

import React from "react";

interface StatusIndicatorProps {
  status: "active" | "warning" | "error";
  label: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, label }) => {
  const statusColors = {
    active: "bg-green-400",
    warning: "bg-yellow-400",
    error: "bg-red-400",
  };

  return (
    <div className="flex items-center space-x-2">
      <div
        className={`w-2 h-2 ${statusColors[status]} rounded-full animate-pulse`}
      />
      <span className="text-sm text-gray-300">{label}</span>
    </div>
  );
};

export default StatusIndicator;

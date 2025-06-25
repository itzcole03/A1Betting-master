import React from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  Brain,
  Target,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  BarChart3,
  AlertTriangle,
} from "lucide-react";

interface ActivityItem {
  id: string;
  type:
    | "bet_placed"
    | "bet_won"
    | "bet_lost"
    | "prediction_generated"
    | "model_updated"
    | "opportunity_found"
    | "alert_triggered";
  title: string;
  description: string;
  timestamp: Date;
  metadata?: {
    amount?: number;
    odds?: number;
    confidence?: number;
    game?: string;
    profit?: number;
    model?: string;
  };
  status?: "success" | "warning" | "error" | "info";
}

interface ModernActivityFeedProps {
  className?: string;
  activities?: ActivityItem[];
  maxItems?: number;
  showTimeline?: boolean;
}

const defaultActivities: ActivityItem[] = [
  {
    id: "1",
    type: "opportunity_found",
    title: "High Value Opportunity Detected",
    description: "Lakers vs Warriors Over 235.5 - 89% confidence prediction",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    metadata: {
      confidence: 89,
      odds: 1.85,
      game: "Lakers vs Warriors",
    },
    status: "info",
  },
  {
    id: "2",
    type: "bet_won",
    title: "Bet Won",
    description: "Celtics -5.5 hit successfully",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    metadata: {
      amount: 100,
      profit: 185,
      odds: 1.85,
      game: "Celtics vs Heat",
    },
    status: "success",
  },
  {
    id: "3",
    type: "prediction_generated",
    title: "AI Prediction Generated",
    description: "NBA model generated 12 new predictions",
    timestamp: new Date(Date.now() - 25 * 60 * 1000),
    metadata: {
      confidence: 84,
      model: "NBA Advanced Model v2.1",
    },
    status: "info",
  },
  {
    id: "4",
    type: "bet_placed",
    title: "Bet Placed",
    description: "Warriors +7.5 vs Lakers",
    timestamp: new Date(Date.now() - 35 * 60 * 1000),
    metadata: {
      amount: 50,
      odds: 1.9,
      game: "Warriors vs Lakers",
    },
    status: "info",
  },
  {
    id: "5",
    type: "model_updated",
    title: "Model Updated",
    description: "NFL model updated with week 15 injury reports",
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    metadata: {
      model: "NFL Predictive Model v3.2",
    },
    status: "info",
  },
  {
    id: "6",
    type: "alert_triggered",
    title: "Bankroll Alert",
    description: "Daily betting limit reached 75%",
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    status: "warning",
  },
];

const getActivityIcon = (type: ActivityItem["type"], status?: string) => {
  const iconClass = "w-4 h-4";

  switch (type) {
    case "bet_won":
      return <CheckCircle className={`${iconClass} text-green-400`} />;
    case "bet_lost":
      return <XCircle className={`${iconClass} text-red-400`} />;
    case "bet_placed":
      return <DollarSign className={`${iconClass} text-blue-400`} />;
    case "prediction_generated":
      return <Brain className={`${iconClass} text-purple-400`} />;
    case "model_updated":
      return <BarChart3 className={`${iconClass} text-cyan-400`} />;
    case "opportunity_found":
      return <Target className={`${iconClass} text-yellow-400`} />;
    case "alert_triggered":
      return <AlertTriangle className={`${iconClass} text-orange-400`} />;
    default:
      return <Activity className={`${iconClass} text-gray-400`} />;
  }
};

const getStatusColor = (status?: string) => {
  switch (status) {
    case "success":
      return "border-green-400/30 bg-green-500/5";
    case "warning":
      return "border-yellow-400/30 bg-yellow-500/5";
    case "error":
      return "border-red-400/30 bg-red-500/5";
    default:
      return "border-gray-600/30 bg-gray-500/5";
  }
};

const formatTimestamp = (timestamp: Date) => {
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return timestamp.toLocaleDateString();
};

export const ModernActivityFeed: React.FC<ModernActivityFeedProps> = ({
  className = "",
  activities = defaultActivities,
  maxItems = 10,
  showTimeline = true,
}) => {
  const displayActivities = activities.slice(0, maxItems);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Activity size={18} className="text-gray-400" />
          <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
        </div>
        <div className="text-xs text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Activity List */}
      <div className="space-y-3">
        {displayActivities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`
              relative p-4 rounded-xl border transition-all hover:bg-gray-800/30
              ${getStatusColor(activity.status)}
            `}
          >
            {/* Timeline connector */}
            {showTimeline && index < displayActivities.length - 1 && (
              <div className="absolute left-6 top-12 w-px h-6 bg-gray-600/30" />
            )}

            <div className="flex items-start space-x-3">
              {/* Icon */}
              <div className="flex-shrink-0 p-2 rounded-lg bg-gray-800/50">
                {getActivityIcon(activity.type, activity.status)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-white">
                      {activity.title}
                    </h4>
                    <p className="mt-1 text-sm text-gray-300">
                      {activity.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-gray-500 ml-4">
                    <Clock size={12} />
                    <span>{formatTimestamp(activity.timestamp)}</span>
                  </div>
                </div>

                {/* Metadata */}
                {activity.metadata && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {activity.metadata.amount && (
                      <div className="flex items-center space-x-1 px-2 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-xs">
                        <DollarSign size={12} />
                        <span>${activity.metadata.amount}</span>
                      </div>
                    )}
                    {activity.metadata.profit && (
                      <div className="flex items-center space-x-1 px-2 py-1 bg-green-500/10 text-green-400 rounded-lg text-xs">
                        <TrendingUp size={12} />
                        <span>+${activity.metadata.profit}</span>
                      </div>
                    )}
                    {activity.metadata.odds && (
                      <div className="flex items-center space-x-1 px-2 py-1 bg-purple-500/10 text-purple-400 rounded-lg text-xs">
                        <Target size={12} />
                        <span>{activity.metadata.odds}</span>
                      </div>
                    )}
                    {activity.metadata.confidence && (
                      <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-500/10 text-yellow-400 rounded-lg text-xs">
                        <Zap size={12} />
                        <span>{activity.metadata.confidence}%</span>
                      </div>
                    )}
                    {activity.metadata.game && (
                      <div className="px-2 py-1 bg-gray-500/10 text-gray-400 rounded-lg text-xs">
                        {activity.metadata.game}
                      </div>
                    )}
                    {activity.metadata.model && (
                      <div className="px-2 py-1 bg-cyan-500/10 text-cyan-400 rounded-lg text-xs">
                        {activity.metadata.model}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      {activities.length > maxItems && (
        <div className="text-center">
          <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
            View all {activities.length} activities
          </button>
        </div>
      )}
    </div>
  );
};

export default ModernActivityFeed;

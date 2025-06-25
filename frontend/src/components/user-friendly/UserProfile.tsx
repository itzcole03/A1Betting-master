import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Settings,
  TrendingUp,
  DollarSign,
  Award,
  Target,
  Edit3,
  Save,
  X,
  Camera,
  Mail,
  MapPin,
  Calendar,
  Trophy,
  Activity,
  Brain,
  Shield,
  ChevronRight,
  BarChart3,
  Zap,
  Crown,
  Star,
  Medal,
  Flame,
} from "lucide-react";
import toast from "react-hot-toast";
import { getUserDisplayName, getUserEmail } from "../../utils/userSettings";

interface UserProfileProps {
  onNavigate: (page: string) => void;
}

interface UserStats {
  totalProfit: number;
  winRate: number;
  totalBets: number;
  avgROI: number;
  currentStreak: number;
  longestStreak: number;
  accuracy: number;
  sharpeRatio: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedDate: string;
  rarity: "common" | "rare" | "legendary";
}

interface RiskProfile {
  type: "conservative" | "moderate" | "aggressive";
  maxStake: number;
  maxExposure: number;
  kellyFraction: number;
}

const UserProfile: React.FC<UserProfileProps> = ({ onNavigate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "stats" | "achievements" | "risk"
  >("overview");

  const [userData, setUserData] = useState({
    name: getUserDisplayName() || "Ultimate User",
    email: getUserEmail() || "user@a1betting.com",
    username: "ultimate_bettor",
    bio: "Professional sports bettor leveraging AI and advanced analytics for consistent profits.",
    location: "New York, NY",
    memberSince: "2023-01-15",
    tier: "Ultimate Brain Pro",
    avatar: null as string | null,
    verified: true,
  });

  const [editedData, setEditedData] = useState(userData);

  const [stats] = useState<UserStats>({
    totalProfit: 47350.75,
    winRate: 84.7,
    totalBets: 1247,
    avgROI: 18.3,
    currentStreak: 12,
    longestStreak: 28,
    accuracy: 87.2,
    sharpeRatio: 2.45,
  });

  const [achievements] = useState<Achievement[]>([
    {
      id: "1",
      title: "Ultimate Brain Pioneer",
      description: "First 100 users to activate Ultimate Brain AI",
      icon: "🧠",
      unlockedDate: "2024-01-15",
      rarity: "legendary",
    },
    {
      id: "2",
      title: "Profit Master",
      description: "Achieved $50k+ in total profits",
      icon: "💰",
      unlockedDate: "2024-12-20",
      rarity: "rare",
    },
    {
      id: "3",
      title: "Accuracy Expert",
      description: "Maintained 85%+ win rate for 30 days",
      icon: "🎯",
      unlockedDate: "2024-12-15",
      rarity: "rare",
    },
    {
      id: "4",
      title: "Streak Legend",
      description: "25+ consecutive winning bets",
      icon: "🔥",
      unlockedDate: "2024-12-10",
      rarity: "legendary",
    },
    {
      id: "5",
      title: "AI Collaborator",
      description: "Used PropOllama AI for 100+ predictions",
      icon: "🤖",
      unlockedDate: "2024-12-05",
      rarity: "common",
    },
    {
      id: "6",
      title: "Risk Manager",
      description: "Perfect bankroll management for 90 days",
      icon: "🛡️",
      unlockedDate: "2024-11-30",
      rarity: "rare",
    },
  ]);

  const [riskProfile] = useState<RiskProfile>({
    type: "moderate",
    maxStake: 2500,
    maxExposure: 12500,
    kellyFraction: 0.25,
  });

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData(userData);
  };

  const handleSave = () => {
    setUserData(editedData);
    setIsEditing(false);
    toast.success("Profile updated successfully! 🎉", {
      duration: 3000,
      icon: "✅",
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(userData);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedData((prev) => ({
          ...prev,
          avatar: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getRarityColor = (rarity: Achievement["rarity"]) => {
    switch (rarity) {
      case "legendary":
        return "from-yellow-400 to-orange-500";
      case "rare":
        return "from-purple-400 to-blue-500";
      case "common":
        return "from-gray-400 to-gray-600";
      default:
        return "from-gray-400 to-gray-600";
    }
  };

  const getRarityBorder = (rarity: Achievement["rarity"]) => {
    switch (rarity) {
      case "legendary":
        return "border-yellow-500/50";
      case "rare":
        return "border-purple-500/50";
      case "common":
        return "border-gray-500/50";
      default:
        return "border-gray-500/50";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.h1
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3"
        >
          👤 Ultimate Profile
        </motion.h1>
        <p className="text-gray-400 text-lg">
          Your complete betting journey with Ultimate Brain AI
        </p>
      </div>

      {/* Profile Header Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-8"
      >
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Avatar Section */}
          <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 p-1">
              <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center overflow-hidden">
                {userData.avatar ? (
                  <img
                    src={userData.avatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-bold text-white">
                    {userData.name.charAt(0)}
                  </span>
                )}
              </div>
            </div>
            {isEditing && (
              <label className="absolute inset-0 cursor-pointer bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-8 h-8 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>
            )}
            {userData.verified && (
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Crown className="w-4 h-4 text-white" />
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center lg:text-left">
            <div className="mb-4">
              {isEditing ? (
                <input
                  type="text"
                  value={editedData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="text-3xl font-bold bg-transparent border-b border-cyan-400 focus:outline-none text-white"
                />
              ) : (
                <h2 className="text-3xl font-bold text-white flex items-center gap-2 justify-center lg:justify-start">
                  {userData.name}
                  {userData.verified && (
                    <Star className="w-6 h-6 text-yellow-400 fill-current" />
                  )}
                </h2>
              )}

              <div className="flex items-center gap-2 text-cyan-400 mt-2 justify-center lg:justify-start">
                <Mail className="w-4 h-4" />
                {isEditing ? (
                  <input
                    type="email"
                    value={editedData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="bg-transparent border-b border-cyan-400 focus:outline-none"
                  />
                ) : (
                  <span>{userData.email}</span>
                )}
              </div>

              <div className="flex items-center gap-4 mt-3 text-gray-400 justify-center lg:justify-start">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.location}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                      className="bg-transparent border-b border-gray-500 focus:outline-none text-sm"
                    />
                  ) : (
                    <span className="text-sm">{userData.location}</span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    Member since{" "}
                    {new Date(userData.memberSince).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Tier Badge */}
            <div className="mb-4">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 rounded-full text-purple-300 font-medium">
                <Brain className="w-4 h-4" />
                {userData.tier}
              </span>
            </div>

            {/* Bio */}
            <div className="mb-4">
              {isEditing ? (
                <textarea
                  value={editedData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  rows={3}
                  className="w-full bg-gray-800/50 border border-gray-600 rounded-lg p-3 text-gray-300 focus:border-cyan-400 focus:outline-none resize-none"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-gray-300 text-lg max-w-2xl">
                  {userData.bio}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-center lg:justify-start">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Profile
                  </button>
                  <button
                    onClick={() => onNavigate("settings")}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <div className="flex justify-center">
        <div className="bg-gray-900/60 backdrop-blur-xl rounded-xl p-2 flex gap-2">
          {[
            { id: "overview", label: "Overview", icon: BarChart3 },
            { id: "stats", label: "Statistics", icon: TrendingUp },
            { id: "achievements", label: "Achievements", icon: Trophy },
            { id: "risk", label: "Risk Profile", icon: Shield },
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? "bg-cyan-500 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/60"
                }`}
              >
                <IconComponent className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: DollarSign,
                  label: "Total Profit",
                  value: `$${stats.totalProfit.toLocaleString()}`,
                  color: "green",
                  change: "+12.3%",
                },
                {
                  icon: TrendingUp,
                  label: "Win Rate",
                  value: `${stats.winRate}%`,
                  color: "cyan",
                  change: "+2.1%",
                },
                {
                  icon: Target,
                  label: "Accuracy",
                  value: `${stats.accuracy}%`,
                  color: "purple",
                  change: "+1.5%",
                },
                {
                  icon: Flame,
                  label: "Current Streak",
                  value: `${stats.currentStreak}`,
                  color: "orange",
                  change: "🔥",
                },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-900/60 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6 text-center hover:border-cyan-500/30 transition-colors"
                >
                  <stat.icon
                    className={`w-8 h-8 mx-auto mb-3 text-${stat.color}-400`}
                  />
                  <div
                    className={`text-2xl font-bold text-${stat.color}-400 mb-1`}
                  >
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm mb-2">{stat.label}</div>
                  <div
                    className={`text-xs ${stat.color === "green" ? "text-green-400" : "text-orange-400"}`}
                  >
                    {stat.change}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === "stats" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Performance Metrics
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        label: "Total Bets",
                        value: stats.totalBets.toLocaleString(),
                      },
                      { label: "Average ROI", value: `${stats.avgROI}%` },
                      { label: "Sharpe Ratio", value: stats.sharpeRatio },
                      { label: "Longest Streak", value: stats.longestStreak },
                    ].map((metric) => (
                      <div
                        key={metric.label}
                        className="flex justify-between items-center"
                      >
                        <span className="text-gray-400">{metric.label}</span>
                        <span className="text-white font-semibold">
                          {metric.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-purple-400 mb-4 flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    AI Integration Stats
                  </h3>
                  <div className="space-y-4">
                    {[
                      { label: "PropOllama Queries", value: "847" },
                      { label: "Ultimate Brain Predictions", value: "1,234" },
                      { label: "AI Accuracy Boost", value: "+15.3%" },
                      { label: "Automated Bets", value: "156" },
                    ].map((metric) => (
                      <div
                        key={metric.label}
                        className="flex justify-between items-center"
                      >
                        <span className="text-gray-400">{metric.label}</span>
                        <span className="text-white font-semibold">
                          {metric.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "achievements" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-gray-900/60 backdrop-blur-xl border ${getRarityBorder(achievement.rarity)} rounded-xl p-6 hover:scale-105 transition-transform`}
                >
                  <div className="text-center mb-4">
                    <div
                      className={`text-4xl mb-3 bg-gradient-to-r ${getRarityColor(achievement.rarity)} bg-clip-text text-transparent`}
                    >
                      {achievement.icon}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">
                      {achievement.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3">
                      {achievement.description}
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <Medal
                        className={`w-4 h-4 ${achievement.rarity === "legendary" ? "text-yellow-400" : achievement.rarity === "rare" ? "text-purple-400" : "text-gray-400"}`}
                      />
                      <span
                        className={`text-xs uppercase font-semibold ${achievement.rarity === "legendary" ? "text-yellow-400" : achievement.rarity === "rare" ? "text-purple-400" : "text-gray-400"}`}
                      >
                        {achievement.rarity}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Unlocked:{" "}
                      {new Date(achievement.unlockedDate).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === "risk" && (
            <div className="space-y-6">
              <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-orange-400 mb-6 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Risk Management Profile
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-400 mb-2">
                      {riskProfile.type.toUpperCase()}
                    </div>
                    <div className="text-gray-400 text-sm">Risk Level</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400 mb-2">
                      ${riskProfile.maxStake.toLocaleString()}
                    </div>
                    <div className="text-gray-400 text-sm">Max Stake</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400 mb-2">
                      ${riskProfile.maxExposure.toLocaleString()}
                    </div>
                    <div className="text-gray-400 text-sm">Max Exposure</div>
                  </div>
                </div>
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => onNavigate("settings")}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Adjust Risk Settings
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default UserProfile;

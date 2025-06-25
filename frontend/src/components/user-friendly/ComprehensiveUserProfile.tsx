import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Settings,
  Shield,
  Bell,
  Key,
  Edit3,
  Save,
  X,
  Camera,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  Trophy,
  Target,
  Award,
  Activity,
  Eye,
  BarChart3,
  Clock,
  Zap,
  Brain,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  getUserSettings,
  saveUserSettings,
  getUserDisplayName,
  getUserEmail,
  type UserSettings,
} from "../../utils/userSettings";

interface ComprehensiveUserProfileProps {
  onNavigate: (page: string) => void;
}

export const ComprehensiveUserProfile: React.FC<
  ComprehensiveUserProfileProps
> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "settings" | "security" | "risk" | "achievements" | "activity"
  >("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [userSettings, setUserSettings] =
    useState<UserSettings>(getUserSettings());

  // Comprehensive user profile data
  const [profile] = useState({
    name: getUserDisplayName(),
    email: getUserEmail(),
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    joinDate: "January 2023",
    tier: "Ultimate Brain Pro",
    verified: true,
    twoFactorEnabled: true,
    bio: "Professional sports bettor leveraging AI and machine learning for data-driven betting strategies. Focused on maximizing ROI through systematic analysis.",
    stats: {
      totalProfit: 47350.75,
      winRate: 84.7,
      totalBets: 234,
      avgROI: 23.8,
      currentStreak: 7,
      bestStreak: 15,
      totalVolume: 125000,
    },
    riskProfile: {
      type: "moderate" as const,
      maxStake: 500,
      minStake: 25,
      confidenceThreshold: 0.75,
      maxExposure: 2500,
      stopLossPercentage: 0.15,
      takeProfitPercentage: 0.3,
    },
    achievements: [
      {
        id: 1,
        title: "High Roller",
        description: "Placed $50k+ in total bets",
        icon: "💰",
        unlockedAt: "2024-01-15",
      },
      {
        id: 2,
        title: "Accuracy Expert",
        description: "Maintain 80%+ win rate for 30 days",
        icon: "🎯",
        unlockedAt: "2024-02-20",
      },
      {
        id: 3,
        title: "Streak Master",
        description: "Achieve 15+ win streak",
        icon: "🔥",
        unlockedAt: "2024-03-10",
      },
      {
        id: 4,
        title: "Brain Power",
        description: "Complete 100 AI-assisted bets",
        icon: "🧠",
        progress: 87,
        target: 100,
      },
      {
        id: 5,
        title: "Profit King",
        description: "Earn $50k+ total profit",
        icon: "👑",
        progress: 47350,
        target: 50000,
      },
    ],
    recentActivity: [
      {
        id: 1,
        type: "bet_won" as const,
        title: "Lakers vs Warriors - Over 220.5",
        description: "AI prediction confidence: 89%",
        amount: 275,
        timestamp: "2 hours ago",
        confidence: 89,
      },
      {
        id: 2,
        type: "bet_pending" as const,
        title: "Chiefs ML vs Bills",
        description: "Ultimate Brain recommendation",
        amount: 150,
        timestamp: "1 day ago",
        confidence: 82,
      },
      {
        id: 3,
        type: "achievement" as const,
        title: "Earned 'Accuracy Expert' achievement",
        description: "Maintained 80%+ win rate for 30 days",
        timestamp: "2 days ago",
      },
      {
        id: 4,
        type: "bet_won" as const,
        title: "NBA Player Props - Parlay",
        description: "3-leg parlay hit perfectly",
        amount: 425,
        timestamp: "3 days ago",
        confidence: 76,
      },
    ],
  });

  const handleSettingChange = (
    category: keyof UserSettings,
    setting: string,
    value: any,
  ) => {
    const newSettings = {
      ...userSettings,
      [category]: {
        ...userSettings[category],
        [setting]: value,
      },
    };
    setUserSettings(newSettings);
    saveUserSettings(newSettings);
    toast.success("Settings updated!", { icon: "⚙️" });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getRiskProfileColor = (type: string) => {
    switch (type) {
      case "conservative":
        return "text-green-400 bg-green-500/20";
      case "moderate":
        return "text-yellow-400 bg-yellow-500/20";
      case "aggressive":
        return "text-red-400 bg-red-500/20";
      default:
        return "text-gray-400 bg-gray-500/20";
    }
  };

  const TabButton: React.FC<{
    id: string;
    label: string;
    icon: React.ReactNode;
    active: boolean;
    onClick: () => void;
  }> = ({ id, label, icon, active, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
        active
          ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-400"
          : "text-gray-400 hover:text-white hover:bg-gray-800/40"
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          👤 Ultimate User Profile
        </h2>
        <p className="text-gray-400 mt-2">
          Comprehensive profile management and performance analytics
        </p>
      </motion.div>

      {/* Profile Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-cyan-500/20 p-6"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center overflow-hidden">
              <User size={32} className="text-white" />
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 p-2 bg-cyan-600 rounded-full cursor-pointer hover:bg-cyan-700 transition-colors">
                <Camera size={16} className="text-white" />
                <input type="file" accept="image/*" className="hidden" />
              </label>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-2xl font-bold text-white">{profile.name}</h3>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  profile.verified
                    ? "bg-green-500/20 text-green-400"
                    : "bg-gray-500/20 text-gray-400"
                }`}
              >
                {profile.verified ? "✓ Verified" : "Unverified"}
              </span>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400">
                {profile.tier}
              </span>
            </div>

            <div className="flex items-center gap-2 text-gray-400 mb-4">
              <Calendar size={16} />
              <span>Member since {profile.joinDate}</span>
            </div>

            <p className="text-gray-300">{profile.bio}</p>
          </div>

          {/* Action Button */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors flex items-center gap-2"
          >
            <Edit3 size={16} />
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 bg-gray-800/40 backdrop-blur-sm rounded-xl p-2">
        <TabButton
          id="overview"
          label="Overview"
          icon={<User className="w-4 h-4" />}
          active={activeTab === "overview"}
          onClick={() => setActiveTab("overview")}
        />
        <TabButton
          id="settings"
          label="Settings"
          icon={<Settings className="w-4 h-4" />}
          active={activeTab === "settings"}
          onClick={() => setActiveTab("settings")}
        />
        <TabButton
          id="security"
          label="Security"
          icon={<Shield className="w-4 h-4" />}
          active={activeTab === "security"}
          onClick={() => setActiveTab("security")}
        />
        <TabButton
          id="risk"
          label="Risk Profile"
          icon={<Target className="w-4 h-4" />}
          active={activeTab === "risk"}
          onClick={() => setActiveTab("risk")}
        />
        <TabButton
          id="achievements"
          label="Achievements"
          icon={<Award className="w-4 h-4" />}
          active={activeTab === "achievements"}
          onClick={() => setActiveTab("achievements")}
        />
        <TabButton
          id="activity"
          label="Activity"
          icon={<Activity className="w-4 h-4" />}
          active={activeTab === "activity"}
          onClick={() => setActiveTab("activity")}
        />
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-green-500/20 p-6 text-center">
                <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-400">
                  {formatCurrency(profile.stats.totalProfit)}
                </div>
                <div className="text-sm text-gray-400">Total Profit</div>
              </div>

              <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-cyan-500/20 p-6 text-center">
                <Target className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-cyan-400">
                  {profile.stats.winRate}%
                </div>
                <div className="text-sm text-gray-400">Win Rate</div>
              </div>

              <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-purple-500/20 p-6 text-center">
                <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-400">
                  {profile.stats.totalBets}
                </div>
                <div className="text-sm text-gray-400">Total Bets</div>
              </div>

              <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-orange-500/20 p-6 text-center">
                <BarChart3 className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-400">
                  {profile.stats.avgROI}%
                </div>
                <div className="text-sm text-gray-400">Avg ROI</div>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-yellow-500/20 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <h3 className="font-semibold text-white">Current Streak</h3>
                </div>
                <div className="text-xl font-bold text-yellow-400">
                  {profile.stats.currentStreak} wins
                </div>
                <div className="text-sm text-gray-400">
                  Best: {profile.stats.bestStreak} wins
                </div>
              </div>

              <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-blue-500/20 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <DollarSign className="w-5 h-5 text-blue-400" />
                  <h3 className="font-semibold text-white">Total Volume</h3>
                </div>
                <div className="text-xl font-bold text-blue-400">
                  {formatCurrency(profile.stats.totalVolume)}
                </div>
                <div className="text-sm text-gray-400">
                  All-time betting volume
                </div>
              </div>

              <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-indigo-500/20 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Brain className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-semibold text-white">AI Assistance</h3>
                </div>
                <div className="text-xl font-bold text-indigo-400">87%</div>
                <div className="text-sm text-gray-400">
                  Of bets use AI predictions
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-cyan-500/20 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Mail className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-semibold text-white">
                  Contact Information
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={userSettings.profile.name}
                    onChange={(e) =>
                      handleSettingChange("profile", "name", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-800/60 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={userSettings.profile.email}
                    onChange={(e) =>
                      handleSettingChange("profile", "email", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-800/60 text-white"
                  />
                </div>
              </div>
            </div>

            {/* Display Preferences */}
            <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-purple-500/20 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">
                  Display Preferences
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-white">Dark Mode</div>
                    <div className="text-sm text-gray-400">
                      Enable dark theme
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={userSettings.display.darkMode}
                      onChange={(e) =>
                        handleSettingChange(
                          "display",
                          "darkMode",
                          e.target.checked,
                        )
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-cyan-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-yellow-500/20 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-semibold text-white">
                  Notifications
                </h3>
              </div>
              <div className="space-y-4">
                {[
                  {
                    key: "email",
                    label: "Email Notifications",
                    desc: "Receive updates via email",
                  },
                  {
                    key: "push",
                    label: "Push Notifications",
                    desc: "Real-time browser notifications",
                  },
                  {
                    key: "sound",
                    label: "Sound Alerts",
                    desc: "Audio notifications for events",
                  },
                ].map((setting) => (
                  <div
                    key={setting.key}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium text-white">
                        {setting.label}
                      </div>
                      <div className="text-sm text-gray-400">
                        {setting.desc}
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={
                          userSettings.notifications[
                            setting.key as keyof typeof userSettings.notifications
                          ]
                        }
                        onChange={(e) =>
                          handleSettingChange(
                            "notifications",
                            setting.key,
                            e.target.checked,
                          )
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-cyan-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div className="space-y-6">
            <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-green-500/20 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-semibold text-white">
                  Security Settings
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="flex items-center gap-3">
                    <Key className="w-5 h-5 text-green-400" />
                    <div>
                      <div className="font-medium text-green-300">
                        Two-Factor Authentication
                      </div>
                      <div className="text-sm text-green-400">
                        Extra security for your account
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      profile.twoFactorEnabled
                        ? "bg-green-500/20 text-green-400"
                        : "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {profile.twoFactorEnabled ? "Enabled" : "Disabled"}
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      label: "Change Password",
                      desc: "Update your account password",
                    },
                    {
                      label: "Login Sessions",
                      desc: "Manage your active sessions",
                    },
                    {
                      label: "Download Security Report",
                      desc: "View security activity",
                    },
                  ].map((action) => (
                    <button
                      key={action.label}
                      className="w-full px-4 py-3 text-left bg-gray-700/40 rounded-lg hover:bg-gray-700/60 transition-colors"
                    >
                      <div className="font-medium text-white">
                        {action.label}
                      </div>
                      <div className="text-sm text-gray-400">{action.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Risk Profile Tab */}
        {activeTab === "risk" && (
          <div className="space-y-6">
            <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-orange-500/20 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-orange-400" />
                <h3 className="text-lg font-semibold text-white">
                  Risk Management
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Risk Profile Type
                  </label>
                  <div
                    className={`px-3 py-2 rounded-md text-center font-medium ${getRiskProfileColor(profile.riskProfile.type)}`}
                  >
                    {profile.riskProfile.type.charAt(0).toUpperCase() +
                      profile.riskProfile.type.slice(1)}
                  </div>
                </div>

                <div className="text-center">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Maximum Stake
                  </label>
                  <div className="text-lg font-bold text-green-400">
                    {formatCurrency(profile.riskProfile.maxStake)}
                  </div>
                </div>

                <div className="text-center">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Minimum Stake
                  </label>
                  <div className="text-lg font-bold text-blue-400">
                    {formatCurrency(profile.riskProfile.minStake)}
                  </div>
                </div>

                <div className="text-center">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confidence Threshold
                  </label>
                  <div className="text-lg font-bold text-cyan-400">
                    {(profile.riskProfile.confidenceThreshold * 100).toFixed(0)}
                    %
                  </div>
                </div>

                <div className="text-center">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Maximum Exposure
                  </label>
                  <div className="text-lg font-bold text-purple-400">
                    {formatCurrency(profile.riskProfile.maxExposure)}
                  </div>
                </div>

                <div className="text-center">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Stop Loss
                  </label>
                  <div className="text-lg font-bold text-red-400">
                    {(profile.riskProfile.stopLossPercentage * 100).toFixed(0)}%
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => onNavigate("settings")}
                  className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Modify Risk Settings
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === "achievements" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profile.achievements.map((achievement) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-6 rounded-xl border-2 ${
                    achievement.unlockedAt
                      ? "bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30"
                      : "bg-gray-800/40 border-gray-600/30"
                  }`}
                >
                  <div className="text-3xl mb-3">{achievement.icon}</div>
                  <h4
                    className={`font-bold mb-2 ${achievement.unlockedAt ? "text-yellow-400" : "text-gray-400"}`}
                  >
                    {achievement.title}
                  </h4>
                  <p
                    className={`text-sm mb-3 ${achievement.unlockedAt ? "text-yellow-300" : "text-gray-500"}`}
                  >
                    {achievement.description}
                  </p>

                  {achievement.progress !== undefined && achievement.target && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-gray-400">
                          {achievement.progress}/{achievement.target}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full"
                          style={{
                            width: `${Math.min((achievement.progress / achievement.target) * 100, 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {achievement.unlockedAt && (
                    <div className="text-xs text-yellow-500">
                      Unlocked on {achievement.unlockedAt}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === "activity" && (
          <div className="space-y-6">
            <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-cyan-500/20 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-semibold text-white">
                  Recent Activity
                </h3>
              </div>

              <div className="space-y-4">
                {profile.recentActivity.map((activity) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-4 rounded-lg border ${
                      activity.type === "bet_won"
                        ? "bg-green-500/10 border-green-500/20"
                        : activity.type === "bet_pending"
                          ? "bg-blue-500/10 border-blue-500/20"
                          : activity.type === "achievement"
                            ? "bg-yellow-500/10 border-yellow-500/20"
                            : "bg-gray-700/40 border-gray-600/20"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-1">
                          {activity.title}
                        </h4>
                        <p className="text-sm text-gray-400 mb-2">
                          {activity.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{activity.timestamp}</span>
                          {activity.confidence && (
                            <>
                              <span>•</span>
                              <span>Confidence: {activity.confidence}%</span>
                            </>
                          )}
                        </div>
                      </div>

                      {activity.amount && (
                        <div
                          className={`text-lg font-bold ${
                            activity.type === "bet_won"
                              ? "text-green-400"
                              : "text-blue-400"
                          }`}
                        >
                          {activity.type === "bet_won" ? "+" : ""}
                          {formatCurrency(activity.amount)}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ComprehensiveUserProfile;

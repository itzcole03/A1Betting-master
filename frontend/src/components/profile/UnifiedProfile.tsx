import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Settings,
  TrendingUp,
  DollarSign,
  Award,
  Target,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";

export const UnifiedProfile: React.FC = () => {
  const [user] = useState({
    name: "Pro Bettor",
    email: "pro@a1betting.com",
    memberSince: "2023-01-15",
    tier: "Premium",
    avatar: null,
    stats: {
      totalProfit: 15420.75,
      winRate: 68.5,
      totalBets: 234,
      avgROI: 12.3,
    },
    achievements: [
      {
        id: 1,
        title: "High Roller",
        description: "Placed $10k+ in bets",
        icon: "💰",
      },
      {
        id: 2,
        title: "Accuracy Expert",
        description: "70%+ win rate for 30 days",
        icon: "🎯",
      },
      {
        id: 3,
        title: "Streak Master",
        description: "10+ win streak achieved",
        icon: "🔥",
      },
    ],
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          👤 User Profile
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Your betting performance and achievements
        </p>
      </motion.div>

      {/* Profile Card */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl">{user.name}</CardTitle>
              <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="success">{user.tier}</Badge>
                <span className="text-sm text-gray-500">
                  Member since {new Date(user.memberSince).toLocaleDateString()}
                </span>
              </div>
            </div>
            <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="text-center">
          <CardContent className="p-6">
            <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">
              ${user.stats.totalProfit.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">Total Profit</div>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <Target className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">
              {user.stats.winRate}%
            </div>
            <div className="text-sm text-gray-500">Win Rate</div>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">
              {user.stats.totalBets}
            </div>
            <div className="text-sm text-gray-500">Total Bets</div>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <Award className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-600">
              {user.stats.avgROI}%
            </div>
            <div className="text-sm text-gray-500">Avg ROI</div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>🏆 Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {user.achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700/30"
              >
                <div className="text-2xl mb-2">{achievement.icon}</div>
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">
                  {achievement.title}
                </h4>
                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                  {achievement.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>📈 Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div>
                <div className="font-medium">
                  Lakers vs Warriors - Over 220.5
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Won • 2 hours ago
                </div>
              </div>
              <div className="text-green-600 font-bold">+$150</div>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div>
                <div className="font-medium">Chiefs ML vs Bills</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Pending • 1 day ago
                </div>
              </div>
              <div className="text-blue-600 font-bold">$75</div>
            </div>

            <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div>
                <div className="font-medium">Patriots +7.5</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Lost • 3 days ago
                </div>
              </div>
              <div className="text-red-600 font-bold">-$100</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

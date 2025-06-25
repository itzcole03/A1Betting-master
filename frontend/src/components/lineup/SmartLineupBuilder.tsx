import React, { useState } from "react";
import { motion } from "framer-motion";
import { Users, Star, DollarSign, TrendingUp, Target, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";

interface Player {
  id: string;
  name: string;
  position: string;
  team: string;
  salary: number;
  projectedPoints: number;
  ownership: number;
  value: number;
  tier: "elite" | "core" | "value" | "punt";
}

export const SmartLineupBuilder: React.FC = () => {
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [remainingSalary, setRemainingSalary] = useState(50000);
  const [lineup] = useState({
    projectedTotal: 0,
    ownership: 0,
    ceiling: 0,
    floor: 0,
  });

  const [availablePlayers] = useState<Player[]>([
    {
      id: "1",
      name: "LeBron James",
      position: "SF",
      team: "LAL",
      salary: 11200,
      projectedPoints: 52.4,
      ownership: 25.3,
      value: 4.68,
      tier: "elite",
    },
    {
      id: "2",
      name: "Steph Curry",
      position: "PG",
      team: "GSW",
      salary: 10800,
      projectedPoints: 48.7,
      value: 4.51,
      ownership: 22.1,
      tier: "elite",
    },
    {
      id: "3",
      name: "Nikola Jokic",
      position: "C",
      team: "DEN",
      salary: 12000,
      projectedPoints: 55.2,
      ownership: 18.9,
      value: 4.6,
      tier: "elite",
    },
    {
      id: "4",
      name: "Tyler Herro",
      position: "SG",
      team: "MIA",
      salary: 7400,
      projectedPoints: 32.8,
      ownership: 12.5,
      value: 4.43,
      tier: "core",
    },
    {
      id: "5",
      name: "Draymond Green",
      position: "PF",
      team: "GSW",
      salary: 5200,
      projectedPoints: 28.1,
      ownership: 8.7,
      value: 5.4,
      tier: "value",
    },
  ]);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "elite":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "core":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "value":
        return "bg-green-100 text-green-800 border-green-200";
      case "punt":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const addPlayer = (player: Player) => {
    if (selectedPlayers.length < 8 && remainingSalary >= player.salary) {
      setSelectedPlayers([...selectedPlayers, player]);
      setRemainingSalary(remainingSalary - player.salary);
    }
  };

  const removePlayer = (playerId: string) => {
    const player = selectedPlayers.find((p) => p.id === playerId);
    if (player) {
      setSelectedPlayers(selectedPlayers.filter((p) => p.id !== playerId));
      setRemainingSalary(remainingSalary + player.salary);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          📋 Smart Lineup Builder
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          AI-powered daily fantasy lineup optimization with advanced analytics
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lineup Construction */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Lineup */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                Current Lineup ({selectedPlayers.length}/8)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedPlayers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No players selected. Start building your lineup!
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedPlayers.map((player) => (
                    <div
                      key={player.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">{player.position}</Badge>
                        <div>
                          <div className="font-medium">{player.name}</div>
                          <div className="text-sm text-gray-500">
                            {player.team}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-medium">
                            ${player.salary.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {player.projectedPoints} pts
                          </div>
                        </div>
                        <button
                          onClick={() => removePlayer(player.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Available Players */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Available Players
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {availablePlayers.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                    onClick={() => addPlayer(player)}
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{player.position}</Badge>
                      <div>
                        <div className="font-medium">{player.name}</div>
                        <div className="text-sm text-gray-500">
                          {player.team}
                        </div>
                      </div>
                      <Badge className={getTierColor(player.tier)}>
                        {player.tier}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-medium">
                          ${player.salary.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {player.projectedPoints} pts
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">
                          {player.value}x
                        </div>
                        <div className="text-sm text-gray-500">
                          {player.ownership}% own
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lineup Analysis */}
        <div className="space-y-6">
          {/* Salary Information */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                Salary Cap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Used</span>
                    <span className="text-sm font-medium">
                      ${(50000 - remainingSalary).toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${((50000 - remainingSalary) / 50000) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">
                    ${remainingSalary.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">Remaining</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lineup Projections */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                Projections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Projected Total</span>
                  <span className="font-bold">
                    {selectedPlayers
                      .reduce((sum, p) => sum + p.projectedPoints, 0)
                      .toFixed(1)}{" "}
                    pts
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Ownership</span>
                  <span className="font-bold">
                    {selectedPlayers.length > 0
                      ? (
                          selectedPlayers.reduce(
                            (sum, p) => sum + p.ownership,
                            0,
                          ) / selectedPlayers.length
                        ).toFixed(1)
                      : 0}
                    %
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lineup Value</span>
                  <span className="font-bold text-green-600">
                    {selectedPlayers.length > 0
                      ? (
                          selectedPlayers.reduce((sum, p) => sum + p.value, 0) /
                          selectedPlayers.length
                        ).toFixed(2)
                      : 0}
                    x
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Optimization Tools */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-500" />
                AI Tools
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <button className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all">
                Generate Optimal Lineup
              </button>
              <button className="w-full py-2 px-4 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
                Optimize Current
              </button>
              <button className="w-full py-2 px-4 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
                Generate Contrarian
              </button>
              <button className="w-full py-2 px-4 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-all">
                Export Lineup
              </button>
            </CardContent>
          </Card>

          {/* Lineup Rating */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-red-500" />
                Lineup Rating
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {selectedPlayers.length > 0 ? "87" : "--"}
                </div>
                <div className="text-sm text-gray-500 mb-4">Overall Score</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Value</span>
                    <span className="text-green-600">A+</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Ceiling</span>
                    <span className="text-blue-600">A-</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Ownership</span>
                    <span className="text-orange-600">B+</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

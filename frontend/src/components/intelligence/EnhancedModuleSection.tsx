// Enhanced Module Management Section - Replace the existing module management in AdvancedIntelligenceHub.tsx

<CardContent className="p-8">
  {/* Enhanced Module Performance Summary */}
  <div className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-6">
    <Card className="bg-gradient-to-br from-green-500/20 via-emerald-500/15 to-green-600/20 border-green-500/40 relative overflow-hidden backdrop-blur-xl rounded-2xl shadow-2xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-green-300 uppercase tracking-wider font-bold mb-2">
              Active Profit Engine
            </p>
            <p className="text-3xl font-bold text-green-400 tracking-tight">
              $
              {getActiveModuleConfigs()
                .reduce((sum, m) => sum + getModuleProfitScore(m.id) * 1000, 0)
                .toLocaleString()}
            </p>
            <p className="text-xs text-green-300/80 font-medium">
              Daily contribution
            </p>
          </div>
          <DollarSign className="w-10 h-10 text-green-400" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-transparent to-green-500/5 animate-pulse" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-emerald-500" />
      </CardContent>
    </Card>

    <Card className="bg-gradient-to-br from-blue-500/20 via-cyan-500/15 to-blue-600/20 border-blue-500/40 relative overflow-hidden backdrop-blur-xl rounded-2xl shadow-2xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-blue-300 uppercase tracking-wider font-bold mb-2">
              Prediction Power
            </p>
            <p className="text-3xl font-bold text-blue-400 tracking-tight">
              {(
                getActiveModuleConfigs().reduce(
                  (sum, m) => sum + getModuleAccuracyBoost(m.id),
                  0,
                ) || 85
              ).toFixed(1)}
              %
            </p>
            <p className="text-xs text-blue-300/80 font-medium">
              Combined boost
            </p>
          </div>
          <Target className="w-10 h-10 text-blue-400" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-blue-500/5 animate-pulse" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-cyan-500" />
      </CardContent>
    </Card>

    <Card className="bg-gradient-to-br from-purple-500/20 via-pink-500/15 to-purple-600/20 border-purple-500/40 relative overflow-hidden backdrop-blur-xl rounded-2xl shadow-2xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-purple-300 uppercase tracking-wider font-bold mb-2">
              Module Status
            </p>
            <p className="text-3xl font-bold text-purple-400 tracking-tight">
              {activeModules.size}/{moduleConfigs.length}
            </p>
            <p className="text-xs text-purple-300/80 font-medium">
              Optimal: 6-8 active
            </p>
          </div>
          <Brain className="w-10 h-10 text-purple-400" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-purple-500/5 animate-pulse" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 to-pink-500" />
      </CardContent>
    </Card>
  </div>

  {/* Enhanced Module Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {moduleConfigs
      .sort((a, b) => getModuleMoneyScore(b.id) - getModuleMoneyScore(a.id))
      .map((module, index) => {
        const isActive = activeModules.has(module.id);
        const moneyScore = getModuleMoneyScore(module.id);
        const accuracyBoost = getModuleAccuracyBoost(module.id);
        const profitScore = getModuleProfitScore(module.id);

        return (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{
              scale: 1.03,
              rotateY: 2,
              transition: { duration: 0.3, ease: "easeOut" },
            }}
            whileTap={{ scale: 0.98 }}
            className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-500 backdrop-blur-xl overflow-hidden ${
              isActive
                ? "bg-gradient-to-br from-green-500/20 via-emerald-500/15 to-blue-500/20 border-green-400/60 shadow-2xl shadow-green-500/25"
                : "bg-gradient-to-br from-slate-800/60 via-slate-700/40 to-slate-800/60 border-slate-600/40 hover:border-slate-500/60 hover:shadow-xl hover:shadow-black/20"
            }`}
            onClick={() => toggleModule(module.id)}
          >
            {/* Enhanced Money-Making Score Badge */}
            {moneyScore >= 80 && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.5, type: "spring", bounce: 0.5 }}
                className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-black text-xs font-bold px-3 py-1.5 rounded-xl shadow-2xl shadow-yellow-500/50 border-2 border-white/20"
              >
                <div className="flex items-center gap-1">💰 {moneyScore}%</div>
              </motion.div>
            )}

            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5" />
            </div>

            {/* Enhanced Header */}
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="flex items-center gap-3">
                <motion.div
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-br from-green-500/30 to-blue-500/30 shadow-lg shadow-green-500/25"
                      : "bg-slate-600/30 hover:bg-slate-500/40"
                  }`}
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  {module.icon}
                </motion.div>
                <div>
                  <h3 className="font-bold text-base text-slate-100 tracking-tight leading-tight">
                    {module.name}
                  </h3>
                  <p className="text-xs text-slate-400 capitalize font-medium tracking-wide">
                    {module.category}
                  </p>
                </div>
              </div>
              <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                {isActive ? (
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="w-2.5 h-2.5 bg-green-400 rounded-full"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                    <ToggleRight className="w-6 h-6 text-green-400 filter drop-shadow-lg" />
                  </div>
                ) : (
                  <ToggleLeft className="w-6 h-6 text-slate-400" />
                )}
              </motion.div>
            </div>

            {/* Enhanced Performance Metrics */}
            <div className="space-y-3 mb-4 relative z-10">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">
                    Money Impact
                  </span>
                  <span className="text-xs font-bold text-green-400">
                    {moneyScore}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden shadow-inner">
                  <motion.div
                    className={`h-full rounded-full relative overflow-hidden ${
                      moneyScore >= 90
                        ? "bg-gradient-to-r from-green-400 via-emerald-500 to-green-600"
                        : moneyScore >= 75
                          ? "bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-600"
                          : "bg-gradient-to-r from-blue-400 via-cyan-500 to-blue-600"
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(moneyScore, 100)}%` }}
                    transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                  </motion.div>
                </div>
              </div>

              {/* Enhanced Metrics Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-500/15 rounded-xl p-3 border border-blue-500/25 backdrop-blur-sm hover:bg-blue-500/20 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-blue-300 font-medium">
                      Accuracy
                    </span>
                    <span className="text-xs font-bold text-blue-400">
                      +{accuracyBoost}%
                    </span>
                  </div>
                </div>
                <div className="bg-green-500/15 rounded-xl p-3 border border-green-500/25 backdrop-blur-sm hover:bg-green-500/20 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-green-300 font-medium">
                      Daily
                    </span>
                    <span className="text-xs font-bold text-green-400">
                      ${(profitScore * 1000).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Footer */}
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={`text-xs font-semibold border-2 ${
                    module.priority === "critical"
                      ? "border-red-400/60 text-red-300 bg-red-500/20 shadow-red-500/25"
                      : module.priority === "high"
                        ? "border-orange-400/60 text-orange-300 bg-orange-500/20 shadow-orange-500/25"
                        : module.priority === "medium"
                          ? "border-yellow-400/60 text-yellow-300 bg-yellow-500/20 shadow-yellow-500/25"
                          : "border-green-400/60 text-green-300 bg-green-500/20 shadow-green-500/25"
                  } shadow-lg`}
                >
                  {module.priority}
                </Badge>
                {moneyScore >= 90 && (
                  <CheckCircle className="w-4 h-4 text-green-400 filter drop-shadow-lg" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 capitalize font-medium">
                  {module.computationLevel}
                </span>
                <div
                  className={`w-2 h-2 rounded-full shadow-lg ${
                    module.computationLevel === "light"
                      ? "bg-green-400 shadow-green-400/50"
                      : module.computationLevel === "medium"
                        ? "bg-yellow-400 shadow-yellow-400/50"
                        : module.computationLevel === "heavy"
                          ? "bg-orange-400 shadow-orange-400/50"
                          : "bg-red-400 shadow-red-400/50"
                  }`}
                />
              </div>
            </div>

            {/* Enhanced Active Glow Effect */}
            {isActive && (
              <motion.div
                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/10 to-blue-500/10 pointer-events-none"
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut",
                }}
              />
            )}
          </motion.div>
        );
      })}
  </div>

  {/* Enhanced Quick Actions */}
  <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-4">
    <Button
      onClick={() => {
        const profitModules = moduleConfigs
          .filter((m) => getModuleMoneyScore(m.id) >= 85)
          .map((m) => m.id);
        setActiveModules(new Set(profitModules));
        toast.success("🚀 Activated profit-optimized modules!");
      }}
      className="h-14 bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 hover:from-green-700 hover:via-emerald-700 hover:to-green-800 text-white font-bold shadow-2xl hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-105 border-0 rounded-xl"
    >
      <DollarSign className="w-5 h-5 mr-2" />
      Max Profit Setup
      <div className="ml-2 bg-white/20 px-2 py-1 rounded-full text-xs font-semibold">
        Top 6
      </div>
    </Button>
    <Button
      onClick={() => {
        const criticalModules = moduleConfigs
          .filter((m) => m.priority === "critical")
          .map((m) => m.id);
        setActiveModules(new Set(criticalModules));
        toast.success("⚡ Activated critical modules");
      }}
      className="h-14 bg-gradient-to-r from-red-600 via-orange-600 to-red-700 hover:from-red-700 hover:via-orange-700 hover:to-red-800 text-white font-bold shadow-2xl hover:shadow-red-500/50 transition-all duration-300 transform hover:scale-105 border-0 rounded-xl"
    >
      <Zap className="w-5 h-5 mr-2" />
      Critical Only
      <div className="ml-2 bg-white/20 px-2 py-1 rounded-full text-xs font-semibold">
        Essential
      </div>
    </Button>
    <Button
      onClick={() => {
        const allModules = moduleConfigs.map((m) => m.id);
        setActiveModules(new Set(allModules));
        toast.success("💪 Full power activated");
      }}
      className="h-14 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 hover:from-blue-700 hover:via-cyan-700 hover:to-blue-800 text-white font-bold shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 border-0 rounded-xl"
    >
      <Power className="w-5 h-5 mr-2" />
      Full Power
      <div className="ml-2 bg-white/20 px-2 py-1 rounded-full text-xs font-semibold">
        All
      </div>
    </Button>
    <Button
      onClick={() => {
        setActiveModules(new Set([]));
        toast.success("🔧 Reset to minimal");
      }}
      className="h-14 bg-gradient-to-r from-slate-600 via-gray-600 to-slate-700 hover:from-slate-700 hover:via-gray-700 hover:to-slate-800 text-white font-bold shadow-2xl hover:shadow-slate-500/50 transition-all duration-300 transform hover:scale-105 border-0 rounded-xl"
    >
      <Minimize className="w-5 h-5 mr-2" />
      Reset All
      <div className="ml-2 bg-white/20 px-2 py-1 rounded-full text-xs font-semibold">
        Clean
      </div>
    </Button>
  </div>
</CardContent>;

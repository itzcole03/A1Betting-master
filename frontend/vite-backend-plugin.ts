/**
 * Vite Plugin to embed backend routes directly in development server
 */

export function backendPlugin() {
  return {
    name: "backend-plugin",
    configureServer(server: any) {
      console.log("🚀 Configuring embedded backend for cloud preview...");

      // Mock data
      const mockData = {
        health: {
          status: "healthy",
          timestamp: new Date().toISOString(),
          version: "1.0.0-cloud",
          uptime: 3600,
          services: {
            prediction_engine: "operational",
            betting_service: "operational",
            risk_management: "operational",
            arbitrage_detection: "operational",
          },
        },
        bettingOpportunities: [
          {
            id: "opp_1",
            sport: "basketball",
            event: "Lakers vs Warriors",
            market: "Moneyline",
            odds: 1.85,
            probability: 0.65,
            expected_value: 0.08,
            kelly_fraction: 0.04,
            confidence: 0.78,
            risk_level: "medium",
            recommendation: "BUY",
            commence_time: new Date(Date.now() + 3600000).toISOString(),
            outcome: "Lakers ML",
            edge: 0.08,
            model_prob: 0.65,
          },
        ],
        analytics: {
          roi_analysis: { overall_roi: 12.8, monthly_roi: 8.5, win_rate: 0.67 },
          bankroll_metrics: {
            current_balance: 3250,
            total_wagered: 18500,
            profit_loss: 1150,
            max_drawdown: -85,
          },
          performance_trends: [
            { date: "2024-01-01", cumulative_profit: 0 },
            { date: "2024-01-15", cumulative_profit: 1150 },
          ],
          daily: { [new Date().toISOString().split("T")[0]]: 125 },
          yearly: { [new Date().getFullYear()]: 1150 },
        },
        modelPerformance: {
          overall_accuracy: 0.965,
          recent_accuracy: 0.972,
          model_metrics: {
            precision: 0.94,
            recall: 0.96,
            f1_score: 0.95,
            auc_roc: 0.98,
          },
          performance_by_sport: { basketball: { accuracy: 0.965, games: 150 } },
          models_active: 3,
          prediction_latency: 45,
        },
      };

      // Add routes as middleware
      server.middlewares.use("/health", (req: any, res: any, next: any) => {
        if (req.method === "GET") {
          console.log("[Backend Plugin] Health check requested");
          res.setHeader("Content-Type", "application/json");
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.end(JSON.stringify(mockData.health));
          return;
        }
        next();
      });

      server.middlewares.use(
        "/api/betting-opportunities",
        (req: any, res: any, next: any) => {
          if (req.method === "GET") {
            console.log("[Backend Plugin] Betting opportunities requested");
            res.setHeader("Content-Type", "application/json");
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.end(JSON.stringify(mockData.bettingOpportunities));
            return;
          }
          next();
        },
      );

      server.middlewares.use(
        "/api/analytics/advanced",
        (req: any, res: any, next: any) => {
          if (req.method === "GET") {
            console.log("[Backend Plugin] Analytics requested");
            res.setHeader("Content-Type", "application/json");
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.end(JSON.stringify(mockData.analytics));
            return;
          }
          next();
        },
      );

      server.middlewares.use(
        "/api/ultra-accuracy/model-performance",
        (req: any, res: any, next: any) => {
          if (req.method === "GET") {
            console.log("[Backend Plugin] Model performance requested");
            res.setHeader("Content-Type", "application/json");
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.end(JSON.stringify(mockData.modelPerformance));
            return;
          }
          next();
        },
      );

      console.log("✅ Backend API endpoints embedded in Vite server");
    },
  };
}

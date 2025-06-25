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
        activeBets: {
          active_bets: [
            {
              id: "bet_1",
              event: "Lakers vs Warriors",
              market: "Moneyline",
              selection: "Lakers",
              odds: 1.85,
              stake: 100.0,
              potential_return: 185.0,
              status: "active",
              placed_at: new Date(Date.now() - 3600000).toISOString(),
            },
          ],
          total_count: 1,
        },
        transactions: {
          transactions: [
            {
              id: "txn_1",
              type: "bet",
              amount: -100.0,
              description: "Lakers vs Warriors - Lakers ML",
              timestamp: new Date(Date.now() - 3600000).toISOString(),
              status: "completed",
            },
            {
              id: "txn_2",
              type: "win",
              amount: 185.0,
              description: "Lakers vs Warriors - Win",
              timestamp: new Date(Date.now() - 1800000).toISOString(),
              status: "completed",
            },
          ],
          total_count: 2,
        },
        healthAll: {
          timestamp: new Date().toISOString(),
          services: {
            sportsradar: { status: "healthy" },
            dailyfantasy: { status: "healthy" },
            theodds: { status: "healthy" },
          },
        },
      };

      // Add API middleware that handles all API routes
      server.middlewares.use((req: any, res: any, next: any) => {
        const url = req.url;

        // Handle /health endpoint
        if (url === "/health" && req.method === "GET") {
          console.log("[Backend Plugin] Health check requested");
          res.setHeader("Content-Type", "application/json");
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.end(JSON.stringify(mockData.health));
          return;
        }

        // Handle /api/analytics/advanced endpoint
        if (url === "/api/analytics/advanced" && req.method === "GET") {
          console.log("[Backend Plugin] Analytics requested");
          res.setHeader("Content-Type", "application/json");
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.end(JSON.stringify(mockData.analytics));
          return;
        }

        // Handle /api/active-bets endpoint
        if (url === "/api/active-bets" && req.method === "GET") {
          console.log("[Backend Plugin] Active bets requested");
          res.setHeader("Content-Type", "application/json");
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.end(JSON.stringify(mockData.activeBets));
          return;
        }

        // Handle /api/transactions endpoint
        if (url === "/api/transactions" && req.method === "GET") {
          console.log("[Backend Plugin] Transactions requested");
          res.setHeader("Content-Type", "application/json");
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.end(JSON.stringify(mockData.transactions));
          return;
        }

        // Handle /api/health/all endpoint
        if (url === "/api/health/all" && req.method === "GET") {
          console.log("[Backend Plugin] Health all requested");
          res.setHeader("Content-Type", "application/json");
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.end(JSON.stringify(mockData.healthAll));
          return;
        }

        // Handle /api/ultra-accuracy/model-performance endpoint
        if (
          url === "/api/ultra-accuracy/model-performance" &&
          req.method === "GET"
        ) {
          console.log("[Backend Plugin] Model performance requested");
          res.setHeader("Content-Type", "application/json");
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.end(JSON.stringify(mockData.modelPerformance));
          return;
        }

        // Continue to next middleware
        next();
      });

      console.log("✅ Backend API endpoints embedded in Vite server");
    },
  };
}

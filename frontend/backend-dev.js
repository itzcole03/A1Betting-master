/**
 * Development Backend Server
 * Provides a lightweight backend for development purposes
 */

import express from "express";
import cors from "cors";
import { WebSocketServer } from "ws";
import http from "http";

const app = express();
const PORT = 8000;

// Middleware
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json());

// Mock data
const mockBettingOpportunities = [
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
  },
  {
    id: "opp_2",
    sport: "football",
    event: "Chiefs vs Bills",
    market: "Over/Under 47.5",
    odds: 1.91,
    probability: 0.58,
    expected_value: 0.06,
    kelly_fraction: 0.03,
    confidence: 0.72,
    risk_level: "low",
    recommendation: "STRONG_BUY",
  },
];

const mockArbitrageOpportunities = [
  {
    id: "arb_1",
    sport: "basketball",
    event: "Celtics vs Heat",
    bookmaker_a: "DraftKings",
    bookmaker_b: "FanDuel",
    odds_a: 2.1,
    odds_b: 1.95,
    profit_margin: 0.025,
    required_stake: 1000,
  },
];

const mockTransactions = [
  {
    id: "txn_1",
    type: "bet",
    amount: -100.0,
    description: "Lakers vs Warriors - Lakers ML",
    timestamp: "2024-01-15T10:30:00Z",
    status: "completed",
  },
  {
    id: "txn_2",
    type: "win",
    amount: 180.0,
    description: "Lakers vs Warriors - Win",
    timestamp: "2024-01-15T22:45:00Z",
    status: "completed",
  },
];

const mockPredictions = [
  {
    id: "pred_1",
    sport: "basketball",
    event: "Lakers vs Warriors",
    prediction: "Lakers to win",
    confidence: 0.78,
    odds: 1.85,
    expected_value: 0.08,
    timestamp: new Date().toISOString(),
    model_version: "v2.1",
    features: {
      recent_form: 0.82,
      head_to_head: 0.65,
      injury_impact: 0.23,
      home_advantage: 0.15,
    },
  },
];

// Routes
app.get("/", (req, res) => {
  res.json({
    name: "A1Betting Development Backend",
    version: "1.0.0",
    status: "operational",
    timestamp: new Date().toISOString(),
    features: [
      "Betting Opportunities",
      "Arbitrage Detection",
      "Transaction Tracking",
      "ML Predictions",
      "Risk Management",
    ],
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    uptime: process.uptime(),
    services: {
      prediction_engine: "operational",
      betting_service: "operational",
      risk_management: "operational",
      arbitrage_detection: "operational",
    },
  });
});

// API Routes
app.get("/api/betting-opportunities", (req, res) => {
  const { sport, limit = 10 } = req.query;
  let opportunities = [...mockBettingOpportunities];

  if (sport) {
    opportunities = opportunities.filter((opp) => opp.sport === sport);
  }

  res.json(opportunities.slice(0, parseInt(limit)));
});

app.get("/api/arbitrage-opportunities", (req, res) => {
  const { limit = 5 } = req.query;
  res.json(mockArbitrageOpportunities.slice(0, parseInt(limit)));
});

// Value bets endpoint (v4 API)
app.get("/api/v4/betting/value-bets", (req, res) => {
  const { limit = 10 } = req.query;
  const valueBets = mockBettingOpportunities
    .filter((opp) => opp.expected_value > 0.05) // Only high value bets
    .map((opp) => ({
      id: opp.id,
      sport: opp.sport,
      event: opp.event,
      market: opp.market,
      odds: opp.odds,
      probability: opp.probability,
      expected_value: opp.expected_value,
      confidence: opp.confidence,
      recommendation: opp.recommendation,
      value_score: opp.expected_value * opp.confidence,
    }))
    .slice(0, parseInt(limit));

  res.json({
    value_bets: valueBets,
    total_count: valueBets.length,
  });
});

// Backward compatibility endpoint for value-bets
app.get("/api/value-bets", (req, res) => {
  const { limit = 10 } = req.query;
  const valueBets = mockBettingOpportunities
    .filter((opp) => opp.expected_value > 0.05) // Only high value bets
    .map((opp) => ({
      id: opp.id,
      sport: opp.sport,
      event: opp.event,
      market: opp.market,
      odds: opp.odds,
      probability: opp.probability,
      expected_value: opp.expected_value,
      confidence: opp.confidence,
      recommendation: opp.recommendation,
      value_score: opp.expected_value * opp.confidence,
    }))
    .slice(0, parseInt(limit));

  res.json(valueBets); // Return array directly for backward compatibility
});

app.get("/api/transactions", (req, res) => {
  res.json({
    transactions: mockTransactions,
    total_count: mockTransactions.length,
  });
});

app.get("/api/active-bets", (req, res) => {
  const activeBets = [
    {
      id: "bet_1",
      event: "Lakers vs Warriors",
      market: "Moneyline",
      selection: "Lakers",
      odds: 1.85,
      stake: 100.0,
      potential_return: 185.0,
      status: "active",
      placed_at: "2024-01-16T14:20:00Z",
    },
  ];

  res.json({
    active_bets: activeBets,
    total_count: activeBets.length,
  });
});

app.get("/api/risk-profiles", (req, res) => {
  const profiles = [
    {
      id: "conservative",
      name: "Conservative",
      description: "Low risk, steady returns",
      max_bet_percentage: 0.02,
      kelly_multiplier: 0.25,
      min_confidence: 0.8,
    },
    {
      id: "moderate",
      name: "Moderate",
      description: "Balanced risk and reward",
      max_bet_percentage: 0.05,
      kelly_multiplier: 0.5,
      min_confidence: 0.7,
    },
    {
      id: "aggressive",
      name: "Aggressive",
      description: "Higher risk, higher potential returns",
      max_bet_percentage: 0.1,
      kelly_multiplier: 1.0,
      min_confidence: 0.6,
    },
  ];

  res.json({ profiles });
});

app.get("/api/predictions", (req, res) => {
  const { sport, limit = 10 } = req.query;
  let predictions = [...mockPredictions];

  if (sport) {
    predictions = predictions.filter((pred) => pred.sport === sport);
  }

  res.json({
    predictions: predictions.slice(0, parseInt(limit)),
    total_count: predictions.length,
  });
});

// Ultra-accuracy endpoints
app.get("/api/ultra-accuracy/predictions", (req, res) => {
  res.json({
    predictions: mockPredictions.map((pred) => ({
      ...pred,
      accuracy_score: 0.92,
      shap_values: {
        recent_form: 0.35,
        matchup_history: 0.28,
        injury_report: -0.12,
        weather: 0.05,
      },
    })),
    model_performance: {
      accuracy: 0.92,
      precision: 0.89,
      recall: 0.94,
      f1_score: 0.91,
    },
  });
});

app.get("/api/ultra-accuracy/model-performance", (req, res) => {
  res.json({
    overall_accuracy: 0.92,
    recent_accuracy: 0.94,
    model_metrics: {
      precision: 0.89,
      recall: 0.94,
      f1_score: 0.91,
      auc_roc: 0.96,
    },
    performance_by_sport: {
      basketball: { accuracy: 0.94, games: 156 },
      football: { accuracy: 0.9, games: 98 },
      baseball: { accuracy: 0.91, games: 203 },
    },
  });
});

// Enhanced analytics endpoints
app.get("/api/analytics/advanced", (req, res) => {
  res.json({
    roi_analysis: {
      overall_roi: 12.5,
      monthly_roi: 8.3,
      win_rate: 0.64,
    },
    bankroll_metrics: {
      current_balance: 5420.5,
      total_wagered: 12800.0,
      profit_loss: 420.5,
      max_drawdown: -245.0,
    },
    performance_trends: [
      { date: "2024-01-01", cumulative_profit: 0 },
      { date: "2024-01-15", cumulative_profit: 420.5 },
    ],
  });
});

// Ollama LLM endpoints
app.get("/api/ollama/status", (req, res) => {
  res.json({
    connected: false,
    endpoint: "http://localhost:11434",
    available_models: [],
    message:
      "Ollama not detected. Install Ollama locally to enable AI chat features.",
    fallback_mode: true,
  });
});

// PropOllama Chat endpoint
app.post("/api/propollama/chat", (req, res) => {
  const { message, context, analysisType } = req.body;

  // Mock response for PropOllama AI
  const mockResponse = {
    content: `🤖 **PropOllama AI Analysis**

Your question: "${message}"

**Smart Betting Analysis:**
Based on current market data and advanced algorithms:

🎯 **Key Insights:**
- Line movement suggests value on the under
- Weather conditions favor defensive play
- Recent team performance indicates trend reversal
- Public betting heavily on the favorite (fade opportunity)

📊 **Statistical Edge:**
- Model prediction: 73% confidence
- Expected value: +4.2%
- Recommended bet size: 2.5% of bankroll
- Risk level: Moderate

⚡ **PropOllama Recommendation:**
LEAN UNDER with moderate confidence. Line shopping recommended.

*AI-powered analysis combining multiple data sources and betting models.*`,
    confidence: 87,
    suggestions: [
      "Check line movement trends",
      "Look for better odds elsewhere",
      "Consider live betting opportunities",
      "Monitor injury reports",
    ],
    model_used: "propollama_v2",
    response_time: 250,
    analysis_type: analysisType || "prop_analysis",
    timestamp: new Date().toISOString(),
  };

  // Simulate AI processing time
  setTimeout(
    () => {
      res.json(mockResponse);
    },
    800 + Math.random() * 1500,
  );
});

app.post("/api/ollama/chat", (req, res) => {
  const { message, context, analysisType } = req.body;

  // Mock response when Ollama is not available
  const mockResponse = {
    content: `🤖 **PropOllama Analysis** (Mock Mode)

Your question: "${message}"

**Quick Analysis:**
This is a development mock response. To get real AI-powered analysis:

1. **Install Ollama**: Download from https://ollama.ai
2. **Install a model**: Run \`ollama pull llama3.2\`
3. **Start Ollama**: Ensure it's running on localhost:11434

**General Betting Advice:**
- Always practice responsible gambling
- Never bet more than you can afford to lose
- Research thoroughly before placing bets
- Consider using bankroll management strategies

🎯 **Value Betting Tips:**
- Look for positive expected value (+EV) bets
- Compare odds across multiple sportsbooks
- Track your betting performance over time
- Focus on sports/markets you understand best

*This is a mock response. Real AI analysis requires Ollama installation.*`,
    confidence: 75,
    suggestions: [
      "Install Ollama locally",
      "Ask about bankroll management",
      "Learn about value betting",
      "Explain betting terminology",
    ],
    model_used: "development_mock",
    response_time: 150,
    analysis_type: analysisType || "general",
  };

  // Simulate AI thinking time
  setTimeout(
    () => {
      res.json(mockResponse);
    },
    1000 + Math.random() * 2000,
  );
});

app.get("/api/ollama/models", (req, res) => {
  res.json({
    models: [],
    message:
      "No Ollama models detected. Install Ollama and download models to enable AI features.",
    suggested_models: [
      "llama3.2:latest",
      "llama3.1:latest",
      "mistral:latest",
      "phi3:latest",
    ],
    installation_guide: {
      step1: "Download Ollama from https://ollama.ai",
      step2: "Install and start Ollama",
      step3: "Run: ollama pull llama3.2",
      step4: "Restart your development server",
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message,
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.method} ${req.path} not found`,
    timestamp: new Date().toISOString(),
  });
});

// Create HTTP server
const server = http.createServer(app);

// WebSocket server for real-time updates
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("WebSocket client connected");

  // Send initial data
  ws.send(
    JSON.stringify({
      type: "connection",
      data: { status: "connected", timestamp: new Date().toISOString() },
    }),
  );

  // Send periodic updates
  const interval = setInterval(() => {
    if (ws.readyState === ws.OPEN) {
      ws.send(
        JSON.stringify({
          type: "odds_update",
          data: {
            event: "Lakers vs Warriors",
            odds: 1.85 + (Math.random() - 0.5) * 0.1,
            timestamp: new Date().toISOString(),
          },
        }),
      );
    }
  }, 10000);

  ws.on("close", () => {
    console.log("WebSocket client disconnected");
    clearInterval(interval);
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
    clearInterval(interval);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Development Backend Server running on port ${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api/`);
  console.log(`🔌 WebSocket server available at ws://localhost:${PORT}`);
  console.log(`💾 Health check: http://localhost:${PORT}/health`);
});

export default app;

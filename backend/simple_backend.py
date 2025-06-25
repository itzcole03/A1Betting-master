#!/usr/bin/env python3
"""
Simple A1Betting Backend
A lightweight Python backend for testing and development
"""

import json
import logging
import time
from datetime import datetime
from typing import Any, Dict, List

try:
    import uvicorn
    from fastapi import FastAPI, HTTPException
    from fastapi.middleware.cors import CORSMiddleware
    from pydantic import BaseModel
except ImportError:
    print("❌ FastAPI not installed. Installing...")
    import subprocess
    import sys
    subprocess.check_call([sys.executable, "-m", "pip", "install", "fastapi", "uvicorn"])
    import uvicorn
    from fastapi import FastAPI, HTTPException
    from fastapi.middleware.cors import CORSMiddleware
    from pydantic import BaseModel

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="A1Betting Simple Backend",
    description="Lightweight Python backend for A1Betting frontend",
    version="1.0.0"
)

# Add CORS middleware for cloud frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*",  # Allow all for development
        "https://7fb6bf6978914ca48f089e6151180b03-a1b171efc67d4aea943f921a9.fly.dev",  # Cloud frontend
        "http://localhost:5173",  # Local development
        "http://192.168.1.125:5173",  # Local network access
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Track startup time
app_start_time = time.time()

# Mock data
mock_betting_opportunities = [
    {
        "id": "py_opp_1",
        "sport": "basketball",
        "event": "Lakers vs Warriors",
        "market": "Moneyline",
        "odds": 1.85,
        "probability": 0.65,
        "expected_value": 0.08,
        "kelly_fraction": 0.04,
        "confidence": 0.78,
        "risk_level": "medium",
        "recommendation": "BUY"
    },
    {
        "id": "py_opp_2",
        "sport": "football",
        "event": "Chiefs vs Bills",
        "market": "Over/Under 47.5",
        "odds": 1.91,
        "probability": 0.58,
        "expected_value": 0.06,
        "kelly_fraction": 0.03,
        "confidence": 0.72,
        "risk_level": "low",
        "recommendation": "STRONG_BUY"
    }
]

# Pydantic models
class HealthResponse(BaseModel):
    status: str
    timestamp: datetime
    version: str
    uptime: float
    services: Dict[str, str]

# Routes
@app.get("/")
async def root():
    return {
        "name": "A1Betting Simple Python Backend",
        "version": "1.0.0",
        "status": "operational",
        "timestamp": datetime.utcnow(),
        "message": "Simple Python backend is running successfully!"
    }

@app.get("/health", response_model=HealthResponse)
async def health_check():
    uptime = time.time() - app_start_time
    return HealthResponse(
        status="healthy",
        timestamp=datetime.utcnow(),
        version="1.0.0",
        uptime=uptime,
        services={
            "api": "operational",
            "predictions": "operational",
            "analytics": "operational"
        }
    )

@app.get("/api/betting-opportunities")
async def get_betting_opportunities():
    return mock_betting_opportunities

@app.get("/api/arbitrage-opportunities")
async def get_arbitrage_opportunities():
    return [
        {
            "id": "py_arb_1",
            "sport": "basketball",
            "event": "Celtics vs Heat",
            "bookmaker_a": "DraftKings",
            "bookmaker_b": "FanDuel",
            "odds_a": 2.1,
            "odds_b": 1.95,
            "profit_margin": 0.025,
            "required_stake": 1000
        }
    ]

@app.get("/api/predictions")
async def get_predictions():
    return {
        "predictions": [
            {
                "id": "py_pred_1",
                "sport": "basketball",
                "event": "Lakers vs Warriors",
                "prediction": "Lakers to win",
                "confidence": 0.78,
                "odds": 1.85,
                "expected_value": 0.08,
                "timestamp": datetime.utcnow().isoformat(),
                "model_version": "simple_v1.0"
            }
        ],
        "total_count": 1
    }

@app.get("/api/ultra-accuracy/model-performance")
async def get_model_performance():
    return {
        "overall_accuracy": 0.92,
        "recent_accuracy": 0.94,
        "model_metrics": {
            "precision": 0.89,
            "recall": 0.94,
            "f1_score": 0.91,
            "auc_roc": 0.96
        },
        "performance_by_sport": {
            "basketball": {"accuracy": 0.94, "games": 156},
            "football": {"accuracy": 0.90, "games": 98}
        }
    }

@app.get("/api/analytics/advanced")
async def get_advanced_analytics():
    return {
        "roi_analysis": {
            "overall_roi": 15.2,
            "monthly_roi": 9.1,
            "win_rate": 0.67
        },
        "bankroll_metrics": {
            "current_balance": 6850.75,
            "total_wagered": 15200.00,
            "profit_loss": 850.75,
            "max_drawdown": -180.00
        },
        "performance_trends": [
            {"date": "2024-01-01", "cumulative_profit": 0},
            {"date": "2024-01-15", "cumulative_profit": 850.75}
        ]
    }

@app.get("/api/transactions")
async def get_transactions():
    return {
        "transactions": [
            {
                "id": "py_txn_1",
                "type": "bet",
                "amount": -100.0,
                "description": "Lakers vs Warriors - Python Backend",
                "timestamp": datetime.utcnow().isoformat(),
                "status": "completed"
            }
        ],
        "total_count": 1
    }

if __name__ == "__main__":
    print("🐍 Starting A1Betting Simple Python Backend...")
    print("📊 Features: Basic API endpoints, CORS enabled, Mock data")
    print("🔗 Frontend integration ready")

    uvicorn.run(
        "simple_backend:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

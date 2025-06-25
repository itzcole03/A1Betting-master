"""A1Betting Backend API Integration
Complete implementation of all frontend-required endpoints according to the Backend Integration Guide.
"""

import asyncio
import json
import logging
import os
import uuid
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, List, Optional

from fastapi import (
    APIRouter,
    Depends,
    FastAPI,
    HTTPException,
    WebSocket,
    WebSocketDisconnect,
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel, Field

# Import existing services
try:
    from .betting_opportunity_service import (
        SportsExpertAgent,
        betting_opportunity_service,
    )
    from .sports_expert_api import api_error, api_response
except ImportError:
    # Fallback imports for standalone testing
    betting_opportunity_service = None
    SportsExpertAgent = None

    def api_response(data: Any, message: Optional[str] = None) -> Dict[str, Any]:
        return {
            "data": data,
            "status": "success",
            "message": message,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }

    def api_error(code: str, message: str, details: Any = None) -> Dict[str, Any]:
        return {
            "status": "error",
            "code": code,
            "message": message,
            "details": details,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }


# Configure logging
logger = logging.getLogger(__name__)

# Security
security = HTTPBearer()

# --- API Models ---


# Authentication Models
class LoginRequest(BaseModel):
    email: str
    password: str


class RegisterRequest(BaseModel):
    email: str
    password: str
    name: str


class RefreshTokenRequest(BaseModel):
    refreshToken: str


class UserProfile(BaseModel):
    id: str
    email: str
    name: str
    role: str = "user"
    preferences: Dict[str, Any] = Field(default_factory=dict)


class TokenResponse(BaseModel):
    token: str
    refreshToken: str


class AuthResponse(BaseModel):
    user: UserProfile
    token: str
    refreshToken: str


# PrizePicks Models
class PlayerProp(BaseModel):
    id: str
    player: str
    team: str
    opponent: str
    stat: str
    line: float
    overOdds: int
    underOdds: int
    confidence: int
    aiRecommendation: str  # "over" or "under"
    reasoning: str
    trend: str
    recentForm: str
    position: Optional[str] = None
    sport: Optional[str] = None
    gameTime: Optional[str] = None
    pickType: Optional[str] = "normal"  # "normal", "demon", "goblin"
    trendValue: Optional[float] = None


class ExpandedPlayerProp(BaseModel):
    id: str
    stat: str
    line: float
    overOdds: int
    underOdds: int
    confidence: int
    aiRecommendation: str
    reasoning: str
    pickType: Optional[str] = "normal"
    expectedValue: float
    volume: int
    oddsExplanation: str


class PlayerDetails(BaseModel):
    player: str
    team: str
    opponent: str
    position: str
    sport: str
    gameTime: str
    seasonStats: Dict[str, float]
    recentForm: List[str]
    props: List[ExpandedPlayerProp]


class SelectedPick(BaseModel):
    propId: str
    choice: str  # "over" or "under"
    player: str
    stat: str
    line: float
    confidence: int
    pickType: Optional[str] = "normal"


class LineupRequest(BaseModel):
    picks: List[SelectedPick]


class LineupResponse(BaseModel):
    id: str
    totalOdds: float
    potentialPayout: float
    confidence: int
    isValid: bool
    violations: Optional[List[str]] = None


# Prediction Models
class PredictionFactor(BaseModel):
    name: str
    weight: float
    value: float


class PredictionModel(BaseModel):
    id: str
    game: str
    prediction: float
    confidence: float
    timestamp: str
    potentialWin: float
    odds: float
    status: str


class LivePrediction(BaseModel):
    id: str
    playerId: str
    sport: str
    predictedValue: float
    confidence: int
    factors: List[PredictionFactor]
    timestamp: str


class AnalysisRequest(BaseModel):
    playerId: str
    statType: str
    line: float


class AnalysisResponse(BaseModel):
    recommendation: str  # "over" or "under"
    confidence: int
    reasoning: str
    expectedValue: float
    volume: int
    oddsExplanation: str


# User Management Models
class ProfileUpdateRequest(BaseModel):
    name: Optional[str] = None
    preferences: Optional[Dict[str, Any]] = None


class BankrollInfo(BaseModel):
    balance: float
    totalDeposits: float
    totalWithdrawals: float
    totalWins: float
    totalLosses: float
    roi: float


class TransactionRequest(BaseModel):
    amount: float
    type: str  # "deposit", "withdraw", "bet", "win", "loss"
    description: Optional[str] = None


class Transaction(BaseModel):
    id: str
    amount: float
    type: str
    description: Optional[str] = None
    timestamp: str


# Analytics Models
class PerformanceMetrics(BaseModel):
    totalBets: int
    winRate: float
    averageOdds: float
    totalProfit: float
    bestStreak: int
    currentStreak: int
    roi: float


class MarketTrend(BaseModel):
    sport: str
    statType: str
    trend: str  # "up", "down", "stable"
    confidence: float
    timeframe: str


# AI Chat Models
class ChatRequest(BaseModel):
    message: str
    context: Optional[Dict[str, str]] = None


class ChatResponse(BaseModel):
    response: str
    confidence: Optional[int] = None
    suggestions: Optional[List[str]] = None


# WebSocket Models
class WSMessage(BaseModel):
    type: str
    payload: Any
    timestamp: str
    userId: Optional[str] = None


# --- Authentication Utilities ---

# Dummy user database (replace with real database)
USERS_DB: Dict[str, Dict[str, Any]] = {
    "user@example.com": {
        "id": str(uuid.uuid4()),
        "email": "user@example.com",
        "name": "Demo User",
        "password_hash": "hashed_password123",
        "role": "user",
        "preferences": {
            "theme": "dark",
            "notifications": True,
            "defaultSport": "NBA",
            "riskLevel": "medium",
        },
        "bankroll": {
            "balance": 1000.0,
            "totalDeposits": 1000.0,
            "totalWithdrawals": 0.0,
            "totalWins": 0.0,
            "totalLosses": 0.0,
            "roi": 0.0,
        },
    }
}


def hash_password(password: str) -> str:
    """Hash password (stub implementation)."""
    return f"hashed_{password}"


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password (stub implementation)."""
    return hashed_password == f"hashed_{plain_password}"


JWT_SECRET = os.getenv("JWT_SECRET", "your-secret-key-here")


def create_access_token(data: Dict[str, Any]) -> str:
    """Create JWT access token (stub implementation)."""
    import base64

    token_data = {
        **data,
        "exp": (datetime.now(timezone.utc) + timedelta(hours=1)).timestamp(),
    }
    return base64.b64encode(json.dumps(token_data).encode()).decode()


def create_refresh_token(user_id: str) -> str:
    """Create refresh token (stub implementation)."""
    import base64

    token_data = {
        "user_id": user_id,
        "exp": (datetime.now(timezone.utc) + timedelta(days=7)).timestamp(),
    }
    return base64.b64encode(json.dumps(token_data).encode()).decode()


def verify_token(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> Dict[str, Any]:
    """Verify JWT token and return user data."""
    try:
        import base64

        token_data = json.loads(base64.b64decode(credentials.credentials).decode())

        if token_data.get("exp", 0) < datetime.now(timezone.utc).timestamp():
            raise HTTPException(status_code=401, detail="Token expired")

        return token_data
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")


def get_current_user(
    token_data: Dict[str, Any] = Depends(verify_token)
) -> Dict[str, Any]:
    """Get current user from token."""
    user_id = token_data.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")

    # In real implementation, fetch from database
    for user in USERS_DB.values():
        if user["id"] == user_id:
            return user

    raise HTTPException(status_code=404, detail="User not found")


# --- PrizePicks Utilities ---


def validate_lineup(picks: List[SelectedPick]) -> tuple[bool, List[str]]:
    """Validate lineup according to PrizePicks rules."""
    violations = []

    # Check pick count
    if len(picks) < 2:
        violations.append("Minimum 2 picks required")
    if len(picks) > 6:
        violations.append("Maximum 6 picks allowed")

    # Check for duplicate players
    players = [pick.player for pick in picks]
    if len(players) != len(set(players)):
        violations.append("Cannot select same player twice")

    # Check pick type limits
    demon_count = sum(1 for pick in picks if pick.pickType == "demon")
    goblin_count = sum(1 for pick in picks if pick.pickType == "goblin")

    if demon_count > 1:
        violations.append("Maximum 1 demon pick allowed")
    if goblin_count > 2:
        violations.append("Maximum 2 goblin picks allowed")

    # TODO: Check for different games requirement
    # This would need game data integration

    return len(violations) == 0, violations


def calculate_payout(picks: List[SelectedPick], bet_amount: float) -> float:
    """Calculate payout based on PrizePicks rules."""
    base_multiplier = {2: 3, 3: 5, 4: 10, 5: 20, 6: 40}.get(len(picks), 3)

    pick_type_multiplier = 1.0
    for pick in picks:
        if pick.pickType == "demon":
            pick_type_multiplier *= 1.25
        elif pick.pickType == "goblin":
            pick_type_multiplier *= 0.85

    return bet_amount * base_multiplier * pick_type_multiplier


# --- WebSocket Connection Manager ---


class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.user_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, user_id: Optional[str] = None):
        await websocket.accept()
        self.active_connections.append(websocket)
        if user_id:
            if user_id not in self.user_connections:
                self.user_connections[user_id] = []
            self.user_connections[user_id].append(websocket)

    def disconnect(self, websocket: WebSocket, user_id: Optional[str] = None):
        self.active_connections.remove(websocket)
        if user_id and user_id in self.user_connections:
            self.user_connections[user_id].remove(websocket)
            if not self.user_connections[user_id]:
                del self.user_connections[user_id]

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def send_to_user(self, message: str, user_id: str):
        if user_id in self.user_connections:
            for connection in self.user_connections[user_id]:
                await connection.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)


manager = ConnectionManager()

# --- Router Setup ---

# Create main API router
api_router = APIRouter(prefix="/api", tags=["A1Betting API"])

# --- Authentication Routes ---


@api_router.post("/auth/login", response_model=Dict[str, Any])
async def login(request: LoginRequest):
    """Authenticate user and return JWT tokens."""
    user = USERS_DB.get(request.email)
    if not user or not verify_password(request.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token({"user_id": user["id"], "email": user["email"]})
    refresh_token = create_refresh_token(user["id"])

    return api_response(
        {
            "user": {
                "id": user["id"],
                "email": user["email"],
                "name": user["name"],
                "role": user["role"],
            },
            "token": access_token,
            "refreshToken": refresh_token,
        }
    )


@api_router.post("/auth/register", response_model=Dict[str, Any])
async def register(request: RegisterRequest):
    """Register new user."""
    if request.email in USERS_DB:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_id = str(uuid.uuid4())
    user = {
        "id": user_id,
        "email": request.email,
        "name": request.name,
        "password_hash": hash_password(request.password),
        "role": "user",
        "preferences": {
            "theme": "dark",
            "notifications": True,
            "defaultSport": "NBA",
            "riskLevel": "medium",
        },
        "bankroll": {
            "balance": 0.0,
            "totalDeposits": 0.0,
            "totalWithdrawals": 0.0,
            "totalWins": 0.0,
            "totalLosses": 0.0,
            "roi": 0.0,
        },
    }

    USERS_DB[request.email] = user

    access_token = create_access_token({"user_id": user["id"], "email": user["email"]})
    refresh_token = create_refresh_token(user["id"])

    return api_response(
        {
            "user": {
                "id": user["id"],
                "email": user["email"],
                "name": user["name"],
                "role": user["role"],
            },
            "token": access_token,
            "refreshToken": refresh_token,
        }
    )


@api_router.post("/auth/refresh", response_model=Dict[str, Any])
async def refresh_token(request: RefreshTokenRequest):
    """Refresh access token."""
    try:
        import base64

        token_data = json.loads(base64.b64decode(request.refreshToken).decode())

        if token_data.get("exp", 0) < datetime.now(timezone.utc).timestamp():
            raise HTTPException(status_code=401, detail="Refresh token expired")

        user_id = token_data.get("user_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid refresh token")

        # Find user
        user = None
        for u in USERS_DB.values():
            if u["id"] == user_id:
                user = u
                break

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        access_token = create_access_token(
            {"user_id": user["id"], "email": user["email"]}
        )
        new_refresh_token = create_refresh_token(user["id"])

        return api_response({"token": access_token, "refreshToken": new_refresh_token})
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid refresh token")


@api_router.get("/auth/me", response_model=Dict[str, Any])
async def get_current_user_info(
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Get current user information."""
    return api_response(
        {
            "id": current_user["id"],
            "email": current_user["email"],
            "name": current_user["name"],
            "role": current_user["role"],
            "preferences": current_user.get("preferences", {}),
        }
    )


# --- PrizePicks Routes ---


@api_router.get("/props/featured", response_model=Dict[str, Any])
async def get_featured_props():
    """Get featured player props for the main grid."""
    # Generate sample props (replace with real data)
    sample_props = []
    players = [
        "LeBron James",
        "Stephen Curry",
        "Giannis Antetokounmpo",
        "Luka Doncic",
        "Jayson Tatum",
    ]
    stats = ["points", "rebounds", "assists", "three_pointers_made"]

    for i, player in enumerate(players):
        for j, stat in enumerate(stats):
            prop = PlayerProp(
                id=f"prop_{i}_{j}",
                player=player,
                team=(
                    "LAL"
                    if i == 0
                    else (
                        "GSW"
                        if i == 1
                        else "MIL" if i == 2 else "DAL" if i == 3 else "BOS"
                    )
                ),
                opponent=(
                    "BOS"
                    if i == 0
                    else (
                        "LAL"
                        if i == 1
                        else "PHX" if i == 2 else "DEN" if i == 3 else "MIA"
                    )
                ),
                stat=stat,
                line=25.5 + i + j,
                overOdds=-110,
                underOdds=-110,
                confidence=85 + i,
                aiRecommendation="over" if (i + j) % 2 == 0 else "under",
                reasoning=f"Strong performance in recent games for {stat}",
                trend="up" if (i + j) % 2 == 0 else "down",
                recentForm="3/5 over in last 5 games",
                position=(
                    "SF"
                    if i == 0
                    else (
                        "PG" if i == 1 else "PF" if i == 2 else "PG" if i == 3 else "SF"
                    )
                ),
                sport="NBA",
                gameTime="2024-01-20T19:00:00Z",
                pickType="normal" if i < 3 else "demon" if i == 3 else "goblin",
                trendValue=0.15 if (i + j) % 2 == 0 else -0.12,
            )
            sample_props.append(prop.dict())

    return api_response(sample_props)


@api_router.get("/props/player/{player_id}", response_model=Dict[str, Any])
async def get_player_props(player_id: str):
    """Get all available props for a specific player."""
    # Generate sample player details (replace with real data)
    player_details = PlayerDetails(
        player="LeBron James",
        team="LAL",
        opponent="BOS",
        position="SF",
        sport="NBA",
        gameTime="2024-01-20T19:00:00Z",
        seasonStats={
            "points": 25.2,
            "rebounds": 7.8,
            "assists": 8.1,
            "three_pointers_made": 2.3,
        },
        recentForm=["W", "L", "W", "W", "L"],
        props=[
            ExpandedPlayerProp(
                id=f"prop_{player_id}_points",
                stat="points",
                line=25.5,
                overOdds=-110,
                underOdds=-110,
                confidence=88,
                aiRecommendation="over",
                reasoning="Strong offensive performance in recent games",
                pickType="normal",
                expectedValue=26.2,
                volume=150,
                oddsExplanation="Slight favor towards over based on recent trends",
            ),
            ExpandedPlayerProp(
                id=f"prop_{player_id}_rebounds",
                stat="rebounds",
                line=7.5,
                overOdds=-105,
                underOdds=-115,
                confidence=82,
                aiRecommendation="under",
                reasoning="Opponent has strong rebounding defense",
                pickType="normal",
                expectedValue=7.1,
                volume=120,
                oddsExplanation="Market slightly favors under due to matchup",
            ),
        ],
    )

    return api_response(player_details.dict())


@api_router.post("/lineups", response_model=Dict[str, Any])
async def submit_lineup(
    request: LineupRequest, current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Submit a new lineup for validation and storage."""
    is_valid, violations = validate_lineup(request.picks)

    if not is_valid:
        return api_response(
            LineupResponse(
                id="",
                totalOdds=0.0,
                potentialPayout=0.0,
                confidence=0,
                isValid=False,
                violations=violations,
            ).dict()
        )

    # Calculate odds and payout
    total_odds = 1.0
    total_confidence = sum(pick.confidence for pick in request.picks) / len(
        request.picks
    )
    bet_amount = 50.0  # Default bet amount
    potential_payout = calculate_payout(request.picks, bet_amount)

    lineup_id = str(uuid.uuid4())

    return api_response(
        LineupResponse(
            id=lineup_id,
            totalOdds=total_odds,
            potentialPayout=potential_payout,
            confidence=int(total_confidence),
            isValid=True,
            violations=None,
        ).dict()
    )


# --- Prediction Routes ---


@api_router.get("/predictions/live", response_model=Dict[str, Any])
async def get_live_predictions():
    """Get current ML predictions."""
    sample_predictions = [
        LivePrediction(
            id=str(uuid.uuid4()),
            playerId="player_1",
            sport="NBA",
            predictedValue=26.8,
            confidence=89,
            factors=[
                PredictionFactor(name="Recent Performance", weight=0.3, value=0.85),
                PredictionFactor(name="Matchup Rating", weight=0.25, value=0.78),
                PredictionFactor(name="Home Court Advantage", weight=0.2, value=0.65),
                PredictionFactor(name="Rest Days", weight=0.15, value=0.92),
                PredictionFactor(name="Injury Report", weight=0.1, value=1.0),
            ],
            timestamp=datetime.now(timezone.utc).isoformat(),
        )
    ]

    return api_response([pred.dict() for pred in sample_predictions])


@api_router.post("/predictions/analyze", response_model=Dict[str, Any])
async def analyze_prediction(request: AnalysisRequest):
    """Request AI analysis for specific props."""
    # Use SportsExpertAgent if available
    if SportsExpertAgent and betting_opportunity_service:
        try:
            agent = getattr(betting_opportunity_service, "sports_expert_agent", None)
            if agent:
                analysis = await agent.analyze_prop_bet(
                    request.playerId, request.statType, request.line
                )
                return api_response(analysis)
        except Exception as e:
            logger.error(f"Agent analysis failed: {e}")

    # Fallback to mock analysis
    analysis = AnalysisResponse(
        recommendation="over" if hash(request.playerId) % 2 == 0 else "under",
        confidence=85,
        reasoning=f"Based on recent performance and matchup analysis for {request.statType}",
        expectedValue=request.line + 1.2,
        volume=150,
        oddsExplanation="Market appears to slightly undervalue this prop based on our model",
    )

    return api_response(analysis.dict())


# --- User Management Routes ---


@api_router.get("/users/profile", response_model=Dict[str, Any])
async def get_user_profile(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Get user profile and preferences."""
    return api_response(
        {
            "id": current_user["id"],
            "email": current_user["email"],
            "name": current_user["name"],
            "role": current_user["role"],
            "preferences": current_user.get("preferences", {}),
        }
    )


@api_router.put("/users/profile", response_model=Dict[str, Any])
async def update_user_profile(
    request: ProfileUpdateRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Update user profile."""
    if request.name:
        current_user["name"] = request.name
    if request.preferences:
        current_user["preferences"].update(request.preferences)

    return api_response(
        {
            "id": current_user["id"],
            "email": current_user["email"],
            "name": current_user["name"],
            "role": current_user["role"],
            "preferences": current_user["preferences"],
        }
    )


@api_router.get("/users/bankroll", response_model=Dict[str, Any])
async def get_bankroll(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Get user's bankroll information."""
    bankroll = current_user.get(
        "bankroll",
        {
            "balance": 0.0,
            "totalDeposits": 0.0,
            "totalWithdrawals": 0.0,
            "totalWins": 0.0,
            "totalLosses": 0.0,
            "roi": 0.0,
        },
    )

    return api_response(BankrollInfo(**bankroll).dict())


@api_router.post("/users/bankroll/transaction", response_model=Dict[str, Any])
async def create_transaction(
    request: TransactionRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Record a bankroll transaction."""
    if "bankroll" not in current_user:
        current_user["bankroll"] = {
            "balance": 0.0,
            "totalDeposits": 0.0,
            "totalWithdrawals": 0.0,
            "totalWins": 0.0,
            "totalLosses": 0.0,
            "roi": 0.0,
        }

    bankroll = current_user["bankroll"]

    # Update bankroll based on transaction type
    if request.type == "deposit":
        bankroll["balance"] += request.amount
        bankroll["totalDeposits"] += request.amount
    elif request.type == "withdraw":
        if bankroll["balance"] < request.amount:
            raise HTTPException(status_code=400, detail="Insufficient balance")
        bankroll["balance"] -= request.amount
        bankroll["totalWithdrawals"] += request.amount
    elif request.type == "win":
        bankroll["balance"] += request.amount
        bankroll["totalWins"] += request.amount
    elif request.type == "loss":
        bankroll["balance"] -= request.amount
        bankroll["totalLosses"] += request.amount
    elif request.type == "bet":
        if bankroll["balance"] < request.amount:
            raise HTTPException(status_code=400, detail="Insufficient balance")
        bankroll["balance"] -= request.amount

    # Calculate ROI
    if bankroll["totalDeposits"] > 0:
        bankroll["roi"] = (
            (bankroll["balance"] - bankroll["totalDeposits"])
            / bankroll["totalDeposits"]
        ) * 100

    transaction = Transaction(
        id=str(uuid.uuid4()),
        amount=request.amount,
        type=request.type,
        description=request.description,
        timestamp=datetime.now(timezone.utc).isoformat(),
    )

    return api_response(transaction.dict())


# --- Analytics Routes ---


@api_router.get("/analytics/performance", response_model=Dict[str, Any])
async def get_performance_metrics(
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Get user performance metrics."""
    # Mock data - replace with real analytics
    metrics = PerformanceMetrics(
        totalBets=25,
        winRate=68.0,
        averageOdds=2.15,
        totalProfit=245.50,
        bestStreak=7,
        currentStreak=3,
        roi=12.5,
    )

    return api_response(metrics.dict())


@api_router.get("/analytics/trends", response_model=Dict[str, Any])
async def get_market_trends():
    """Get market trends and insights."""
    trends = [
        MarketTrend(
            sport="NBA", statType="points", trend="up", confidence=0.78, timeframe="7d"
        ),
        MarketTrend(
            sport="NBA",
            statType="rebounds",
            trend="stable",
            confidence=0.65,
            timeframe="7d",
        ),
        MarketTrend(
            sport="NBA",
            statType="assists",
            trend="down",
            confidence=0.72,
            timeframe="7d",
        ),
    ]

    return api_response([trend.dict() for trend in trends])


# --- AI Chat Routes ---


@api_router.post("/ai/chat", response_model=Dict[str, Any])
async def ai_chat(
    request: ChatRequest, current_user: Dict[str, Any] = Depends(get_current_user)
):
    """AI chat with PropOllama assistant."""
    # Use SportsExpertAgent if available
    if SportsExpertAgent and betting_opportunity_service:
        try:
            agent = getattr(betting_opportunity_service, "sports_expert_agent", None)
            if agent:
                response = await agent.process_user_query(
                    request.message, current_user["id"]
                )
                return api_response(
                    {
                        "response": response.get(
                            "response", "I can help you with sports betting analysis!"
                        ),
                        "confidence": response.get("confidence", 85),
                        "suggestions": response.get("suggestions", []),
                    }
                )
        except Exception as e:
            logger.error(f"AI chat failed: {e}")

    # Fallback response
    return api_response(
        {
            "response": f"I understand you're asking about: {request.message}. I can help you analyze props, find value bets, and explain betting strategies!",
            "confidence": 75,
            "suggestions": [
                "Ask me about specific player props",
                "Request lineup analysis",
                "Get market trend insights",
            ],
        }
    )


# --- ML Performance Routes ---


@api_router.get("/ml/performance", response_model=Dict[str, Any])
async def get_ml_performance():
    """Get ML model performance metrics."""
    performance = {
        "accuracy": 0.847,
        "precision": 0.832,
        "recall": 0.865,
        "f1_score": 0.848,
        "auc_roc": 0.901,
        "backtesting_results": {
            "total_predictions": 1250,
            "correct_predictions": 1059,
            "roi": 14.2,
            "sharpe_ratio": 1.68,
        },
        "feature_importance": [
            {"feature": "recent_performance", "importance": 0.245},
            {"feature": "matchup_rating", "importance": 0.198},
            {"feature": "rest_days", "importance": 0.156},
            {"feature": "home_advantage", "importance": 0.134},
            {"feature": "injury_status", "importance": 0.112},
        ],
    }

    return api_response(performance)


# --- WebSocket Routes ---


@api_router.websocket("/ws/odds")
async def websocket_odds(websocket: WebSocket):
    """WebSocket endpoint for live odds updates."""
    await manager.connect(websocket)
    try:
        while True:
            # Send periodic odds updates
            odds_update = {
                "type": "ODDS_UPDATE",
                "payload": {
                    "propId": f"prop_{uuid.uuid4()}",
                    "overOdds": -110,
                    "underOdds": -110,
                    "confidence": 85,
                },
                "timestamp": datetime.now(timezone.utc).isoformat(),
            }
            await manager.send_personal_message(json.dumps(odds_update), websocket)
            await asyncio.sleep(30)  # Update every 30 seconds
    except WebSocketDisconnect:
        manager.disconnect(websocket)


@api_router.websocket("/ws/predictions")
async def websocket_predictions(websocket: WebSocket):
    """WebSocket endpoint for live prediction updates."""
    await manager.connect(websocket)
    try:
        while True:
            # Send periodic prediction updates
            prediction_update = {
                "type": "PREDICTION_UPDATE",
                "payload": {
                    "playerId": f"player_{uuid.uuid4()}",
                    "prediction": {
                        "stat": "points",
                        "value": 25.5,
                        "confidence": 92,
                        "recommendation": "over",
                    },
                },
                "timestamp": datetime.now(timezone.utc).isoformat(),
            }
            await manager.send_personal_message(
                json.dumps(prediction_update), websocket
            )
            await asyncio.sleep(60)  # Update every minute
    except WebSocketDisconnect:
        manager.disconnect(websocket)


@api_router.websocket("/ws/notifications")
async def websocket_notifications(websocket: WebSocket, user_id: str):
    """WebSocket endpoint for user notifications."""
    await manager.connect(websocket, user_id)
    try:
        while True:
            await asyncio.sleep(1)  # Keep connection alive
    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id)


# --- FastAPI App Creation ---


def create_integrated_app() -> FastAPI:
    """Create and configure the integrated FastAPI application."""
    app = FastAPI(
        title="A1Betting API",
        description="Complete backend integration for A1Betting frontend",
        version="1.0.0",
        docs_url="/api/docs",
        redoc_url="/api/redoc",
    )

    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:5173",  # Vite dev server
            "http://localhost:3000",  # Alternative dev port
            "http://localhost:8080",  # Another common port
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include API routes
    app.include_router(api_router)

    # Include existing sports expert routes if available
    try:
        from .sports_expert_api import router as sports_expert_router

        if sports_expert_router:
            app.include_router(sports_expert_router)
    except ImportError:
        logger.warning("Could not import sports expert router")

    # Health check endpoint
    @app.get("/health")
    async def health_check():
        return {
            "status": "healthy",
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }

    return app


# Export the app for use in main application
integrated_app = create_integrated_app()

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(integrated_app, host="0.0.0.0", port=8000)

# ============================================================================
# PREDICTIONS ENDPOINTS
# ============================================================================


@api_router.get("/predictions", response_model=Dict[str, Any])
async def get_predictions(limit: int = 10):
    """Get recent predictions."""
    sample_predictions = [
        PredictionModel(
            id=f"pred_{i}",
            game=f"Sample Game {i+1}",
            prediction=85.5 + (i * 2.1),
            confidence=80 + (i % 15),
            timestamp=datetime.now(timezone.utc).isoformat(),
            potentialWin=100 + (i * 50),
            odds=1.5 + (i * 0.2),
            status=["pending", "won", "lost"][i % 3],
        )
        for i in range(min(limit, 20))
    ]
    return api_response([pred.model_dump() for pred in sample_predictions])


@api_router.get("/betting/opportunities", response_model=Dict[str, Any])
async def get_betting_opportunities(limit: int = 5, sport: Optional[str] = None):
    """Get current betting opportunities."""
    opportunities = [
        {
            "id": f"opp_{i}",
            "game": f"{sport or 'NBA'} Game {i+1}",
            "type": ["Over/Under", "Spread", "Moneyline"][i % 3],
            "value": 2.1 + (i * 0.3),
            "confidence": 80 + (i % 15),
            "expectedReturn": 15 + (i * 5),
            "league": sport or "NBA",
            "startTime": (
                datetime.now(timezone.utc) + timedelta(hours=i + 1)
            ).isoformat(),
        }
        for i in range(min(limit, 10))
    ]
    return api_response(opportunities)


# ============================================================================
# ENGINE METRICS ENDPOINT
# ============================================================================


@api_router.get("/engine/metrics", response_model=Dict[str, Any])
async def get_engine_metrics():
    """Get ML engine performance metrics."""
    metrics = {
        "accuracy": 89.3,
        "totalPredictions": 156,
        "winRate": 85.6,
        "avgConfidence": 88.5,
        "profitability": 147.2,
        "status": "active",
    }
    return api_response(metrics)


# ============================================================================
# USER PROFILE ENDPOINTS (Including mock for testing)
# ============================================================================


@api_router.get("/users/profile/mock", response_model=Dict[str, Any])
async def get_mock_user_profile():
    """Get mock user profile for testing (no auth required)."""
    mock_user = {
        "id": "user_123",
        "name": "Alex Chen",
        "email": "alex@a1betting.com",
        "tier": "Pro",
        "avatar": "/avatars/alex.jpg",
        "winRate": 89.3,
        "totalProfit": 47230.50,
        "accuracy": 91.5,
        "balance": 127430.50,
        "role": "pro_user",
        "preferences": {
            "theme": "dark",
            "notifications": True,
            "defaultSport": "NBA",
            "riskLevel": "medium",
        },
        "stats": {
            "totalBets": 156,
            "winStreak": 8,
            "totalWins": 139,
            "totalLosses": 17,
            "averageOdds": 2.15,
            "bestStreak": 23,
            "currentStreak": 8,
            "roi": 47.2,
        },
    }
    return api_response(mock_user)


# Existing user endpoints continue below...

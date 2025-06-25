"""Advanced Risk Management and Portfolio Optimization Engine
Sophisticated bankroll management, Kelly criterion optimization, and risk assessment
"""

import logging
import math
from collections import deque
from dataclasses import dataclass
from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional, Tuple

import numpy as np
import scipy.optimize as opt

logger = logging.getLogger(__name__)


class RiskLevel(str, Enum):
    """Risk tolerance levels"""

    CONSERVATIVE = "conservative"
    MODERATE = "moderate"
    AGGRESSIVE = "aggressive"
    EXTREME = "extreme"


class BettingStrategy(str, Enum):
    """Betting strategies"""

    KELLY_CRITERION = "kelly_criterion"
    FIXED_FRACTIONAL = "fixed_fractional"
    MARTINGALE = "martingale"
    FIBONACCI = "fibonacci"
    VALUE_BETTING = "value_betting"
    ARBITRAGE = "arbitrage"
    PORTFOLIO_OPTIMIZATION = "portfolio_optimization"


@dataclass
class RiskMetrics:
    """Comprehensive risk assessment metrics"""

    value_at_risk_95: float  # 95% VaR
    value_at_risk_99: float  # 99% VaR
    expected_shortfall_95: float  # Conditional VaR (95%)
    max_drawdown: float  # Maximum historical drawdown
    sharpe_ratio: float  # Risk-adjusted return
    sortino_ratio: float  # Downside deviation adjusted return
    calmar_ratio: float  # Return / max drawdown
    kelly_fraction: float  # Optimal Kelly fraction
    bankruptcy_probability: float  # Probability of ruin
    time_to_ruin: Optional[float]  # Expected time to bankruptcy
    correlation_risk: float  # Portfolio correlation risk
    liquidity_risk: float  # Market liquidity risk
    model_risk: float  # Prediction model uncertainty
    confidence_interval: Tuple[float, float]  # Confidence bounds
    risk_score: float  # Overall risk score (0-100)
    last_updated: datetime


@dataclass
class PositionSize:
    """Optimal position sizing recommendation"""

    recommended_stake: float
    max_stake: float
    min_stake: float
    kelly_stake: float
    confidence: float
    risk_adjusted_stake: float
    reasoning: str
    constraints: Dict[str, Any]
    expected_value: float
    expected_return: float
    risk_metrics: RiskMetrics


@dataclass
class PortfolioOptimization:
    """Portfolio optimization results"""

    optimal_weights: Dict[str, float]
    expected_return: float
    portfolio_variance: float
    sharpe_ratio: float
    diversification_ratio: float
    risk_contribution: Dict[str, float]
    marginal_risk: Dict[str, float]
    optimization_method: str
    constraints_satisfied: bool
    objective_value: float
    metadata: Dict[str, Any]


class KellyCriterionEngine:
    """Advanced Kelly Criterion implementation with risk controls"""

    def __init__(self):
        self.risk_controls = {
            "max_kelly_fraction": 0.25,  # Never bet more than 25% of bankroll
            "min_win_probability": 0.52,  # Minimum 52% win rate required
            "min_expected_value": 0.02,  # Minimum 2% edge required
            "volatility_adjustment": True,  # Adjust for volatility
            "correlation_adjustment": True,  # Adjust for correlation
            "drawdown_protection": True,  # Reduce sizing during drawdowns
        }

    def calculate_kelly_fraction(
        self,
        win_probability: float,
        odds: float,
        volatility: Optional[float] = None,
        correlation: Optional[float] = None,
        current_drawdown: Optional[float] = None,
    ) -> Dict[str, Any]:
        """Calculate optimal Kelly fraction with advanced adjustments"""
        try:
            # Basic Kelly formula: f = (bp - q) / b
            # where b = odds - 1, p = win probability, q = 1 - p

            if win_probability <= 0.5 or odds <= 1.0:
                return {
                    "kelly_fraction": 0.0,
                    "adjusted_fraction": 0.0,
                    "reasoning": "No positive expected value",
                    "risk_level": "NONE",
                }

            b = odds - 1  # Net odds
            p = win_probability
            q = 1 - p

            # Basic Kelly fraction
            basic_kelly = (b * p - q) / b

            if basic_kelly <= 0:
                return {
                    "kelly_fraction": 0.0,
                    "adjusted_fraction": 0.0,
                    "reasoning": "Negative Kelly fraction",
                    "risk_level": "NONE",
                }

            # Apply risk controls and adjustments
            adjusted_kelly = basic_kelly
            adjustments = []

            # 1. Maximum Kelly fraction cap
            if adjusted_kelly > self.risk_controls["max_kelly_fraction"]:
                adjusted_kelly = self.risk_controls["max_kelly_fraction"]
                adjustments.append("capped_at_max")

            # 2. Volatility adjustment
            if volatility and self.risk_controls["volatility_adjustment"]:
                vol_adjustment = 1 / (1 + volatility)
                adjusted_kelly *= vol_adjustment
                adjustments.append(f"volatility_adjusted_{vol_adjustment:.3f}")

            # 3. Correlation adjustment (reduce sizing for correlated bets)
            if correlation and self.risk_controls["correlation_adjustment"]:
                corr_adjustment = 1 - min(abs(correlation), 0.5)
                adjusted_kelly *= corr_adjustment
                adjustments.append(f"correlation_adjusted_{corr_adjustment:.3f}")

            # 4. Drawdown protection
            if current_drawdown and self.risk_controls["drawdown_protection"]:
                if current_drawdown > 0.1:  # More than 10% drawdown
                    dd_adjustment = max(0.5, 1 - current_drawdown)
                    adjusted_kelly *= dd_adjustment
                    adjustments.append(f"drawdown_protection_{dd_adjustment:.3f}")

            # Risk level classification
            risk_level = self._classify_risk_level(adjusted_kelly)

            return {
                "kelly_fraction": basic_kelly,
                "adjusted_fraction": max(0.0, adjusted_kelly),
                "win_probability": p,
                "odds": odds,
                "expected_value": (p * odds) - 1,
                "adjustments": adjustments,
                "risk_level": risk_level,
                "reasoning": f"Kelly: {basic_kelly:.3f}, Adjusted: {adjusted_kelly:.3f}",
            }

        except Exception as e:
            logger.error(f"Kelly calculation failed: {e!s}")
            return {
                "kelly_fraction": 0.0,
                "adjusted_fraction": 0.0,
                "reasoning": f"Calculation error: {e!s}",
                "risk_level": "ERROR",
            }

    def _classify_risk_level(self, kelly_fraction: float) -> str:
        """Classify risk level based on Kelly fraction"""
        if kelly_fraction == 0:
            return "NONE"
        elif kelly_fraction < 0.05:
            return "LOW"
        elif kelly_fraction < 0.15:
            return "MODERATE"
        elif kelly_fraction < 0.25:
            return "HIGH"
        else:
            return "EXTREME"


class RiskAssessmentEngine:
    """Comprehensive risk assessment and monitoring"""

    def __init__(self):
        self.historical_returns = deque(maxlen=1000)
        self.portfolio_history = deque(maxlen=500)
        self.risk_models = self._initialize_risk_models()

    def _initialize_risk_models(self) -> Dict[str, Any]:
        """Initialize risk models and parameters"""
        return {
            "var_confidence_levels": [0.95, 0.99],
            "lookback_periods": [30, 90, 252],  # Days
            "monte_carlo_simulations": 10000,
            "stress_test_scenarios": self._define_stress_scenarios(),
        }

    def _define_stress_scenarios(self) -> List[Dict[str, Any]]:
        """Define stress test scenarios"""
        return [
            {
                "name": "market_crash",
                "description": "Severe market downturn",
                "market_shock": -0.3,
                "volatility_multiplier": 2.0,
                "correlation_increase": 0.5,
            },
            {
                "name": "high_volatility",
                "description": "Sustained high volatility period",
                "market_shock": 0.0,
                "volatility_multiplier": 3.0,
                "correlation_increase": 0.3,
            },
            {
                "name": "liquidity_crisis",
                "description": "Market liquidity dry-up",
                "market_shock": -0.15,
                "volatility_multiplier": 1.5,
                "liquidity_impact": 0.8,
            },
        ]

    async def assess_portfolio_risk(
        self,
        positions: List[Dict[str, Any]],
        bankroll: float,
        historical_returns: List[float],
    ) -> RiskMetrics:
        """Comprehensive portfolio risk assessment"""
        try:
            if not positions or bankroll <= 0:
                return self._create_empty_risk_metrics()

            # Convert to numpy arrays for calculations
            returns_array = (
                np.array(historical_returns) if historical_returns else np.array([])
            )

            # Calculate basic risk metrics
            var_95 = (
                self._calculate_var(returns_array, 0.95)
                if len(returns_array) > 0
                else 0.0
            )
            var_99 = (
                self._calculate_var(returns_array, 0.99)
                if len(returns_array) > 0
                else 0.0
            )
            es_95 = (
                self._calculate_expected_shortfall(returns_array, 0.95)
                if len(returns_array) > 0
                else 0.0
            )

            # Calculate drawdown metrics
            max_drawdown = (
                self._calculate_max_drawdown(returns_array)
                if len(returns_array) > 0
                else 0.0
            )

            # Calculate risk-adjusted ratios
            sharpe_ratio = (
                self._calculate_sharpe_ratio(returns_array)
                if len(returns_array) > 0
                else 0.0
            )
            sortino_ratio = (
                self._calculate_sortino_ratio(returns_array)
                if len(returns_array) > 0
                else 0.0
            )
            calmar_ratio = (
                self._calculate_calmar_ratio(returns_array, max_drawdown)
                if len(returns_array) > 0
                else 0.0
            )

            # Calculate portfolio-specific risks
            correlation_risk = await self._calculate_correlation_risk(positions)
            liquidity_risk = await self._calculate_liquidity_risk(positions)
            model_risk = await self._calculate_model_risk(positions)

            # Kelly criterion analysis
            kelly_fraction = await self._calculate_portfolio_kelly(positions)

            # Bankruptcy analysis
            bankruptcy_prob = self._calculate_bankruptcy_probability(
                returns_array, bankroll
            )
            time_to_ruin = self._calculate_time_to_ruin(returns_array, bankroll)

            # Confidence intervals
            confidence_interval = self._calculate_confidence_interval(returns_array)

            # Overall risk score
            risk_score = self._calculate_overall_risk_score(
                var_95,
                max_drawdown,
                sharpe_ratio,
                correlation_risk,
                liquidity_risk,
                model_risk,
                bankruptcy_prob,
            )

            return RiskMetrics(
                value_at_risk_95=var_95,
                value_at_risk_99=var_99,
                expected_shortfall_95=es_95,
                max_drawdown=max_drawdown,
                sharpe_ratio=sharpe_ratio,
                sortino_ratio=sortino_ratio,
                calmar_ratio=calmar_ratio,
                kelly_fraction=kelly_fraction,
                bankruptcy_probability=bankruptcy_prob,
                time_to_ruin=time_to_ruin,
                correlation_risk=correlation_risk,
                liquidity_risk=liquidity_risk,
                model_risk=model_risk,
                confidence_interval=confidence_interval,
                risk_score=risk_score,
                last_updated=datetime.utcnow(),
            )

        except Exception as e:
            logger.error(f"Risk assessment failed: {e!s}")
            return self._create_empty_risk_metrics()

    def _calculate_var(self, returns: np.ndarray, confidence_level: float) -> float:
        """Calculate Value at Risk"""
        if len(returns) == 0:
            return 0.0
        return float(np.percentile(returns, (1 - confidence_level) * 100))

    def _calculate_expected_shortfall(
        self, returns: np.ndarray, confidence_level: float
    ) -> float:
        """Calculate Expected Shortfall (Conditional VaR)"""
        if len(returns) == 0:
            return 0.0
        var = self._calculate_var(returns, confidence_level)
        tail_losses = returns[returns <= var]
        return float(np.mean(tail_losses)) if len(tail_losses) > 0 else var

    def _calculate_max_drawdown(self, returns: np.ndarray) -> float:
        """Calculate maximum drawdown"""
        if len(returns) == 0:
            return 0.0

        cumulative = np.cumprod(1 + returns)
        running_max = np.maximum.accumulate(cumulative)
        drawdown = (cumulative - running_max) / running_max
        return float(np.min(drawdown))

    def _calculate_sharpe_ratio(
        self, returns: np.ndarray, risk_free_rate: float = 0.02
    ) -> float:
        """Calculate Sharpe ratio"""
        if len(returns) == 0 or np.std(returns) == 0:
            return 0.0

        excess_returns = np.mean(returns) - risk_free_rate / 252  # Daily risk-free rate
        return float(excess_returns / np.std(returns) * np.sqrt(252))  # Annualized

    def _calculate_sortino_ratio(
        self, returns: np.ndarray, risk_free_rate: float = 0.02
    ) -> float:
        """Calculate Sortino ratio (downside deviation)"""
        if len(returns) == 0:
            return 0.0

        excess_returns = np.mean(returns) - risk_free_rate / 252
        downside_returns = returns[returns < 0]

        if len(downside_returns) == 0:
            return float("inf")

        downside_deviation = np.std(downside_returns)
        return (
            float(excess_returns / downside_deviation * np.sqrt(252))
            if downside_deviation > 0
            else 0.0
        )

    def _calculate_calmar_ratio(
        self, returns: np.ndarray, max_drawdown: float
    ) -> float:
        """Calculate Calmar ratio"""
        if len(returns) == 0 or max_drawdown == 0:
            return 0.0

        annual_return = np.mean(returns) * 252
        return float(annual_return / abs(max_drawdown))

    async def _calculate_correlation_risk(
        self, positions: List[Dict[str, Any]]
    ) -> float:
        """Calculate portfolio correlation risk"""
        if len(positions) < 2:
            return 0.0

        # Simplified correlation risk calculation
        # In practice, this would analyze correlations between position outcomes
        return 0.3  # Placeholder

    async def _calculate_liquidity_risk(self, positions: List[Dict[str, Any]]) -> float:
        """Calculate portfolio liquidity risk"""
        # Simplified liquidity risk calculation
        total_risk = 0.0
        for position in positions:
            market_type = position.get("market_type", "standard")
            if market_type in ["player_props", "exotic"]:
                total_risk += 0.2
            elif market_type in ["live_betting"]:
                total_risk += 0.1

        return min(total_risk / len(positions), 1.0) if positions else 0.0

    async def _calculate_model_risk(self, positions: List[Dict[str, Any]]) -> float:
        """Calculate model prediction uncertainty risk"""
        if not positions:
            return 0.0

        uncertainty_sum = 0.0
        for position in positions:
            confidence = position.get("prediction_confidence", 0.5)
            uncertainty_sum += 1 - confidence

        return uncertainty_sum / len(positions)

    async def _calculate_portfolio_kelly(
        self, positions: List[Dict[str, Any]]
    ) -> float:
        """Calculate aggregate Kelly fraction for portfolio"""
        if not positions:
            return 0.0

        total_kelly = 0.0
        for position in positions:
            kelly = position.get("kelly_fraction", 0.0)
            weight = position.get("weight", 1.0)
            total_kelly += kelly * weight

        return min(total_kelly, 0.25)  # Cap at 25%

    def _calculate_bankruptcy_probability(
        self, returns: np.ndarray, bankroll: float
    ) -> float:
        """Calculate probability of bankruptcy using Monte Carlo"""
        if len(returns) == 0 or bankroll <= 0:
            return 1.0

        # Simplified bankruptcy probability calculation
        mean_return = np.mean(returns) if len(returns) > 0 else -0.01
        volatility = np.std(returns) if len(returns) > 0 else 0.1

        # Use geometric Brownian motion to estimate bankruptcy probability
        # P(ruin) ≈ exp(-2μ * initial_capital / σ²)
        if volatility == 0:
            return 0.0 if mean_return >= 0 else 1.0

        drift_adjusted = 2 * mean_return / (volatility**2)
        bankruptcy_prob = (
            math.exp(-drift_adjusted * bankroll) if drift_adjusted > 0 else 1.0
        )

        return min(max(bankruptcy_prob, 0.0), 1.0)

    def _calculate_time_to_ruin(
        self, returns: np.ndarray, bankroll: float
    ) -> Optional[float]:
        """Estimate expected time to ruin in days"""
        if len(returns) == 0:
            return None

        mean_return = np.mean(returns)
        if mean_return >= 0:
            return None  # Positive expectancy, theoretically infinite time to ruin

        volatility = np.std(returns)
        if volatility == 0:
            return abs(bankroll / mean_return)  # Deterministic case

        # Approximation for expected time to ruin
        # E[T] ≈ -bankroll / mean_return for small volatility
        return float(abs(bankroll / mean_return)) if mean_return < 0 else None

    def _calculate_confidence_interval(
        self, returns: np.ndarray, confidence: float = 0.95
    ) -> Tuple[float, float]:
        """Calculate confidence interval for returns"""
        if len(returns) == 0:
            return (0.0, 0.0)

        alpha = 1 - confidence
        lower = np.percentile(returns, alpha / 2 * 100)
        upper = np.percentile(returns, (1 - alpha / 2) * 100)

        return (float(lower), float(upper))

    def _calculate_overall_risk_score(
        self,
        var_95: float,
        max_drawdown: float,
        sharpe_ratio: float,
        correlation_risk: float,
        liquidity_risk: float,
        model_risk: float,
        bankruptcy_prob: float,
    ) -> float:
        """Calculate overall risk score (0-100)"""
        try:
            # Normalize individual risk components to 0-1 scale
            var_score = min(abs(var_95) * 10, 1.0)  # VaR component
            drawdown_score = min(abs(max_drawdown) * 5, 1.0)  # Drawdown component
            sharpe_score = max(
                0, 1 - sharpe_ratio / 2.0
            )  # Inverse Sharpe (lower is better)
            bankruptcy_score = bankruptcy_prob  # Already 0-1

            # Weighted average of risk components
            risk_score = (
                var_score * 0.25
                + drawdown_score * 0.25
                + sharpe_score * 0.15
                + correlation_risk * 0.10
                + liquidity_risk * 0.10
                + model_risk * 0.10
                + bankruptcy_score * 0.05
            )

            return float(risk_score * 100)  # Scale to 0-100

        except Exception as e:
            logger.warning(f"Risk score calculation failed: {e!s}")
            return 50.0  # Default moderate risk

    def _create_empty_risk_metrics(self) -> RiskMetrics:
        """Create empty risk metrics for error cases"""
        return RiskMetrics(
            value_at_risk_95=0.0,
            value_at_risk_99=0.0,
            expected_shortfall_95=0.0,
            max_drawdown=0.0,
            sharpe_ratio=0.0,
            sortino_ratio=0.0,
            calmar_ratio=0.0,
            kelly_fraction=0.0,
            bankruptcy_probability=1.0,
            time_to_ruin=None,
            correlation_risk=0.0,
            liquidity_risk=0.0,
            model_risk=0.0,
            confidence_interval=(0.0, 0.0),
            risk_score=100.0,
            last_updated=datetime.utcnow(),
        )


class PortfolioOptimizer:
    """Advanced portfolio optimization using modern portfolio theory"""

    def __init__(self):
        self.optimization_methods = {
            "mean_variance": self._mean_variance_optimization,
            "risk_parity": self._risk_parity_optimization,
            "black_litterman": self._black_litterman_optimization,
            "kelly_optimal": self._kelly_optimization,
        }

    async def optimize_portfolio(
        self,
        opportunities: List[Dict[str, Any]],
        bankroll: float,
        risk_tolerance: RiskLevel = RiskLevel.MODERATE,
        method: str = "mean_variance",
    ) -> PortfolioOptimization:
        """Optimize portfolio allocation across betting opportunities"""
        try:
            if not opportunities or bankroll <= 0:
                return self._create_empty_optimization()

            # Prepare optimization data
            expected_returns = np.array(
                [opp.get("expected_value", 0.0) for opp in opportunities]
            )
            risks = np.array([opp.get("risk", 0.1) for opp in opportunities])
            correlations = await self._estimate_correlation_matrix(opportunities)

            # Apply optimization method
            optimization_func = self.optimization_methods.get(
                method, self._mean_variance_optimization
            )
            result = await optimization_func(
                expected_returns, risks, correlations, risk_tolerance
            )

            # Apply constraints and validation
            validated_weights = self._apply_constraints(
                result["weights"], bankroll, opportunities
            )

            # Calculate portfolio metrics
            portfolio_return = np.dot(validated_weights, expected_returns)
            portfolio_variance = np.dot(
                validated_weights,
                np.dot(correlations * np.outer(risks, risks), validated_weights),
            )
            sharpe_ratio = (
                portfolio_return / np.sqrt(portfolio_variance)
                if portfolio_variance > 0
                else 0
            )

            # Calculate risk contributions
            risk_contributions = self._calculate_risk_contributions(
                validated_weights, risks, correlations
            )

            return PortfolioOptimization(
                optimal_weights={
                    opportunities[i]["id"]: float(validated_weights[i])
                    for i in range(len(opportunities))
                },
                expected_return=float(portfolio_return),
                portfolio_variance=float(portfolio_variance),
                sharpe_ratio=float(sharpe_ratio),
                diversification_ratio=self._calculate_diversification_ratio(
                    validated_weights, risks, correlations
                ),
                risk_contribution=risk_contributions,
                marginal_risk=self._calculate_marginal_risk(
                    validated_weights, risks, correlations
                ),
                optimization_method=method,
                constraints_satisfied=True,
                objective_value=float(result.get("objective_value", sharpe_ratio)),
                metadata={
                    "bankroll": bankroll,
                    "risk_tolerance": risk_tolerance.value,
                    "num_opportunities": len(opportunities),
                    "optimization_timestamp": datetime.utcnow().isoformat(),
                },
            )

        except Exception as e:
            logger.error(f"Portfolio optimization failed: {e!s}")
            return self._create_empty_optimization()

    async def _mean_variance_optimization(
        self,
        expected_returns: np.ndarray,
        risks: np.ndarray,
        correlations: np.ndarray,
        risk_tolerance: RiskLevel,
    ) -> Dict[str, Any]:
        """Mean-variance optimization (Markowitz)"""
        try:
            n = len(expected_returns)

            # Risk aversion parameter based on risk tolerance
            risk_aversion = {
                RiskLevel.CONSERVATIVE: 10.0,
                RiskLevel.MODERATE: 5.0,
                RiskLevel.AGGRESSIVE: 2.0,
                RiskLevel.EXTREME: 1.0,
            }.get(risk_tolerance, 5.0)

            # Covariance matrix
            cov_matrix = correlations * np.outer(risks, risks)

            # Objective: maximize return - risk_aversion * variance
            def objective(weights):
                portfolio_return = np.dot(weights, expected_returns)
                portfolio_variance = np.dot(weights, np.dot(cov_matrix, weights))
                return -(portfolio_return - 0.5 * risk_aversion * portfolio_variance)

            # Constraints
            constraints = [
                {"type": "eq", "fun": lambda x: np.sum(x) - 1.0},  # Weights sum to 1
            ]

            # Bounds (0 to 0.5 for each position to ensure diversification)
            bounds = [(0, 0.5) for _ in range(n)]

            # Initial guess (equal weights)
            x0 = np.ones(n) / n

            # Optimize
            result = opt.minimize(
                objective, x0, method="SLSQP", bounds=bounds, constraints=constraints
            )

            return {
                "weights": result.x if result.success else x0,
                "objective_value": -result.fun if result.success else 0,
                "success": result.success,
            }

        except Exception as e:
            logger.error(f"Mean-variance optimization failed: {e!s}")
            n = len(expected_returns)
            return {"weights": np.ones(n) / n, "objective_value": 0, "success": False}

    async def _risk_parity_optimization(
        self,
        expected_returns: np.ndarray,
        risks: np.ndarray,
        correlations: np.ndarray,
        risk_tolerance: RiskLevel,
    ) -> Dict[str, Any]:
        """Risk parity optimization"""
        try:
            n = len(expected_returns)
            cov_matrix = correlations * np.outer(risks, risks)

            # Objective: minimize sum of squared risk contribution differences
            def objective(weights):
                portfolio_variance = np.dot(weights, np.dot(cov_matrix, weights))
                if portfolio_variance == 0:
                    return 1e6

                # Risk contributions
                marginal_contrib = np.dot(cov_matrix, weights)
                risk_contrib = weights * marginal_contrib / portfolio_variance

                # Target equal risk contribution
                target_contrib = 1.0 / n
                return np.sum((risk_contrib - target_contrib) ** 2)

            # Constraints
            constraints = [
                {"type": "eq", "fun": lambda x: np.sum(x) - 1.0},
            ]

            bounds = [(1e-6, 0.5) for _ in range(n)]
            x0 = np.ones(n) / n

            result = opt.minimize(
                objective, x0, method="SLSQP", bounds=bounds, constraints=constraints
            )

            return {
                "weights": result.x if result.success else x0,
                "objective_value": result.fun if result.success else 1e6,
                "success": result.success,
            }

        except Exception as e:
            logger.error(f"Risk parity optimization failed: {e!s}")
            n = len(expected_returns)
            return {"weights": np.ones(n) / n, "objective_value": 1e6, "success": False}

    async def _black_litterman_optimization(
        self,
        expected_returns: np.ndarray,
        risks: np.ndarray,
        correlations: np.ndarray,
        risk_tolerance: RiskLevel,
    ) -> Dict[str, Any]:
        """Black-Litterman model optimization"""
        # Simplified implementation - in practice would require market cap weights and views
        return await self._mean_variance_optimization(
            expected_returns, risks, correlations, risk_tolerance
        )

    async def _kelly_optimization(
        self,
        expected_returns: np.ndarray,
        risks: np.ndarray,
        correlations: np.ndarray,
        risk_tolerance: RiskLevel,
    ) -> Dict[str, Any]:
        """Kelly criterion portfolio optimization"""
        try:
            n = len(expected_returns)

            # For Kelly optimization, we need to solve for optimal fractions
            # that maximize logarithmic utility
            def objective(weights):
                # Approximate Kelly utility using log expected return
                portfolio_return = np.dot(weights, expected_returns)
                if portfolio_return <= -1:  # Avoid log of negative numbers
                    return 1e6
                return -np.log(1 + portfolio_return)

            constraints = [
                {
                    "type": "ineq",
                    "fun": lambda x: 0.25 - np.sum(x),
                },  # Total Kelly < 25%
            ]

            bounds = [(0, 0.25) for _ in range(n)]
            x0 = np.minimum(expected_returns, 0.05)  # Conservative initial guess
            x0 = np.maximum(x0, 0)  # Ensure non-negative

            result = opt.minimize(
                objective, x0, method="SLSQP", bounds=bounds, constraints=constraints
            )

            weights = result.x if result.success else x0
            # Normalize to ensure they sum to something reasonable
            total_weight = np.sum(weights)
            if total_weight > 0:
                weights = weights / total_weight * min(total_weight, 0.25)

            return {
                "weights": weights,
                "objective_value": -result.fun if result.success else 1e6,
                "success": result.success,
            }

        except Exception as e:
            logger.error(f"Kelly optimization failed: {e!s}")
            n = len(expected_returns)
            return {"weights": np.zeros(n), "objective_value": 1e6, "success": False}

    async def _estimate_correlation_matrix(
        self, opportunities: List[Dict[str, Any]]
    ) -> np.ndarray:
        """Estimate correlation matrix between opportunities"""
        n = len(opportunities)
        correlations = np.eye(n)  # Start with identity matrix

        # Estimate correlations based on opportunity characteristics
        for i in range(n):
            for j in range(i + 1, n):
                correlation = self._estimate_pairwise_correlation(
                    opportunities[i], opportunities[j]
                )
                correlations[i, j] = correlation
                correlations[j, i] = correlation

        return correlations

    def _estimate_pairwise_correlation(
        self, opp1: Dict[str, Any], opp2: Dict[str, Any]
    ) -> float:
        """Estimate correlation between two betting opportunities"""
        # Simple heuristic-based correlation estimation
        correlation = 0.0

        # Same event = high correlation
        if opp1.get("event_id") == opp2.get("event_id"):
            correlation += 0.7

        # Same sport = moderate correlation
        elif opp1.get("sport") == opp2.get("sport"):
            correlation += 0.3

        # Same market type = moderate correlation
        if opp1.get("market_type") == opp2.get("market_type"):
            correlation += 0.2

        # Same team/player = high correlation
        if opp1.get("team") == opp2.get("team") or opp1.get("player") == opp2.get(
            "player"
        ):
            correlation += 0.5

        return min(correlation, 0.9)  # Cap at 0.9

    def _apply_constraints(
        self, weights: np.ndarray, bankroll: float, opportunities: List[Dict[str, Any]]
    ) -> np.ndarray:
        """Apply portfolio constraints"""
        # Ensure weights are non-negative
        weights = np.maximum(weights, 0)

        # Ensure no single position exceeds maximum allocation
        max_single_allocation = 0.5
        weights = np.minimum(weights, max_single_allocation)

        # Renormalize if necessary
        total_weight = np.sum(weights)
        if total_weight > 1.0:
            weights = weights / total_weight

        return weights

    def _calculate_risk_contributions(
        self, weights: np.ndarray, risks: np.ndarray, correlations: np.ndarray
    ) -> Dict[str, float]:
        """Calculate risk contribution of each position"""
        try:
            cov_matrix = correlations * np.outer(risks, risks)
            portfolio_variance = np.dot(weights, np.dot(cov_matrix, weights))

            if portfolio_variance == 0:
                return {f"position_{i}": 0.0 for i in range(len(weights))}

            marginal_contrib = np.dot(cov_matrix, weights)
            risk_contrib = weights * marginal_contrib / portfolio_variance

            return {
                f"position_{i}": float(risk_contrib[i]) for i in range(len(weights))
            }

        except Exception as e:
            logger.warning(f"Risk contribution calculation failed: {e!s}")
            return {f"position_{i}": 0.0 for i in range(len(weights))}

    def _calculate_marginal_risk(
        self, weights: np.ndarray, risks: np.ndarray, correlations: np.ndarray
    ) -> Dict[str, float]:
        """Calculate marginal risk of each position"""
        try:
            cov_matrix = correlations * np.outer(risks, risks)
            portfolio_variance = np.dot(weights, np.dot(cov_matrix, weights))

            if portfolio_variance == 0:
                return {f"position_{i}": 0.0 for i in range(len(weights))}

            marginal_risk = np.dot(cov_matrix, weights) / np.sqrt(portfolio_variance)

            return {
                f"position_{i}": float(marginal_risk[i]) for i in range(len(weights))
            }

        except Exception as e:
            logger.warning(f"Marginal risk calculation failed: {e!s}")
            return {f"position_{i}": 0.0 for i in range(len(weights))}

    def _calculate_diversification_ratio(
        self, weights: np.ndarray, risks: np.ndarray, correlations: np.ndarray
    ) -> float:
        """Calculate portfolio diversification ratio"""
        try:
            # Diversification ratio = weighted average volatility / portfolio volatility
            weighted_avg_vol = np.dot(weights, risks)
            cov_matrix = correlations * np.outer(risks, risks)
            portfolio_vol = np.sqrt(np.dot(weights, np.dot(cov_matrix, weights)))

            if portfolio_vol == 0:
                return 1.0

            return float(weighted_avg_vol / portfolio_vol)

        except Exception as e:
            logger.warning(f"Diversification ratio calculation failed: {e!s}")
            return 1.0

    def _create_empty_optimization(self) -> PortfolioOptimization:
        """Create empty optimization result for error cases"""
        return PortfolioOptimization(
            optimal_weights={},
            expected_return=0.0,
            portfolio_variance=0.0,
            sharpe_ratio=0.0,
            diversification_ratio=1.0,
            risk_contribution={},
            marginal_risk={},
            optimization_method="none",
            constraints_satisfied=False,
            objective_value=0.0,
            metadata={"error": "optimization_failed"},
        )


class UltraRiskManagementEngine:
    """Ultra-comprehensive risk management system"""

    def __init__(self):
        self.kelly_engine = KellyCriterionEngine()
        self.risk_assessor = RiskAssessmentEngine()
        self.portfolio_optimizer = PortfolioOptimizer()
        self.position_history = deque(maxlen=10000)
        self.risk_limits = self._initialize_risk_limits()

    def _initialize_risk_limits(self) -> Dict[str, Any]:
        """Initialize risk limits and controls"""
        return {
            "max_single_position": 0.05,  # 5% of bankroll per position
            "max_daily_risk": 0.10,  # 10% of bankroll per day
            "max_total_exposure": 0.25,  # 25% of bankroll total
            "min_bankroll_reserve": 0.20,  # 20% cash reserve
            "max_correlation_exposure": 0.15,  # 15% in correlated positions
            "stop_loss_threshold": 0.20,  # 20% drawdown triggers stop
            "position_concentration_limit": 5,  # Max 5 positions per event
        }

    async def calculate_optimal_position_size(
        self,
        opportunity: Dict[str, Any],
        bankroll: float,
        existing_positions: List[Dict[str, Any]],
        risk_tolerance: RiskLevel = RiskLevel.MODERATE,
    ) -> PositionSize:
        """Calculate optimal position size with comprehensive risk controls"""
        try:
            # Extract opportunity parameters
            win_probability = opportunity.get("probability", 0.5)
            odds = opportunity.get("odds", 2.0)
            confidence = opportunity.get("confidence", 0.5)
            expected_value = opportunity.get("expected_value", 0.0)

            # Basic validation
            if win_probability <= 0.5 or odds <= 1.0 or expected_value <= 0:
                return self._create_zero_position_size(
                    "No positive expected value or invalid parameters"
                )

            # Kelly calculation
            kelly_result = self.kelly_engine.calculate_kelly_fraction(
                win_probability=win_probability,
                odds=odds,
                volatility=opportunity.get("volatility"),
                correlation=await self._calculate_position_correlation(
                    opportunity, existing_positions
                ),
            )

            kelly_fraction = kelly_result["adjusted_fraction"]

            if kelly_fraction <= 0:
                return self._create_zero_position_size(kelly_result["reasoning"])

            # Calculate base position size
            base_stake = bankroll * kelly_fraction

            # Apply risk controls
            risk_adjustments = await self._apply_risk_controls(
                base_stake, bankroll, opportunity, existing_positions
            )

            final_stake = base_stake * risk_adjustments["total_adjustment"]

            # Calculate bounds
            min_stake = max(1.0, final_stake * 0.1)  # Minimum $1 or 10% of calculated
            max_stake = min(
                bankroll * self.risk_limits["max_single_position"],
                final_stake * 2.0,  # No more than 2x Kelly
            )

            # Ensure final stake is within bounds
            recommended_stake = max(min_stake, min(final_stake, max_stake))

            # Risk-adjusted stake considering uncertainty
            risk_adjusted_stake = recommended_stake * confidence

            # Calculate expected metrics
            expected_return = (
                win_probability * (odds - 1) - (1 - win_probability)
            ) * recommended_stake

            return PositionSize(
                recommended_stake=recommended_stake,
                max_stake=max_stake,
                min_stake=min_stake,
                kelly_stake=base_stake,
                confidence=confidence,
                risk_adjusted_stake=risk_adjusted_stake,
                reasoning=f"Kelly: ${base_stake:.2f}, Risk-adjusted: ${recommended_stake:.2f}",
                constraints=risk_adjustments,
                expected_value=expected_value,
                expected_return=expected_return,
                risk_metrics=await self._calculate_position_risk_metrics(
                    recommended_stake, bankroll, opportunity, existing_positions
                ),
            )

        except Exception as e:
            logger.error(f"Position sizing failed: {e!s}")
            return self._create_zero_position_size(f"Calculation error: {e!s}")

    async def _apply_risk_controls(
        self,
        base_stake: float,
        bankroll: float,
        opportunity: Dict[str, Any],
        existing_positions: List[Dict[str, Any]],
    ) -> Dict[str, Any]:
        """Apply comprehensive risk controls"""
        adjustments = {
            "single_position_limit": 1.0,
            "daily_risk_limit": 1.0,
            "total_exposure_limit": 1.0,
            "correlation_limit": 1.0,
            "concentration_limit": 1.0,
            "drawdown_protection": 1.0,
        }

        # 1. Single position limit
        max_single = bankroll * self.risk_limits["max_single_position"]
        if base_stake > max_single:
            adjustments["single_position_limit"] = max_single / base_stake

        # 2. Daily risk limit
        daily_risk = sum(
            pos.get("stake", 0)
            for pos in existing_positions
            if self._is_today(pos.get("timestamp"))
        )
        remaining_daily = bankroll * self.risk_limits["max_daily_risk"] - daily_risk
        if base_stake > remaining_daily:
            adjustments["daily_risk_limit"] = max(0, remaining_daily / base_stake)

        # 3. Total exposure limit
        total_exposure = sum(pos.get("stake", 0) for pos in existing_positions)
        remaining_exposure = (
            bankroll * self.risk_limits["max_total_exposure"] - total_exposure
        )
        if base_stake > remaining_exposure:
            adjustments["total_exposure_limit"] = max(
                0, remaining_exposure / base_stake
            )

        # 4. Correlation limit
        correlated_exposure = sum(
            pos.get("stake", 0)
            for pos in existing_positions
            if self._is_correlated(opportunity, pos)
        )
        remaining_correlation = (
            bankroll * self.risk_limits["max_correlation_exposure"]
            - correlated_exposure
        )
        if base_stake > remaining_correlation:
            adjustments["correlation_limit"] = max(
                0, remaining_correlation / base_stake
            )

        # 5. Event concentration limit
        event_positions = sum(
            1
            for pos in existing_positions
            if pos.get("event_id") == opportunity.get("event_id")
        )
        if event_positions >= self.risk_limits["position_concentration_limit"]:
            adjustments["concentration_limit"] = 0.0

        # 6. Drawdown protection
        current_drawdown = await self._calculate_current_drawdown(
            bankroll, existing_positions
        )
        if current_drawdown > self.risk_limits["stop_loss_threshold"]:
            adjustments["drawdown_protection"] = 0.0  # Stop trading
        elif current_drawdown > 0.1:  # Reduce sizing during moderate drawdown
            adjustments["drawdown_protection"] = 1 - current_drawdown

        # Calculate total adjustment (minimum of all adjustments)
        total_adjustment = min(adjustments.values())
        adjustments["total_adjustment"] = total_adjustment

        return adjustments

    def _is_today(self, timestamp: Optional[str]) -> bool:
        """Check if timestamp is from today"""
        if not timestamp:
            return False
        try:
            ts = datetime.fromisoformat(timestamp.replace("Z", "+00:00"))
            return ts.date() == datetime.utcnow().date()
        except:
            return False

    def _is_correlated(
        self, opportunity: Dict[str, Any], position: Dict[str, Any]
    ) -> bool:
        """Check if opportunity is correlated with existing position"""
        # Same event
        if opportunity.get("event_id") == position.get("event_id"):
            return True

        # Same team/player
        if opportunity.get("team") == position.get("team") or opportunity.get(
            "player"
        ) == position.get("player"):
            return True

        return False

    async def _calculate_current_drawdown(
        self, current_bankroll: float, positions: List[Dict[str, Any]]
    ) -> float:
        """Calculate current drawdown from peak"""
        # This would track historical peak bankroll
        # For now, use a simplified calculation
        if not self.position_history:
            return 0.0

        historical_values = [
            pos.get("bankroll", current_bankroll) for pos in self.position_history
        ]
        if not historical_values:
            return 0.0

        peak_bankroll = max(historical_values)
        if peak_bankroll <= 0:
            return 0.0

        drawdown = (peak_bankroll - current_bankroll) / peak_bankroll
        return max(0.0, drawdown)

    async def _calculate_position_correlation(
        self, opportunity: Dict[str, Any], existing_positions: List[Dict[str, Any]]
    ) -> Optional[float]:
        """Calculate correlation with existing positions"""
        if not existing_positions:
            return None

        correlations = []
        for pos in existing_positions:
            if self._is_correlated(opportunity, pos):
                correlations.append(0.7)  # High correlation
            elif opportunity.get("sport") == pos.get("sport"):
                correlations.append(0.3)  # Moderate correlation
            else:
                correlations.append(0.1)  # Low correlation

        return np.mean(correlations) if correlations else None

    async def _calculate_position_risk_metrics(
        self,
        stake: float,
        bankroll: float,
        opportunity: Dict[str, Any],
        existing_positions: List[Dict[str, Any]],
    ) -> RiskMetrics:
        """Calculate risk metrics for this position"""
        # Simplified risk metrics calculation
        # In practice, would use full portfolio analysis

        position_risk = stake / bankroll
        var_95 = -stake * 0.95  # Simplified VaR (could lose 95% of stake)

        return RiskMetrics(
            value_at_risk_95=var_95,
            value_at_risk_99=-stake,
            expected_shortfall_95=var_95,
            max_drawdown=position_risk,
            sharpe_ratio=(
                opportunity.get("expected_value", 0) / position_risk
                if position_risk > 0
                else 0
            ),
            sortino_ratio=0.0,
            calmar_ratio=0.0,
            kelly_fraction=stake / bankroll,
            bankruptcy_probability=0.0,
            time_to_ruin=None,
            correlation_risk=0.0,
            liquidity_risk=0.0,
            model_risk=1 - opportunity.get("confidence", 0.5),
            confidence_interval=(-stake, stake * opportunity.get("odds", 2.0)),
            risk_score=position_risk * 100,
            last_updated=datetime.utcnow(),
        )

    def _create_zero_position_size(self, reason: str) -> PositionSize:
        """Create zero position size with reason"""
        return PositionSize(
            recommended_stake=0.0,
            max_stake=0.0,
            min_stake=0.0,
            kelly_stake=0.0,
            confidence=0.0,
            risk_adjusted_stake=0.0,
            reasoning=reason,
            constraints={},
            expected_value=0.0,
            expected_return=0.0,
            risk_metrics=self.risk_assessor._create_empty_risk_metrics(),
        )

    async def get_risk_management_health(self) -> Dict[str, Any]:
        """Get comprehensive risk management system health"""
        return {
            "status": "healthy",
            "risk_limits": self.risk_limits,
            "position_history_size": len(self.position_history),
            "kelly_engine_status": "operational",
            "risk_assessor_status": "operational",
            "portfolio_optimizer_status": "operational",
            "last_health_check": datetime.utcnow().isoformat(),
        }


# Global instance
ultra_risk_engine = UltraRiskManagementEngine()

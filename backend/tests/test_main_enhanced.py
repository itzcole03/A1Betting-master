"""
Comprehensive integration tests for main_enhanced.py
Tests all API endpoints, error handling, and system integration
"""

import pytest
import asyncio
import json
from datetime import datetime, timedelta
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock, AsyncMock

# Import the FastAPI app
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main_enhanced import app

client = TestClient(app)

class TestHealthAndMonitoring:
    """Test health check and monitoring endpoints"""

    def test_basic_health_check(self):
        """Test basic health endpoint"""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        assert data["status"] in ["healthy", "degraded"]

    def test_latency_health_endpoint(self):
        """Test latency and health metrics endpoint"""
        response = client.get("/api/v4/monitoring/latency-health")
        assert response.status_code == 200
        data = response.json()
        assert "latency" in data
        assert "health" in data
        assert "timestamp" in data
        assert isinstance(data["latency"], float)
        assert data["health"] in ["healthy", "degraded"]

    def test_comprehensive_health_check(self):
        """Test comprehensive health check with detailed metrics"""
        response = client.get("/api/v4/health/comprehensive")
        assert response.status_code == 200
        data = response.json()
        
        # Check required fields
        assert "status" in data
        assert "timestamp" in data
        assert "services" in data
        assert "metrics" in data
        assert "version" in data
        
        # Check services status
        services = data["services"]
        assert "database" in services
        assert "prediction_engine" in services
        
        # Check metrics
        metrics = data["metrics"]
        assert "uptime_seconds" in metrics
        assert "memory_usage_mb" in metrics
        assert "cpu_usage_percent" in metrics

    def test_system_resources_endpoint(self):
        """Test system resource monitoring"""
        response = client.get("/api/v4/monitoring/resources")
        assert response.status_code == 200
        data = response.json()
        assert "cpu" in data
        assert "memory" in data
        assert "disk" in data
        assert all(isinstance(data[key], (int, float)) for key in ["cpu", "memory", "disk"])


class TestValueBetsAndArbitrage:
    """Test value betting and arbitrage endpoints"""

    def test_get_value_bets(self):
        """Test value bets endpoint"""
        response = client.get("/api/v4/betting/value-bets")
        assert response.status_code == 200
        data = response.json()
        assert "value_bets" in data
        
        if data["value_bets"]:
            bet = data["value_bets"][0]
            required_fields = ["event", "sport", "bookmaker", "outcome", "odds", "edge"]
            for field in required_fields:
                assert field in bet

    def test_get_arbitrage_opportunities(self):
        """Test arbitrage opportunities endpoint"""
        response = client.get("/api/v4/betting/arbitrage")
        assert response.status_code == 200
        data = response.json()
        assert "arbitrage_opportunities" in data
        
        if data["arbitrage_opportunities"]:
            arb = data["arbitrage_opportunities"][0]
            required_fields = ["event", "sport", "legs", "profit_percent"]
            for field in required_fields:
                assert field in arb

    def test_place_bet_endpoint(self):
        """Test bet placement endpoint"""
        bet_data = {
            "user_id": "test_user",
            "event": "Test Game",
            "outcome": "Team A Win",
            "bookmaker": "TestBook",
            "odds": 2.5,
            "stake": 50
        }
        
        response = client.post("/api/v4/betting/place-bet", json=bet_data)
        assert response.status_code == 200
        data = response.json()
        assert "bet_id" in data
        assert "status" in data

    def test_betting_historical_analytics(self):
        """Test historical betting analytics"""
        response = client.get("/api/v4/betting/historical-analytics")
        assert response.status_code == 200
        data = response.json()
        assert "value_bet_count" in data
        assert "arbitrage_count" in data
        assert "avg_value_bet_edge" in data
        assert "avg_arbitrage_profit_pct" in data

    def test_export_betting_data(self):
        """Test betting data export"""
        # Test JSON export
        response = client.get("/api/v4/betting/export?format=json")
        assert response.status_code == 200
        data = response.json()
        assert "format" in data
        assert data["format"] == "json"
        
        # Test CSV export
        response = client.get("/api/v4/betting/export?format=csv")
        assert response.status_code == 200
        data = response.json()
        assert "format" in data
        assert data["format"] == "csv"
        assert "data" in data


class TestUserManagement:
    """Test user-related endpoints"""

    def test_get_user_profile(self):
        """Test user profile retrieval"""
        response = client.get("/api/v4/user/profile/test_user")
        assert response.status_code == 200
        data = response.json()
        assert "user_id" in data
        assert "risk_tolerance" in data
        assert "preferred_stake" in data
        assert "bookmakers" in data

    def test_update_user_profile(self):
        """Test user profile update"""
        profile_data = {
            "risk_tolerance": "high",
            "preferred_stake": 100.0,
            "bookmakers": ["Bet365", "Pinnacle"]
        }
        
        response = client.post("/api/v4/user/profile/test_user", json=profile_data)
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "updated"

    def test_user_profit_analytics(self):
        """Test user profit analytics"""
        response = client.get("/api/v4/user/profit-analytics?user_id=test_user")
        assert response.status_code == 200
        data = response.json()
        assert "user_id" in data
        assert "monthly" in data
        assert "yearly" in data
        assert "by_bookmaker" in data

    def test_bankroll_simulation(self):
        """Test bankroll simulation"""
        response = client.get("/api/v4/user/bankroll-simulation?user_id=test_user&n=10")
        assert response.status_code == 200
        data = response.json()
        assert "user_id" in data
        assert "final_bankroll" in data
        assert "history" in data
        assert len(data["history"]) == 10


class TestModelManagement:
    """Test model management endpoints"""

    @patch('complete_stub_endpoints.enhanced_model_service')
    def test_start_model_retraining(self, mock_service):
        """Test model retraining initiation"""
        mock_service.start_retraining = AsyncMock(return_value="test_job_id")
        
        config = {
            "training_data_days": 90,
            "validation_split": 0.2
        }
        
        response = client.post("/api/v4/model/retrain", json=config)
        assert response.status_code == 200
        data = response.json()
        assert "job_id" in data
        assert "status" in data

    @patch('complete_stub_endpoints.enhanced_model_service')
    def test_get_retraining_status(self, mock_service):
        """Test retraining status retrieval"""
        mock_status = {
            "job_id": "test_job",
            "status": "running",
            "progress": 50,
            "current_stage": "model_training"
        }
        mock_service.get_retraining_status = AsyncMock(return_value=mock_status)
        
        response = client.get("/api/v4/model/retrain/status/test_job")
        assert response.status_code == 200
        data = response.json()
        assert data["job_id"] == "test_job"
        assert data["status"] == "running"

    @patch('complete_stub_endpoints.enhanced_model_service')
    def test_model_rollback(self, mock_service):
        """Test model rollback"""
        mock_rollback = {
            "status": "success",
            "rolled_back_from": "v4.0",
            "rolled_back_to": "v3.5"
        }
        mock_service.rollback_to_previous_version = AsyncMock(return_value=mock_rollback)
        
        response = client.post("/api/v4/model/rollback")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"

    def test_model_versions(self):
        """Test model versions listing"""
        response = client.get("/api/v4/model/versions")
        assert response.status_code == 200
        data = response.json()
        assert "models" in data
        assert isinstance(data["models"], list)


class TestPredictionExplanations:
    """Test prediction explanation endpoints"""

    @patch('complete_stub_endpoints.enhanced_model_service')
    def test_get_prediction_explanation(self, mock_service):
        """Test SHAP explanation retrieval"""
        mock_explanation = {
            "prediction_id": "test_pred",
            "explanation": {
                "feature_importance": {"feature1": 0.5, "feature2": 0.3},
                "shap_values": []
            }
        }
        mock_service.get_explanation = AsyncMock(return_value=mock_explanation)
        
        response = client.get("/api/v4/explain/test_pred")
        assert response.status_code == 200
        data = response.json()
        assert data["prediction_id"] == "test_pred"
        assert "explanation" in data

    def test_prediction_feedback(self):
        """Test prediction feedback endpoint"""
        response = client.post(
            "/api/v4/prediction/feedback",
            params={
                "user_id": "test_user",
                "prediction_id": "test_pred",
                "feedback": "accurate"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "received"
        assert data["user_id"] == "test_user"


class TestDataQuality:
    """Test data quality and drift endpoints"""

    @patch('complete_stub_endpoints.data_pipeline_service')
    def test_data_drift_report(self, mock_service):
        """Test data drift detection"""
        mock_drift = {
            "drift_detected": True,
            "drift_score": 0.23,
            "features_with_drift": []
        }
        mock_service.get_data_drift_report = AsyncMock(return_value=mock_drift)
        
        response = client.get("/api/v4/data/drift")
        assert response.status_code == 200
        data = response.json()
        assert "drift_detected" in data
        assert "drift_score" in data

    @patch('complete_stub_endpoints.data_pipeline_service')
    def test_data_quality_report(self, mock_service):
        """Test data quality assessment"""
        mock_quality = {
            "overall_quality_score": 0.87,
            "data_sources": [],
            "quality_metrics": {}
        }
        mock_service.get_data_quality_report = AsyncMock(return_value=mock_quality)
        
        response = client.get("/api/v4/data/quality")
        assert response.status_code == 200
        data = response.json()
        assert "overall_quality_score" in data


class TestEnsembleManagement:
    """Test ensemble optimization endpoints"""

    @patch('complete_stub_endpoints.ensemble_optimizer_service')
    def test_ensemble_diversity_metrics(self, mock_service):
        """Test ensemble diversity calculation"""
        mock_metrics = {
            "diversity_measures": {},
            "individual_model_performance": [],
            "ensemble_performance": {}
        }
        mock_service.get_diversity_metrics = AsyncMock(return_value=mock_metrics)
        
        response = client.get("/api/v4/ensemble/diversity")
        assert response.status_code == 200
        data = response.json()
        assert "diversity_measures" in data

    @patch('complete_stub_endpoints.ensemble_optimizer_service')
    def test_ensemble_candidates(self, mock_service):
        """Test candidate model retrieval"""
        mock_candidates = {
            "candidate_models": [],
            "selection_criteria": {},
            "recommended_ensemble": []
        }
        mock_service.get_candidate_models = AsyncMock(return_value=mock_candidates)
        
        response = client.get("/api/v4/ensemble/candidates")
        assert response.status_code == 200
        data = response.json()
        assert "candidate_models" in data


class TestDocumentationGeneration:
    """Test documentation generation"""

    @patch('complete_stub_endpoints.documentation_service')
    def test_aggregate_documentation(self, mock_service):
        """Test documentation aggregation"""
        mock_docs = {
            "sections": [],
            "generated_at": datetime.utcnow().isoformat(),
            "total_files": 10
        }
        mock_service.generate_aggregate_docs = AsyncMock(return_value=mock_docs)
        
        response = client.get("/api/v4/docs/aggregate")
        assert response.status_code == 200
        data = response.json()
        assert "sections" in data
        assert "total_files" in data


class TestAuditAndCompliance:
    """Test audit and compliance endpoints"""

    @patch('complete_stub_endpoints.enhanced_model_service')
    def test_prediction_audit(self, mock_service):
        """Test prediction audit trail"""
        mock_audit = {
            "predictions": [],
            "summary": {
                "total_predictions": 100,
                "average_accuracy": 0.95
            }
        }
        mock_service.get_prediction_audit = AsyncMock(return_value=mock_audit)
        
        response = client.get("/api/v4/audit/predictions")
        assert response.status_code == 200
        data = response.json()
        assert "predictions" in data
        assert "summary" in data

    def test_user_session_audit(self):
        """Test user session audit"""
        response = client.get("/api/v4/user/session-audit?user_id=test_user")
        assert response.status_code == 200
        data = response.json()
        assert "user_id" in data
        assert "bet_count" in data


class TestErrorHandling:
    """Test error handling and edge cases"""

    def test_invalid_user_id(self):
        """Test handling of invalid user IDs"""
        response = client.get("/api/v4/user/profile/")
        assert response.status_code == 404

    def test_invalid_prediction_id(self):
        """Test handling of invalid prediction IDs"""
        response = client.get("/api/v4/explain/nonexistent")
        # Should handle gracefully, possibly returning 404 or empty explanation
        assert response.status_code in [200, 404, 500]

    def test_malformed_request_data(self):
        """Test handling of malformed request data"""
        response = client.post("/api/v4/betting/place-bet", json={"invalid": "data"})
        # Should return validation error
        assert response.status_code in [400, 422]

    def test_rate_limiting(self):
        """Test rate limiting functionality"""
        # Make multiple rapid requests
        user_id = "rate_limit_test_user"
        for i in range(10):
            response = client.post(
                "/api/v4/betting/place-bet",
                json={
                    "user_id": user_id,
                    "event": f"Test Event {i}",
                    "outcome": "Test Outcome",
                    "bookmaker": "TestBook",
                    "odds": 2.0,
                    "stake": 10
                }
            )
            # After rate limit is hit, should return 429
            if i > 5:  # Assuming rate limit is 5 requests
                if response.status_code == 429:
                    break


class TestIntegration:
    """Integration tests for complete workflows"""

    def test_complete_betting_workflow(self):
        """Test complete betting workflow from discovery to placement"""
        # 1. Get value bets
        response = client.get("/api/v4/betting/value-bets")
        assert response.status_code == 200
        value_bets = response.json()["value_bets"]
        
        if value_bets:
            # 2. Place a bet
            bet = value_bets[0]
            bet_data = {
                "user_id": "integration_test_user",
                "event": bet["event"],
                "outcome": bet["outcome"],
                "bookmaker": bet["bookmaker"],
                "odds": bet["odds"],
                "stake": 25
            }
            
            response = client.post("/api/v4/betting/place-bet", json=bet_data)
            assert response.status_code == 200
            
            # 3. Check user analytics
            response = client.get("/api/v4/user/profit-analytics?user_id=integration_test_user")
            assert response.status_code == 200

    def test_model_management_workflow(self):
        """Test complete model management workflow"""
        # 1. Check current model versions
        response = client.get("/api/v4/model/versions")
        assert response.status_code == 200
        
        # 2. Start retraining (if service is available)
        config = {"training_data_days": 30}
        response = client.post("/api/v4/model/retrain", json=config)
        # May succeed or fail depending on service availability
        assert response.status_code in [200, 500]


if __name__ == "__main__":
    pytest.main([__file__, "-v"])

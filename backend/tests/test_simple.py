"""Simple test suite for backend functionality.

This module provides basic tests without TestClient to avoid compatibility issues.
"""

import os
import sys

import pytest

# Add backend directory to Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from feature_engineering import FeatureEngineering
from feature_flags import FeatureFlags

# Import modules
from main import InputData, app, features_to_array


def test_input_data_validation():
    """Test InputData model validation."""
    # Valid data
    valid_data = {
        "game_id": 12345,
        "team_stats": {"score": 100.0},
        "player_stats": {"points": 25.0},
    }
    input_data = InputData(**valid_data)
    assert (
        input_data.game_id == 12345
    ), f"Expected game_id 12345, got {input_data.game_id}"
    assert (
        input_data.team_stats["score"] == 100.0
    ), f"Expected team_stats['score'] 100.0, got {input_data.team_stats['score']}"
    assert (
        input_data.player_stats["points"] == 25.0
    ), f"Expected player_stats['points'] 25.0, got {input_data.player_stats['points']}"


def test_features_to_array():
    """Test feature dictionary to array conversion."""
    features = {"score": 100.0, "points": 25.0, "assists": 8.0}
    result = features_to_array(features)
    assert len(result) == 1, f"Expected result length 1, got {len(result)}"
    assert len(result[0]) == 3, f"Expected inner result length 3, got {len(result[0])}"


def test_feature_engineering_initialization():
    """Test FeatureEngineering class initialization."""
    fe = FeatureEngineering()
    assert hasattr(
        fe, "calculate_model_weights"
    ), "FeatureEngineering missing 'calculate_model_weights'"
    assert hasattr(
        fe, "calculate_ensemble_confidence"
    ), "FeatureEngineering missing 'calculate_ensemble_confidence'"


def test_feature_flags_initialization():
    """Test FeatureFlags initialization."""
    ff = FeatureFlags.get_instance()
    assert ff is not None, "FeatureFlags.get_instance() returned None"
    assert hasattr(
        ff, "is_feature_enabled"
    ), "FeatureFlags missing 'is_feature_enabled'"
    assert hasattr(
        ff, "get_experiment_variant"
    ), "FeatureFlags missing 'get_experiment_variant'"


def test_fastapi_app_exists():
    """Test that FastAPI app is properly initialized."""
    assert app is not None, "FastAPI app is None"
    assert hasattr(app, "title"), "FastAPI app missing 'title' attribute"
    assert (
        app.title == "Alpha1 AI Sports Betting Backend"
    ), f"Unexpected app title: {app.title}"


def test_app_routes():
    """Test that required routes are registered."""
    routes = [route.path for route in app.routes]
    assert "/features" in routes, "'/features' route missing"
    assert "/predict" in routes, "'/predict' route missing"
    assert "/feature-flag-enabled" in routes, "'/feature-flag-enabled' route missing"
    assert "/experiment-variant" in routes, "'/experiment-variant' route missing"


if __name__ == "__main__":
    pytest.main([__file__, "-v"])

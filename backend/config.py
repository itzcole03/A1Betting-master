"""Backend Configuration Management
Centralized configuration for all backend services with environment variable support
"""

import logging
from dataclasses import dataclass
from typing import Any, Dict, List, Optional

from pydantic import field_validator
from pydantic_settings import BaseSettings

logger = logging.getLogger(__name__)


class BackendConfig(BaseSettings):
    """Main backend configuration with environment variable support"""

    # Application Settings
    app_name: str = "A1Betting Backend"
    version: str = "1.0.0"
    debug: bool = False
    environment: str = "development"

    # API Settings
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    api_workers: int = 1
    api_timeout: int = 30
    cors_origins: List[str] = ["*"]

    # Database Settings
    database_url: Optional[str] = None
    redis_url: Optional[str] = None
    postgres_host: str = "localhost"
    postgres_port: int = 5432
    postgres_db: str = "a1betting"
    postgres_user: str = "postgres"
    postgres_password: str = ""

    # External API Settings
    sportradar_api_key: Optional[str] = None
    odds_api_key: Optional[str] = None
    prizepicks_api_key: Optional[str] = None

    # Rate Limiting
    rate_limit_requests: int = 100
    rate_limit_window: int = 60

    # Caching
    cache_ttl: int = 3600
    cache_max_size: int = 1000

    # ML Model Settings
    model_path: str = "./models"
    model_update_interval: int = 3600
    ensemble_weights: Dict[str, float] = {
        "xgboost": 0.3,
        "lightgbm": 0.3,
        "random_forest": 0.2,
        "neural_net": 0.2,
    }
    # Local LLM Settings (Ollama or LM Studio)
    llm_provider: str = "ollama"  # 'ollama' or 'lmstudio'
    llm_endpoint: str = "http://127.0.0.1:11434"  # Ollama default
    llm_default_model: Optional[str] = None  # model name to force; auto-select if None
    # Advanced LLM Settings
    llm_timeout: int = 60  # HTTP request timeout in seconds
    llm_batch_size: int = 16  # batch size for embedding requests
    llm_models_cache_ttl: int = 300  # cache TTL for model list (seconds)
    # Feature toggle for LLM endpoints
    enable_llm: bool = True  # turn off LLM routes if False

    # Monitoring Settings
    metrics_enabled: bool = True
    prometheus_port: int = 9090
    health_check_interval: int = 30

    # Logging Settings
    log_level: str = "INFO"
    log_format: str = "json"
    log_file: Optional[str] = None

    # Security Settings
    secret_key: str = "your-secret-key-change-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expiration: int = 3600

    @field_validator("cors_origins", mode="before")
    def parse_cors_origins(cls, v: str | List[str]) -> List[str]:
        """Parse comma-separated CORS origins from string to list"""
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",")]
        return v

    @field_validator("ensemble_weights")
    def validate_ensemble_weights(cls, v: Dict[str, float]) -> Dict[str, float]:
        """Ensure ensemble weights sum to approximately 1.0"""
        total = sum(v.values())
        if abs(total - 1.0) > 0.01:
            raise ValueError("Ensemble weights must sum to 1.0")
        return v

    class Config:
        env_file = ".env"
        env_prefix = "A1BETTING_"


@dataclass
class HealthStatus:
    """Health check status for services"""

    service: str
    status: str  # "healthy", "degraded", "unhealthy"
    response_time: float
    error: Optional[str] = None
    details: Optional[Dict[str, Any]] = None


class ConfigManager:
    """Central configuration manager"""

    def __init__(self):
        self.config = BackendConfig()
        self._validate_config()
        logger.info(f"Configuration loaded for environment: {self.config.environment}")

    def _validate_config(self):
        """Validate critical configuration settings"""
        if self.config.environment == "production":
            if self.config.secret_key == "your-secret-key-change-in-production":
                raise ValueError("Secret key must be changed in production")

            if not self.config.database_url and not self.config.postgres_password:
                raise ValueError("Database configuration required in production")

    def get_database_url(self) -> str:
        """Get formatted database URL"""
        if self.config.database_url:
            return self.config.database_url

        return (
            f"postgresql://{self.config.postgres_user}:"
            f"{self.config.postgres_password}@{self.config.postgres_host}:"
            f"{self.config.postgres_port}/{self.config.postgres_db}"
        )

    def get_redis_url(self) -> str:
        """Get Redis URL for caching"""
        return self.config.redis_url or "redis://localhost:6379"

    def is_production(self) -> bool:
        """Check if running in production"""
        return self.config.environment == "production"

    def get_external_api_config(self) -> Dict[str, Optional[str]]:
        """Get external API configuration"""
        return {
            "sportradar": self.config.sportradar_api_key,
            "odds_api": self.config.odds_api_key,
            "prizepicks": self.config.prizepicks_api_key,
        }


# Global configuration instance
config_manager = ConfigManager()
config = config_manager.config

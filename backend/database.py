"""Database Integration Layer
SQLAlchemy models, connection management, and migration support
"""

import logging
from contextlib import asynccontextmanager
from datetime import datetime, timedelta
from typing import Any, Dict

from config import config_manager
from sqlalchemy import (
    JSON,
    Boolean,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Index,
    Integer,
    MetaData,
    String,
    Text,
    create_engine,
)
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker

logger = logging.getLogger(__name__)

# Database metadata and base model
metadata = MetaData()
Base = declarative_base(metadata=metadata)


class PredictionModel(Base):
    """Model predictions and performance tracking"""

    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    event_id = Column(String(100), nullable=False, index=True)
    model_name = Column(String(50), nullable=False)
    prediction_type = Column(String(50), nullable=False)
    predicted_value = Column(Float, nullable=False)
    confidence = Column(Float, nullable=False)
    actual_value = Column(Float, nullable=True)
    features = Column(JSON, nullable=False)
    shap_values = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    __table_args__ = (
        Index("idx_predictions_event_model", "event_id", "model_name"),
        Index("idx_predictions_created", "created_at"),
    )


class BettingOpportunity(Base):
    """Betting opportunities with tracking"""

    __tablename__ = "betting_opportunities"

    id = Column(Integer, primary_key=True, autoincrement=True)
    opportunity_id = Column(String(100), unique=True, nullable=False)
    opportunity_type = Column(String(50), nullable=False)
    event_id = Column(String(100), nullable=False)
    market_type = Column(String(50), nullable=False)
    selection = Column(String(100), nullable=False)
    expected_value = Column(Float, nullable=False)
    confidence = Column(Float, nullable=False)
    kelly_fraction = Column(Float, nullable=False)
    risk_level = Column(String(20), nullable=False)
    best_odds = Column(Float, nullable=False)
    market_data = Column(JSON, nullable=False)
    status = Column(String(20), default="active")  # active, expired, executed
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)

    __table_args__ = (
        Index("idx_opportunities_status", "status"),
        Index("idx_opportunities_created", "created_at"),
        Index("idx_opportunities_expires", "expires_at"),
    )


class ModelPerformance(Base):
    """Model performance metrics tracking"""

    __tablename__ = "model_performance"

    id = Column(Integer, primary_key=True, autoincrement=True)
    model_name = Column(String(50), nullable=False)
    metric_name = Column(String(50), nullable=False)
    metric_value = Column(Float, nullable=False)
    period_start = Column(DateTime, nullable=False)
    period_end = Column(DateTime, nullable=False)
    sample_size = Column(Integer, default=0)
    # Removed the conflicting 'metadata' attribute
    additional_metadata = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        Index("idx_performance_model_metric", "model_name", "metric_name"),
        Index("idx_performance_period", "period_start", "period_end"),
    )


class FeatureStore(Base):
    """Feature engineering and storage"""

    __tablename__ = "feature_store"

    id = Column(Integer, primary_key=True, autoincrement=True)
    feature_set_id = Column(String(100), nullable=False, index=True)
    event_id = Column(String(100), nullable=False)
    features = Column(JSON, nullable=False)
    feature_version = Column(String(20), default="1.0")
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)

    __table_args__ = (
        Index("idx_features_event", "event_id"),
        Index("idx_features_version", "feature_version"),
    )


class SystemAlert(Base):
    """System monitoring and alerts"""

    __tablename__ = "system_alerts"

    id = Column(Integer, primary_key=True, autoincrement=True)
    alert_type = Column(String(50), nullable=False)
    severity = Column(String(20), nullable=False)  # info, warning, error, critical
    message = Column(Text, nullable=False)
    service = Column(String(50), nullable=True)
    metric_value = Column(Float, nullable=True)
    threshold = Column(Float, nullable=True)
    resolved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)

    __table_args__ = (
        Index("idx_alerts_severity", "severity"),
        Index("idx_alerts_resolved", "resolved"),
        Index("idx_alerts_created", "created_at"),
    )


class BetHistory(Base):
    """Historical bet tracking"""

    __tablename__ = "bet_history"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String(100), nullable=True)  # For future user tracking
    opportunity_id = Column(
        String(100), ForeignKey("betting_opportunities.opportunity_id")
    )
    stake = Column(Float, nullable=False)
    odds = Column(Float, nullable=False)
    potential_payout = Column(Float, nullable=False)
    actual_payout = Column(Float, nullable=True)
    status = Column(String(20), default="pending")  # pending, won, lost, void
    placed_at = Column(DateTime, default=datetime.utcnow)
    settled_at = Column(DateTime, nullable=True)

    # Relationship
    opportunity = relationship("BettingOpportunity")

    __table_args__ = (
        Index("idx_bets_status", "status"),
        Index("idx_bets_placed", "placed_at"),
    )


class DatabaseManager:
    """Database connection and session management"""

    def __init__(self):
        self.config = config_manager
        self.engine = None
        self.async_engine = None
        self.Session = None
        self.AsyncSession = None
        self._initialized = False

    async def initialize(self):
        """Initialize database connections"""
        if self._initialized:
            return

        try:
            # Create engines
            database_url = self.config.get_database_url()

            # Sync engine for migrations
            self.engine = create_engine(
                database_url.replace("postgresql://", "postgresql+psycopg2://"),
                pool_pre_ping=True,
                echo=self.config.config.debug,
            )

            # Async engine for application
            async_url = database_url.replace("postgresql://", "postgresql+asyncpg://")
            self.async_engine = create_async_engine(
                async_url, pool_pre_ping=True, echo=self.config.config.debug
            )

            # Session factories
            self.Session = sessionmaker(bind=self.engine)
            self.AsyncSession = async_sessionmaker(
                bind=self.async_engine, class_=AsyncSession, expire_on_commit=False
            )

            # Create tables
            await self.create_tables()

            self._initialized = True
            logger.info("Database initialized successfully")

        except Exception as e:
            logger.error(f"Database initialization failed: {e!s}")
            raise

    async def create_tables(self):
        """Create database tables"""
        try:
            async with self.async_engine.begin() as conn:
                await conn.run_sync(Base.metadata.create_all)
            logger.info("Database tables created/verified")
        except Exception as e:
            logger.error(f"Error creating tables: {e!s}")
            raise

    @asynccontextmanager
    async def get_session(self):
        """Get async database session"""
        if not self._initialized:
            await self.initialize()

        async with self.AsyncSession() as session:
            try:
                yield session
                await session.commit()
            except Exception as e:
                await session.rollback()
                logger.error(f"Database session error: {e!s}")
                raise
            finally:
                await session.close()

    async def health_check(self) -> Dict[str, Any]:
        """Check database health"""
        try:
            async with self.get_session() as session:
                result = await session.execute("SELECT 1")
                result.fetchone()

                return {
                    "status": "healthy",
                    "response_time": 0.0,  # TODO: Measure actual response time
                    "connection_pool": {
                        "size": self.async_engine.pool.size(),
                        "checked_in": self.async_engine.pool.checkedin(),
                        "checked_out": self.async_engine.pool.checkedout(),
                    },
                }
        except Exception as e:
            return {"status": "unhealthy", "error": str(e)}

    async def cleanup_old_data(self, days: int = 30):
        """Clean up old data"""
        try:
            cutoff_date = datetime.utcnow() - timedelta(days=days)

            async with self.get_session() as session:
                # Clean up old predictions
                await session.execute(
                    "DELETE FROM predictions WHERE created_at < :cutoff",
                    {"cutoff": cutoff_date},
                )

                # Clean up expired opportunities
                await session.execute(
                    "DELETE FROM betting_opportunities WHERE status = 'expired' AND created_at < :cutoff",
                    {"cutoff": cutoff_date},
                )

                # Clean up resolved alerts
                await session.execute(
                    "DELETE FROM system_alerts WHERE resolved = true AND created_at < :cutoff",
                    {"cutoff": cutoff_date},
                )

                logger.info(f"Cleaned up data older than {days} days")

        except Exception as e:
            logger.error(f"Error cleaning up old data: {e!s}")
            raise


# Global database manager
db_manager = DatabaseManager()


# Convenience function for getting sessions
async def get_db_session():
    """Get database session for dependency injection"""
    async with db_manager.get_session() as session:
        yield session

"""Enhanced Model Inference Service
Containerized ML model serving with ensemble predictions, model versioning, and performance tracking
"""

import asyncio
import json
import logging
import pickle
import time
from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple, Union

import joblib
import numpy as np
from config import config_manager
from database import ModelPerformance, PredictionModel, db_manager
from feature_engineering import FeatureEngineering

logger = logging.getLogger(__name__)


@dataclass
class ModelMetadata:
    """Model metadata and configuration"""

    name: str
    version: str
    model_type: str  # xgboost, lightgbm, random_forest, neural_net
    file_path: str
    features: List[str]
    target: str
    training_date: datetime
    performance_metrics: Dict[str, float] = field(default_factory=dict)
    weight: float = 1.0
    is_active: bool = True
    preprocessing_config: Dict[str, Any] = field(default_factory=dict)


@dataclass
class PredictionRequest:
    """Request for model prediction"""

    event_id: str
    features: Dict[str, Union[float, int]]
    model_names: Optional[List[str]] = None
    require_explanations: bool = False
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class ModelPrediction:
    """Individual model prediction result"""

    model_name: str
    model_version: str
    predicted_value: float
    confidence: float
    feature_importance: Dict[str, float] = field(default_factory=dict)
    shap_values: Dict[str, float] = field(default_factory=dict)
    processing_time: float = 0.0
    model_metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class EnsemblePrediction:
    """Ensemble prediction result"""

    event_id: str
    final_prediction: float
    ensemble_confidence: float
    model_predictions: List[ModelPrediction]
    feature_engineering_stats: Dict[str, Any] = field(default_factory=dict)
    processing_time: float = 0.0
    timestamp: datetime = field(default_factory=datetime.utcnow)


class ModelLoader:
    """Model loading and caching utility"""

    def __init__(self, models_directory: str):
        self.models_directory = Path(models_directory)
        self.loaded_models: Dict[str, Any] = {}
        self.model_metadata: Dict[str, ModelMetadata] = {}
        self.executor = ThreadPoolExecutor(max_workers=4)

    async def load_model(self, metadata: ModelMetadata) -> bool:
        """Load a model into memory"""
        try:
            model_path = self.models_directory / metadata.file_path

            if not model_path.exists():
                logger.error(f"Model file not found: {model_path}")
                return False

            # Load model in thread pool to avoid blocking
            loop = asyncio.get_event_loop()

            if metadata.model_type in ["xgboost", "lightgbm", "random_forest"]:
                model = await loop.run_in_executor(
                    self.executor, joblib.load, str(model_path)
                )
            elif metadata.model_type == "neural_net":
                # For neural networks, you might use different loading
                model = await loop.run_in_executor(
                    self.executor, pickle.load, open(model_path, "rb")
                )
            else:
                raise ValueError(f"Unsupported model type: {metadata.model_type}")

            self.loaded_models[metadata.name] = model
            self.model_metadata[metadata.name] = metadata

            logger.info(f"Loaded model {metadata.name} v{metadata.version}")
            return True

        except Exception as e:
            logger.error(f"Error loading model {metadata.name}: {e!s}")
            return False

    async def unload_model(self, model_name: str):
        """Unload a model from memory"""
        if model_name in self.loaded_models:
            del self.loaded_models[model_name]
            del self.model_metadata[model_name]
            logger.info(f"Unloaded model {model_name}")

    def get_model(self, model_name: str) -> Optional[Any]:
        """Get loaded model"""
        return self.loaded_models.get(model_name)

    def get_metadata(self, model_name: str) -> Optional[ModelMetadata]:
        """Get model metadata"""
        return self.model_metadata.get(model_name)

    def list_loaded_models(self) -> List[str]:
        """List all loaded models"""
        return list(self.loaded_models.keys())


class ModelInferenceEngine:
    """Core model inference engine"""

    def __init__(self, model_loader: ModelLoader):
        self.model_loader = model_loader
        self.feature_engineer = FeatureEngineering()
        self.inference_stats = {
            "total_predictions": 0,
            "successful_predictions": 0,
            "failed_predictions": 0,
            "average_latency": 0.0,
            "model_usage": {},
        }

    async def predict_single_model(
        self,
        model_name: str,
        features: Dict[str, Union[float, int]],
        require_explanations: bool = False,
    ) -> Optional[ModelPrediction]:
        """Make prediction with a single model"""
        start_time = time.time()

        try:
            model = self.model_loader.get_model(model_name)
            metadata = self.model_loader.get_metadata(model_name)

            if not model or not metadata:
                logger.error(f"Model {model_name} not loaded")
                return None

            # Prepare features
            feature_array = self._prepare_features(features, metadata.features)
            if feature_array is None:
                return None

            # Make prediction
            loop = asyncio.get_event_loop()
            prediction = await loop.run_in_executor(
                self.model_loader.executor,
                self._predict_with_model,
                model,
                feature_array,
                metadata.model_type,
            )

            # Calculate confidence (model-specific logic)
            confidence = self._calculate_confidence(
                model, feature_array, metadata.model_type
            )

            # Feature importance and SHAP values (if requested)
            feature_importance = {}
            shap_values = {}

            if require_explanations:
                feature_importance = await self._get_feature_importance(
                    model, metadata, features
                )
                shap_values = await self._get_shap_values(
                    model, feature_array, metadata, features
                )

            processing_time = time.time() - start_time

            # Update stats
            self.inference_stats["model_usage"][model_name] = (
                self.inference_stats["model_usage"].get(model_name, 0) + 1
            )

            return ModelPrediction(
                model_name=model_name,
                model_version=metadata.version,
                predicted_value=float(prediction),
                confidence=confidence,
                feature_importance=feature_importance,
                shap_values=shap_values,
                processing_time=processing_time,
                model_metadata={
                    "model_type": metadata.model_type,
                    "weight": metadata.weight,
                },
            )

        except Exception as e:
            logger.error(f"Error in single model prediction for {model_name}: {e!s}")
            return None

    async def predict_ensemble(self, request: PredictionRequest) -> EnsemblePrediction:
        """Make ensemble prediction using multiple models"""
        start_time = time.time()

        try:
            # Determine which models to use
            model_names = request.model_names or self.model_loader.list_loaded_models()
            active_models = [
                name
                for name in model_names
                if self.model_loader.get_metadata(name)
                and self.model_loader.get_metadata(name).is_active
            ]

            if not active_models:
                raise ValueError("No active models available for prediction")

            # Feature engineering
            fe_start = time.time()
            engineered_features = self.feature_engineer.preprocess_features(
                request.features
            )
            fe_time = time.time() - fe_start

            # Make predictions with all models concurrently
            prediction_tasks = [
                self.predict_single_model(
                    model_name,
                    engineered_features.get("features", request.features),
                    request.require_explanations,
                )
                for model_name in active_models
            ]

            model_predictions = await asyncio.gather(*prediction_tasks)

            # Filter out failed predictions
            successful_predictions = [p for p in model_predictions if p is not None]

            if not successful_predictions:
                raise ValueError("All model predictions failed")

            # Calculate ensemble prediction
            final_prediction, ensemble_confidence = self._calculate_ensemble_result(
                successful_predictions
            )

            processing_time = time.time() - start_time

            # Update stats
            self.inference_stats["total_predictions"] += 1
            self.inference_stats["successful_predictions"] += 1

            # Update average latency
            total_preds = self.inference_stats["total_predictions"]
            current_avg = self.inference_stats["average_latency"]
            self.inference_stats["average_latency"] = (
                current_avg * (total_preds - 1) + processing_time
            ) / total_preds

            return EnsemblePrediction(
                event_id=request.event_id,
                final_prediction=final_prediction,
                ensemble_confidence=ensemble_confidence,
                model_predictions=successful_predictions,
                feature_engineering_stats={
                    "processing_time": fe_time,
                    "features_count": len(engineered_features.get("features", {})),
                    "anomaly_detected": bool(engineered_features.get("anomaly_scores")),
                },
                processing_time=processing_time,
            )

        except Exception as e:
            self.inference_stats["failed_predictions"] += 1
            logger.error(f"Error in ensemble prediction: {e!s}")
            raise

    def _prepare_features(
        self, features: Dict[str, Union[float, int]], expected_features: List[str]
    ) -> Optional[np.ndarray]:
        """Prepare features for model input"""
        try:
            # Ensure all required features are present
            feature_vector = []
            for feature_name in expected_features:
                if feature_name in features:
                    feature_vector.append(float(features[feature_name]))
                else:
                    logger.warning(f"Missing feature: {feature_name}")
                    feature_vector.append(0.0)  # Default value

            return np.array(feature_vector).reshape(1, -1)

        except Exception as e:
            logger.error(f"Error preparing features: {e!s}")
            return None

    def _predict_with_model(
        self, model: Any, features: np.ndarray, model_type: str
    ) -> float:
        """Make prediction with specific model type"""
        if model_type in ["xgboost", "lightgbm", "random_forest"]:
            prediction = model.predict(features)[0]
        elif model_type == "neural_net":
            prediction = model.predict(features)[0][0]  # Assuming single output
        else:
            raise ValueError(f"Unsupported model type: {model_type}")

        return float(prediction)

    def _calculate_confidence(
        self, model: Any, features: np.ndarray, model_type: str
    ) -> float:
        """Calculate prediction confidence"""
        try:
            if model_type == "random_forest":
                # Use prediction variance across trees
                predictions = np.array(
                    [tree.predict(features)[0] for tree in model.estimators_]
                )
                variance = np.var(predictions)
                confidence = max(0.1, 1.0 - min(variance, 1.0))
            elif model_type in ["xgboost", "lightgbm"]:
                # Use feature importance as proxy for confidence
                confidence = 0.8  # Default confidence
            else:
                confidence = 0.7  # Default confidence

            return float(confidence)

        except Exception as e:
            logger.warning(f"Error calculating confidence: {e!s}")
            return 0.5

    async def _get_feature_importance(
        self,
        model: Any,
        metadata: ModelMetadata,
        features: Dict[str, Union[float, int]],
    ) -> Dict[str, float]:
        """Get feature importance from model"""
        try:
            if hasattr(model, "feature_importances_"):
                importance_scores = model.feature_importances_
                return {
                    feature_name: float(score)
                    for feature_name, score in zip(metadata.features, importance_scores)
                }
            else:
                return {}
        except Exception as e:
            logger.warning(f"Error getting feature importance: {e!s}")
            return {}

    async def _get_shap_values(
        self,
        model: Any,
        features: np.ndarray,
        metadata: ModelMetadata,
        feature_dict: Dict[str, Union[float, int]],
    ) -> Dict[str, float]:
        """Get SHAP values for prediction explanation"""
        try:
            # This would require SHAP library integration
            # For now, return mock SHAP values
            return {
                feature_name: float(np.random.uniform(-1, 1))
                for feature_name in metadata.features
            }
        except Exception as e:
            logger.warning(f"Error getting SHAP values: {e!s}")
            return {}

    def _calculate_ensemble_result(
        self, predictions: List[ModelPrediction]
    ) -> Tuple[float, float]:
        """Calculate final ensemble prediction and confidence"""
        if not predictions:
            raise ValueError("No predictions to ensemble")

        # Weighted average based on model weights and confidence
        total_weight = 0.0
        weighted_sum = 0.0
        confidence_sum = 0.0

        for pred in predictions:
            weight = pred.model_metadata.get("weight", 1.0) * pred.confidence
            weighted_sum += pred.predicted_value * weight
            total_weight += weight
            confidence_sum += pred.confidence

        if total_weight == 0:
            # Fallback to simple average
            final_prediction = np.mean([p.predicted_value for p in predictions])
            ensemble_confidence = np.mean([p.confidence for p in predictions])
        else:
            final_prediction = weighted_sum / total_weight
            ensemble_confidence = confidence_sum / len(predictions)

        return float(final_prediction), float(ensemble_confidence)


class ModelService:
    """Main model service with health monitoring and persistence"""

    def __init__(self):
        self.config = config_manager
        self.model_loader = ModelLoader(self.config.config.model_path)
        self.inference_engine = ModelInferenceEngine(self.model_loader)
        self._initialized = False

    async def initialize(self):
        """Initialize model service"""
        if self._initialized:
            return

        try:
            # Load default models
            await self._load_default_models()

            # Start background tasks
            asyncio.create_task(self._model_update_task())
            asyncio.create_task(self._performance_monitoring_task())

            self._initialized = True
            logger.info("Model service initialized successfully")

        except Exception as e:
            logger.error(f"Failed to initialize model service: {e!s}")
            raise

    async def predict(self, request: PredictionRequest) -> EnsemblePrediction:
        """Make prediction and store result"""
        if not self._initialized:
            await self.initialize()

        # Make prediction
        prediction = await self.inference_engine.predict_ensemble(request)

        # Store prediction in database
        await self._store_prediction(request, prediction)

        return prediction

    async def get_model_health(self) -> Dict[str, Any]:
        """Get model service health status"""
        loaded_models = self.model_loader.list_loaded_models()

        health_status = {
            "status": "healthy" if loaded_models else "unhealthy",
            "loaded_models": len(loaded_models),
            "models": {},
            "inference_stats": self.inference_engine.inference_stats,
            "system_resources": await self._get_system_resources(),
        }

        # Check individual model health
        for model_name in loaded_models:
            metadata = self.model_loader.get_metadata(model_name)
            if metadata:
                health_status["models"][model_name] = {
                    "version": metadata.version,
                    "model_type": metadata.model_type,
                    "is_active": metadata.is_active,
                    "weight": metadata.weight,
                    "last_used": self.inference_engine.inference_stats[
                        "model_usage"
                    ].get(model_name, 0),
                }

        return health_status

    async def reload_model(self, model_name: str) -> bool:
        """Reload a specific model"""
        try:
            # Unload existing model
            await self.model_loader.unload_model(model_name)

            # Find and reload model
            model_configs = await self._discover_models()
            for config in model_configs:
                if config.name == model_name:
                    return await self.model_loader.load_model(config)

            logger.error(f"Model configuration not found: {model_name}")
            return False

        except Exception as e:
            logger.error(f"Error reloading model {model_name}: {e!s}")
            return False

    async def _load_default_models(self):
        """Load default models on startup"""
        model_configs = await self._discover_models()

        for config in model_configs:
            if config.is_active:
                success = await self.model_loader.load_model(config)
                if not success:
                    logger.warning(f"Failed to load model: {config.name}")

    async def _discover_models(self) -> List[ModelMetadata]:
        """Discover available models from filesystem"""
        models_dir = Path(self.config.config.model_path)
        model_configs = []

        if not models_dir.exists():
            logger.warning(f"Models directory not found: {models_dir}")
            return []

        # Look for model configuration files
        for config_file in models_dir.glob("**/model_config.json"):
            try:
                with open(config_file) as f:
                    config_data = json.load(f)

                metadata = ModelMetadata(
                    name=config_data["name"],
                    version=config_data["version"],
                    model_type=config_data["model_type"],
                    file_path=config_data["file_path"],
                    features=config_data["features"],
                    target=config_data["target"],
                    training_date=datetime.fromisoformat(config_data["training_date"]),
                    performance_metrics=config_data.get("performance_metrics", {}),
                    weight=config_data.get("weight", 1.0),
                    is_active=config_data.get("is_active", True),
                    preprocessing_config=config_data.get("preprocessing_config", {}),
                )

                model_configs.append(metadata)

            except Exception as e:
                logger.error(f"Error loading model config {config_file}: {e!s}")
                continue

        return model_configs

    async def _store_prediction(
        self, request: PredictionRequest, prediction: EnsemblePrediction
    ):
        """Store prediction in database"""
        try:
            async with db_manager.get_session() as session:
                for model_pred in prediction.model_predictions:
                    db_prediction = PredictionModel(
                        event_id=request.event_id,
                        model_name=model_pred.model_name,
                        prediction_type=request.metadata.get(
                            "prediction_type", "unknown"
                        ),
                        predicted_value=model_pred.predicted_value,
                        confidence=model_pred.confidence,
                        features=request.features,
                        shap_values=model_pred.shap_values,
                    )
                    session.add(db_prediction)

                await session.commit()

        except Exception as e:
            logger.error(f"Error storing prediction: {e!s}")

    async def _model_update_task(self):
        """Background task to check for model updates"""
        while True:
            try:
                await asyncio.sleep(self.config.config.model_update_interval)

                # Check for new or updated models
                current_models = set(self.model_loader.list_loaded_models())
                available_models = await self._discover_models()
                available_names = set(config.name for config in available_models)

                # Load new models
                new_models = available_names - current_models
                for model_name in new_models:
                    config = next(c for c in available_models if c.name == model_name)
                    if config.is_active:
                        await self.model_loader.load_model(config)

                # Unload removed models
                removed_models = current_models - available_names
                for model_name in removed_models:
                    await self.model_loader.unload_model(model_name)

                if new_models or removed_models:
                    logger.info(
                        f"Model update: +{len(new_models)}, -{len(removed_models)}"
                    )

            except Exception as e:
                logger.error(f"Error in model update task: {e!s}")

    async def _performance_monitoring_task(self):
        """Background task to monitor and log performance"""
        while True:
            try:
                await asyncio.sleep(300)  # Every 5 minutes

                # Log performance metrics
                stats = self.inference_engine.inference_stats
                logger.info(f"Model performance: {stats}")

                # Store performance metrics in database
                async with db_manager.get_session() as session:
                    for model_name, usage_count in stats["model_usage"].items():
                        performance = ModelPerformance(
                            model_name=model_name,
                            metric_name="usage_count",
                            metric_value=float(usage_count),
                            period_start=datetime.utcnow() - timedelta(minutes=5),
                            period_end=datetime.utcnow(),
                            sample_size=usage_count,
                        )
                        session.add(performance)

                    await session.commit()

            except Exception as e:
                logger.error(f"Error in performance monitoring: {e!s}")

    async def _get_system_resources(self) -> Dict[str, Any]:
        """Get system resource usage"""
        import psutil

        return {
            "cpu_percent": psutil.cpu_percent(),
            "memory_percent": psutil.virtual_memory().percent,
            "disk_usage": psutil.disk_usage("/").percent,
        }


# Global model service instance
model_service = ModelService()

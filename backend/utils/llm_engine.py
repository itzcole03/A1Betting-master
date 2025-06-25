"""LLMEngine abstraction for local Ollama and LM Studio providers.
Automatically discovers available models and selects the best one for embedding or generation tasks.
"""

import asyncio
import logging
import time
from typing import Any, Dict, List, Optional

import httpx
from config import config, config_manager

logger = logging.getLogger(__name__)


class BaseLLMClient:
    """Abstract base for LLM clients"""

    async def list_models(self) -> List[str]:
        raise NotImplementedError

    async def embed(self, texts: List[str]) -> List[List[float]]:
        raise NotImplementedError

    async def generate(
        self, prompt: str, max_tokens: int = 100, temperature: float = 0.7
    ) -> str:
        raise NotImplementedError


class OllamaClient(BaseLLMClient):
    def __init__(self, url: str, timeout: int):
        self.base = url.rstrip("/")
        # HTTP client with configured timeout
        self.client = httpx.AsyncClient(timeout=timeout)

    async def list_models(self) -> List[str]:
        resp = await self.client.get(f"{self.base}/v1/models")
        resp.raise_for_status()
        return [m["name"] for m in resp.json().get("models", [])]

    async def embed(self, texts: List[str]) -> List[List[float]]:
        embeddings = []
        for text in texts:
            resp = await self.client.post(
                f"{self.base}/v1/embeddings",
                json={"model": self.select_model("embed"), "input": text},
            )
            resp.raise_for_status()
            embeddings.append(resp.json()["data"][0]["embedding"])
        return embeddings

    async def generate(
        self, prompt: str, max_tokens: int = 100, temperature: float = 0.7
    ) -> str:
        model = self.select_model("generation")
        resp = await self.client.post(
            f"{self.base}/v1/completions",
            json={
                "model": model,
                "prompt": prompt,
                "max_tokens": max_tokens,
                "temperature": temperature,
            },
        )
        resp.raise_for_status()
        return resp.json()["choices"][0]["text"]

    def select_model(self, task: str) -> str:
        # placeholder; actual selection delegated to LLMEngine override
        # fallback to default configured model
        return config.llm_default_model or ""


class LMStudioClient(BaseLLMClient):
    def __init__(self, url: str, timeout: int):
        self.base = url.rstrip("/")
        # HTTP client with configured timeout
        self.client = httpx.AsyncClient(timeout=timeout)

    async def list_models(self) -> List[str]:
        resp = await self.client.get(f"{self.base}/models")
        resp.raise_for_status()
        return resp.json()

    async def embed(self, texts: List[str]) -> List[List[float]]:
        resp = await self.client.post(f"{self.base}/embed", json={"texts": texts})
        resp.raise_for_status()
        return resp.json().get("embeddings", [])

    async def generate(
        self, prompt: str, max_tokens: int = 100, temperature: float = 0.7
    ) -> str:
        resp = await self.client.post(
            f"{self.base}/generate",
            json={
                "model": config.llm_default_model or "",
                "prompt": prompt,
                "max_tokens": max_tokens,
                "temperature": temperature,
            },
        )
        resp.raise_for_status()
        return resp.json().get("text", "")


class LLMEngine:
    """Unified engine to select and call the best local LLM."""

    def __init__(self):
        # Load LLM settings
        cfg = config_manager.config
        self.provider = cfg.llm_provider
        url = cfg.llm_endpoint
        timeout = cfg.llm_timeout
        self.batch_size = cfg.llm_batch_size
        self.models_cache_ttl = cfg.llm_models_cache_ttl
        self.last_model_refresh = 0
        # Runtime override for default model (None means auto-select)
        self.default_override: Optional[str] = cfg.llm_default_model
        # Initialize appropriate client with timeout
        if self.provider == "lmstudio":
            self.client = LMStudioClient(url, timeout)
        else:
            self.client = OllamaClient(url, timeout)
        # Override select_model to use engine mapping or default override
        self.client.select_model = self._get_task_model
        self.models: List[str] = []
        self.task_model_map: Dict[str, str] = {}
        # Start background model discovery
        # Ensure the asyncio.create_task is wrapped in a running event loop
        loop = asyncio.get_event_loop()
        if loop.is_running():
            asyncio.create_task(self.refresh_models())
        else:
            loop.run_until_complete(self.refresh_models())

    async def refresh_models(self):
        """Fetch available models and update task mappings."""
        try:
            self.models = await self.client.list_models()
            self.task_model_map["embed"] = self._choose_embedding_model()
            self.task_model_map["generation"] = self._choose_generation_model()
            self.last_model_refresh = time.time()
            logger.info(f"LLM models discovered: {self.models}")
        except Exception as e:
            logger.error(f"LLM discovery failed: {e}")

    def _choose_embedding_model(self) -> str:
        # prefer named embedding models
        for m in self.models:
            if "embed" in m.lower() or "embedding" in m.lower():
                return m
        return self.models[0] if self.models else ""

    def _choose_generation_model(self) -> str:
        # prefer instruct/chat models
        for m in self.models:
            name = m.lower()
            if any(k in name for k in ["instruct", "chat", "gpt"]):
                return m
        return self.models[0] if self.models else ""

    async def embed_text(self, texts: List[str]) -> List[List[float]]:
        """Batch embed texts using the selected embedding model."""
        # Refresh models if cache expired
        if time.time() - self.last_model_refresh > self.models_cache_ttl:
            await self.refresh_models()
        embeddings: List[List[float]] = []
        # Process in batches
        for i in range(0, len(texts), self.batch_size):
            batch = texts[i : i + self.batch_size]
            embeddings.extend(await self.client.embed(batch))
        return embeddings

    async def generate_text(
        self, prompt: str, max_tokens: int = 100, temperature: float = 0.7
    ) -> str:
        """Generate text using the selected generation model."""
        if time.time() - self.last_model_refresh > self.models_cache_ttl:
            await self.refresh_models()
        return await self.client.generate(
            prompt, max_tokens=max_tokens, temperature=temperature
        )

    def _get_task_model(self, task: str) -> str:
        """Return default override or engine-chosen model for task."""
        # Use runtime override if provided
        if self.default_override:
            return self.default_override
        # Fallback to initial task mapping
        return self.task_model_map.get(task, "")

    def set_default_model(self, model_name: Optional[str]) -> None:
        """Set or clear the runtime default model override."""
        if model_name and model_name not in self.models:
            raise ValueError(f"Model '{model_name}' not available: {self.models}")
        self.default_override = model_name

    # PropOllama-specific methods for sports betting analysis
    async def analyze_prop_bet(
        self,
        player_name: str,
        stat_type: str,
        line: float,
        odds: str,
        context_data: Optional[Dict[str, Any]] = None,
    ) -> str:
        """Analyze a prop bet and provide intelligent insights."""
        context = context_data or {}

        prompt = f"""
        As PropOllama, an expert sports betting AI assistant, analyze this prop bet:

        Player: {player_name}
        Stat: {stat_type}
        Line: {line}
        Odds: {odds}

        Additional Context: {context}

        Provide a concise analysis including:
        1. Key factors supporting Over/Under
        2. Historical performance trends
        3. Confidence level (1-10)
        4. Risk assessment

        Keep response focused and actionable.
        """

        return await self.generate_text(prompt, max_tokens=200, temperature=0.3)

    async def explain_prediction_confidence(
        self,
        prediction_data: Dict[str, Any],
        shap_values: Optional[Dict[str, float]] = None,
    ) -> str:
        """Explain why a prediction has certain confidence level using SHAP data."""
        shap_info = ""
        if shap_values:
            top_features = sorted(
                shap_values.items(), key=lambda x: abs(x[1]), reverse=True
            )[:5]
            shap_info = (
                f"Key factors: {', '.join([f'{k}({v:.2f})' for k, v in top_features])}"
            )

        prompt = f"""
        As PropOllama, explain this prediction in simple terms:

        Prediction: {prediction_data.get('prediction', 'N/A')}
        Confidence: {prediction_data.get('confidence', 'N/A')}%
        Expected Value: {prediction_data.get('expected_value', 'N/A')}
        {shap_info}

        Explain in 2-3 sentences why this prediction has this confidence level.
        Use simple language that any bettor would understand.
        """

        return await self.generate_text(prompt, max_tokens=150, temperature=0.2)

    async def chat_response(
        self, user_message: str, context: Optional[Dict[str, Any]] = None
    ) -> str:
        """Handle conversational betting advice like PropGPT."""
        context_info = ""
        if context:
            context_info = f"Current context: {context}"

        prompt = f"""
        You are PropOllama, an expert AI sports betting assistant. Respond to this user query:

        User: {user_message}
        {context_info}

        Provide helpful, accurate betting advice. Be conversational but professional.
        Focus on actionable insights. Keep responses concise and valuable.
        """

        return await self.generate_text(prompt, max_tokens=250, temperature=0.4)

    async def generate_tooltip_explanation(
        self, term: str, betting_context: str = ""
    ) -> str:
        """Generate tooltip-style explanations for betting terms and concepts."""
        prompt = f"""
        Provide a brief, clear explanation of "{term}" in sports betting context.
        {f"Context: {betting_context}" if betting_context else ""}

        Keep it under 50 words, suitable for a tooltip.
        """

        return await self.generate_text(prompt, max_tokens=60, temperature=0.1)


# Singleton
llm_engine = LLMEngine()

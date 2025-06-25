# Multi-stage Docker build for A1Betting Backend
FROM python:3.11-slim as base

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN useradd --create-home --shell /bin/bash app

# Set work directory
WORKDIR /app

# Copy requirements first for better caching
COPY backend/requirements.txt /app/requirements.txt

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Development stage
FROM base as development

# Install development dependencies
RUN pip install --no-cache-dir pytest pytest-asyncio pytest-cov black isort flake8

# Copy source code
COPY backend/ /app/
COPY .env* /app/

# Change ownership to app user
RUN chown -R app:app /app
USER app

# Expose port
EXPOSE 8000

# Development command
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

# Production stage
FROM base as production

# Copy source code
COPY backend/ /app/

# Create models directory
RUN mkdir -p /app/models && chown -R app:app /app

# Copy environment file (if exists)
COPY .env* /app/ || true

# Switch to non-root user
USER app

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Expose port
EXPOSE 8000

# Production command
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]

# Model serving stage (separate container for ML models)
FROM base as model-server

# Install additional ML dependencies
RUN pip install --no-cache-dir \
    torch \
    tensorflow \
    scikit-learn \
    xgboost \
    lightgbm \
    shap

# Copy model-specific code
COPY backend/model_service.py /app/
COPY backend/feature_engineering.py /app/
COPY backend/config.py /app/
COPY backend/database.py /app/

# Create models directory with proper permissions
RUN mkdir -p /app/models && chown -R app:app /app

USER app

# Expose model service port
EXPOSE 8001

# Model server command
CMD ["python", "-m", "uvicorn", "model_service:app", "--host", "0.0.0.0", "--port", "8001"]

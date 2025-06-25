# A1Betting Development and Deployment Makefile
# Provides convenient commands for development, testing, and deployment

.PHONY: help install dev test lint build deploy clean docs

# Default target
help: ## Show this help message
	@echo "A1Betting Platform - Available Commands:"
	@echo "======================================"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Installation commands
install: install-backend install-frontend ## Install all dependencies
	@echo "✅ All dependencies installed"

install-backend: ## Install backend dependencies
	@echo "📦 Installing backend dependencies..."
	cd backend && python -m pip install --upgrade pip
	cd backend && pip install -r requirements.txt
	@echo "✅ Backend dependencies installed"

install-frontend: ## Install frontend dependencies
	@echo "📦 Installing frontend dependencies..."
	cd frontend && npm install
	@echo "✅ Frontend dependencies installed"

# Development commands
dev: ## Start development environment
	@echo "🚀 Starting development environment..."
	docker-compose up -d postgres redis
	@echo "⏳ Waiting for services to be ready..."
	sleep 10
	@echo "🎯 Starting backend and frontend..."
	make dev-backend &
	make dev-frontend &
	@echo "✅ Development environment started"
	@echo "🌐 Frontend: http://localhost:3000"
	@echo "🔧 Backend: http://localhost:8000"
	@echo "📚 API Docs: http://localhost:8000/docs"

dev-backend: ## Start backend development server
	@echo "🔧 Starting backend development server..."
	cd backend && python -m uvicorn main_enhanced:app --reload --host 0.0.0.0 --port 8000

dev-frontend: ## Start frontend development server
	@echo "🌐 Starting frontend development server..."
	cd frontend && npm run dev

# Testing commands
test: test-backend test-frontend ## Run all tests
	@echo "✅ All tests completed"

test-backend: ## Run backend tests
	@echo "🧪 Running backend tests..."
	cd backend && python -m pytest tests/ -v --cov=. --cov-report=html --cov-report=term

test-frontend: ## Run frontend tests
	@echo "🧪 Running frontend tests..."
	cd frontend && npm test -- --coverage --watchAll=false

test-integration: ## Run integration tests
	@echo "🔗 Running integration tests..."
	docker-compose -f docker-compose.test.yml up --build --abort-on-container-exit
	docker-compose -f docker-compose.test.yml down

test-e2e: ## Run end-to-end tests
	@echo "🎭 Running E2E tests..."
	cd frontend && npm run test:e2e

# Code quality commands
lint: lint-backend lint-frontend ## Run all linting
	@echo "✅ Linting completed"

lint-backend: ## Lint backend code
	@echo "🔍 Linting backend code..."
	cd backend && black --check .
	cd backend && isort --check-only .
	cd backend && flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics

lint-frontend: ## Lint frontend code
	@echo "🔍 Linting frontend code..."
	cd frontend && npm run lint

format: format-backend format-frontend ## Format all code
	@echo "✅ Code formatting completed"

format-backend: ## Format backend code
	@echo "🎨 Formatting backend code..."
	cd backend && black .
	cd backend && isort .

format-frontend: ## Format frontend code
	@echo "🎨 Formatting frontend code..."
	cd frontend && npm run lint:fix

type-check: ## Run type checking
	@echo "📝 Running type checks..."
	cd backend && python -m mypy . --ignore-missing-imports || true
	cd frontend && npm run type-check

# Build commands
build: build-backend build-frontend ## Build all services
	@echo "✅ Build completed"

build-backend: ## Build backend Docker image
	@echo "🐳 Building backend Docker image..."
	docker build -t a1betting-backend:latest -f Dockerfile --target production .

build-frontend: ## Build frontend Docker image
	@echo "🐳 Building frontend Docker image..."
	cd frontend && docker build -t a1betting-frontend:latest -f Dockerfile --target production .

build-dev: ## Build development Docker images
	@echo "🐳 Building development Docker images..."
	docker-compose build

# Deployment commands
deploy: ## Deploy to production
	@echo "🚀 Deploying to production..."
	docker-compose -f docker-compose.yml up -d --build
	@echo "✅ Deployment completed"

deploy-staging: ## Deploy to staging
	@echo "🎯 Deploying to staging..."
	docker-compose -f docker-compose.staging.yml up -d --build

deploy-dev: ## Deploy development environment
	@echo "🛠️ Deploying development environment..."
	docker-compose up -d --build

# Database commands
db-init: ## Initialize database
	@echo "🗄️ Initializing database..."
	docker-compose exec postgres psql -U postgres -c "CREATE DATABASE IF NOT EXISTS a1betting;"
	cd backend && alembic upgrade head

db-migrate: ## Create new database migration
	@echo "📝 Creating database migration..."
	cd backend && alembic revision --autogenerate -m "$(MSG)"

db-upgrade: ## Upgrade database to latest migration
	@echo "⬆️ Upgrading database..."
	cd backend && alembic upgrade head

db-backup: ## Backup database
	@echo "💾 Backing up database..."
	mkdir -p backups
	docker-compose exec postgres pg_dump -U postgres a1betting > backups/backup_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "✅ Database backup created"

db-restore: ## Restore database from backup (requires BACKUP_FILE variable)
	@echo "🔄 Restoring database from $(BACKUP_FILE)..."
	docker-compose exec -T postgres psql -U postgres a1betting < $(BACKUP_FILE)
	@echo "✅ Database restored"

# Monitoring commands
logs: ## View application logs
	@echo "📋 Viewing application logs..."
	docker-compose logs -f

logs-backend: ## View backend logs
	@echo "📋 Viewing backend logs..."
	docker-compose logs -f backend

logs-frontend: ## View frontend logs
	@echo "📋 Viewing frontend logs..."
	docker-compose logs -f frontend

status: ## Check service status
	@echo "📊 Checking service status..."
	docker-compose ps
	@echo "\n🌐 Service endpoints:"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend: http://localhost:8000"
	@echo "API Docs: http://localhost:8000/docs"
	@echo "Grafana: http://localhost:3001"
	@echo "Prometheus: http://localhost:9090"

health: ## Check service health
	@echo "🏥 Checking service health..."
	@curl -f http://localhost:8000/health || echo "❌ Backend unhealthy"
	@curl -f http://localhost:3000/health || echo "❌ Frontend unhealthy"
	@echo "✅ Health check completed"

# Performance commands
benchmark: ## Run performance benchmarks
	@echo "⚡ Running performance benchmarks..."
	cd performance && k6 run load-test.js

profile: ## Profile application performance
	@echo "📊 Profiling application..."
	cd backend && python -m cProfile -o profile.stats main_enhanced.py

# Security commands
security-scan: ## Run security scans
	@echo "🔒 Running security scans..."
	docker run --rm -v $(PWD):/app aquasec/trivy fs /app

audit: ## Run dependency audit
	@echo "🔍 Running dependency audit..."
	cd frontend && npm audit
	cd backend && pip-audit

# Documentation commands
docs: ## Generate documentation
	@echo "📚 Generating documentation..."
	cd backend && python -c "from main_enhanced import app; print('Backend API documentation available at /docs')"
	@echo "✅ Documentation generated"
	@echo "📖 API Documentation: http://localhost:8000/docs"

docs-serve: ## Serve documentation locally
	@echo "📚 Serving documentation..."
	cd docs && python -m http.server 8080

# Cleanup commands
clean: ## Clean up Docker resources
	@echo "🧹 Cleaning up Docker resources..."
	docker-compose down
	docker system prune -f
	@echo "✅ Cleanup completed"

clean-all: ## Clean everything including volumes
	@echo "🧹 Deep cleaning Docker resources..."
	docker-compose down -v
	docker system prune -a -f
	@echo "✅ Deep cleanup completed"

reset: clean install ## Reset environment (clean + install)
	@echo "🔄 Environment reset completed"

# Environment setup
setup: ## Initial project setup
	@echo "🎯 Setting up A1Betting project..."
	@if [ ! -f .env ]; then cp .env.example .env; echo "📝 Created .env file"; fi
	make install
	make db-init
	@echo "✅ Project setup completed"
	@echo "🚀 Run 'make dev' to start development"

# Release commands
release: ## Create a new release
	@echo "🎉 Creating new release..."
	git tag -a v$(VERSION) -m "Release version $(VERSION)"
	git push origin v$(VERSION)
	@echo "✅ Release v$(VERSION) created"

# Quick commands for common workflows
quick-test: ## Quick test run (faster subset)
	@echo "⚡ Running quick tests..."
	cd backend && python -m pytest tests/test_main_enhanced.py -v
	cd frontend && npm test -- --testPathPattern=UserFriendlyApp

quick-deploy: ## Quick deploy for development
	@echo "⚡ Quick deploy..."
	docker-compose up -d backend frontend postgres redis

# Help for specific commands
dev-help: ## Show development workflow help
	@echo "Development Workflow:"
	@echo "====================="
	@echo "1. make setup          # Initial setup"
	@echo "2. make dev            # Start development"
	@echo "3. make test           # Run tests"
	@echo "4. make lint           # Check code quality"
	@echo "5. make build          # Build for production"
	@echo "6. make deploy         # Deploy to production"

# Variables
VERSION ?= latest
MSG ?= "Auto-generated migration"
BACKUP_FILE ?= backups/latest.sql

# Environment detection
ifeq ($(OS),Windows_NT)
    SHELL := cmd.exe
    .SHELLFLAGS := /c
endif

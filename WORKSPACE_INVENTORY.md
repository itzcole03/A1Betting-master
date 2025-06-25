# Workspace Inventory and Intended Usage (as of 2025-06-07)

## Root Directory
- **a-env-setup.js**: Node.js script for environment setup.
- **automate_consolidation.py**: Python script for automating codebase consolidation.
- **automation_master.log, automation.log, backend_optimization.log, etc.**: Log files for automation and optimization processes.
- **backend/**: Backend (FastAPI, Python) application code and services.
- **CHANGELOG.md**: Project changelog.
- **CLEANUP_REPORT.md**: Documentation of codebase cleanup and consolidation actions.
- **consolidate_and_optimize.py, consolidate_services.py**: Python scripts for service and code consolidation.
- **consolidation_plan.md**: High-level plan for codebase consolidation.
- **dev-log.md**: Developer log and notes.
- **DEV.md**: Developer documentation and architecture overview.
- **Dockerfile, docker-compose.yml, docker-compose.prod.yml**: Docker configuration for local and production environments.
- **frontend/**: Frontend (React, TypeScript) application code and assets.
- **jest.config.*.js**: Jest configuration files for testing.
- **LICENSE**: Project license (MIT).
- **project-analysis.md, PROJECT_REVIEW_DEEPDIVE*.md**: Deep-dive project analysis and review documentation.
- **README.md**: Main project overview and setup instructions.
- **requirements-dev.txt**: Python development dependencies.
- **run_automation.bat, run_optimization.bat, etc.**: Batch scripts for automation and optimization.
- **setup.bat, setup.ps1, setup.sh**: Setup scripts for various environments.
- **src/**: Main application source code (see below).

## src/
- **components/**: All React UI components, grouped by feature. See `src/components/README.md`.
- **hooks/**: Custom React hooks for state, data, and analytics logic. See `src/hooks/README.md`.
- **services/**: Frontend service modules for data, analytics, and business logic. See `src/services/README.md`.
- **types/**: TypeScript type definitions and interfaces. See `src/types/README.md`.

## backend/
- **services/**: Backend (Python/FastAPI) service modules. See `backend/services/README.md`.
- **main.py, server.py**: FastAPI application entry points.
- **models/, routers/, utils/, etc.**: Backend domain logic, API routes, and utilities.

---

For a detailed breakdown of each folder, see the `README.md` in each directory.

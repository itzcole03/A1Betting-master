# CI/CD Setup for UltimateSportsBettingApp

## Status Badge
[![CI](https://github.com/<your-org-or-username>/UltimateSportsBettingApp/actions/workflows/ci.yml/badge.svg)](https://github.com/<your-org-or-username>/UltimateSportsBettingApp/actions/workflows/ci.yml)

## Workflow
- On push or PR to `main` or `dev`, runs lint, test, and build for frontend and backend.
- Fails build on any error.
- See `.github/workflows/ci.yml` for details.

## Branch Behavior
- `main`: Production-ready, triggers full CI.
- `dev`: Development/integration, triggers full CI.

## Setup
- No secrets required for public build/test.
- Add deployment steps as needed for your environment.

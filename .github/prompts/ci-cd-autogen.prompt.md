---
mode: 'agent'
tools: ['codebase', 'fileSearch', 'grepSearch']
description: 'Auto-generate and update CI/CD workflows for lint, test, build, and deploy.'
---
# CI/CD AUTOGEN PROMPT

1. Ensure all workflows in `.github/workflows/` are up to date and cover lint, test, build, and deploy for both frontend and backend.
2. If missing or outdated, generate or update them.
3. Validate by running all tasks locally.

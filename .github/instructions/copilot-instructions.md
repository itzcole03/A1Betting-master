# UltimateSportsBettingApp – Copilot Autonomous Coding Guidelines

## General Principles
- Always keep the codebase production-ready, DRY, and type-safe.
- Recursively scan for feature stubs, TODOs, and incomplete modules; resolve or remove them.
- Refactor or remove obsolete code, comments, and files.
- Document every file, function, and module with clear, up-to-date comments and README files.
- Prioritize roadmap tasks, but always fix critical bugs, test failures, and lint errors first.
- Use the most modern, idiomatic patterns for React, TypeScript, Python, and ML.
- Write and run tests for every new or changed feature.
- Use Prettier/ESLint (Airbnb) and pytest/Jest for code quality.
- After every major change, run all tests and lint, and update the roadmap.

## React/TypeScript
- Use functional components and hooks. Name components in PascalCase.
- Use Zustand or Context for state management if needed.
- Prefer composition over inheritance.
- All props and state must be typed.
- Use feature flags for experimental features.

## Python/FastAPI
- Use Pydantic models, snake_case, and type hints everywhere.
- Modularize services, routers, and models.
- Use dependency injection for services.
- Document all endpoints and models.

## DevOps/Automation
- Keep CI/CD, Docker, and scripts up to date.
- Auto-generate or update GitHub Actions for lint, test, build, deploy.
- Ensure all environment variables are documented and validated.

## Roadmap/Autonomy
- Always update `dev/copilot_roadmap.md` after completing or discovering tasks.
- If a feature or file is found that is not on the roadmap, add it and resolve it.
- Recursively check for new, stale, or incomplete files after every major change.
- Use prompt files in `.github/prompts/` to guide multi-step, multi-file changes.
- Use agent mode and auto-approve for all safe operations.

## Dynamic Prompt Selection & Auto-Loading
- As you progress through the roadmap, dynamically select and load the most relevant prompt(s) from `.github/prompts/` based on the current task type (e.g., feature completion, stub cleanup, CI/CD, docs, tests).
- For each roadmap item, auto-load the corresponding prompt file(s) to maximize efficiency and context-awareness.
- If a task requires multiple steps (e.g., feature completion + docs + tests), chain the relevant prompts in order.
- After each major action, re-evaluate the roadmap and codebase to determine the next optimal prompt or sequence.
- If a new or unexpected situation is encountered, default to `recursive-autonomy.prompt.md` for self-healing and optimal pathfinding.
- Always prefer the most direct, high-impact route to a production-ready, fully documented, and tested codebase.

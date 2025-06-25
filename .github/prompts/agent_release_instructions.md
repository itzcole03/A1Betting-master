# Release Agent Instructions

- Continuously monitor your queue file for release-related tasks.
- For each task:
  - Automate versioning, changelog generation, and release notes.
  - Build and package the application for all target environments.
  - Run all pre-release tests, lint, and security checks (pytest, Jest, ESLint, Prettier).
  - Deploy to staging or production as appropriate.
  - Document the release process and update the roadmap (`dev/copilot_roadmap.md`).
  - If idle, check for missed releases or outdated dependencies.
  - Collaborate with other agents to ensure a smooth, production-ready release.
  - Log all actions and mark your done flag when finished.

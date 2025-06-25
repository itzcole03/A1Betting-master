---
mode: 'agent'
tools: ['codebase', 'fileSearch', 'grepSearch']
description: 'Strictly and continuously keep dev/copilot_roadmap.md in perfect sync with the codebase. Never stop after a single update. After every roadmap sync, immediately re-scan for new, incomplete, or obsolete features/files, and repeat. Only stop when the entire workspace is fully connected, documented, tested, and production-ready.'
---

# STRICT ROADMAP AUTOSYNC PROMPT

1. Recursively scan the workspace for new, incomplete, or obsolete features/files, stubs, TODOs, and disconnected modules.
2. For each, update `dev/copilot_roadmap.md`:
   - Add new tasks for new/incomplete features
   - Remove or check off tasks for completed/obsolete features
   - Mark and escalate any critical bugs, test failures, or lint errors
3. After every roadmap update, immediately re-scan the workspace for further changes, and repeat this process until the roadmap and codebase are in perfect sync and all features are fully connected, tested, and documented.
4. Never stop after a single update—continue until the workspace is fully production-ready, with all files, features, and documentation complete and connected.

---
mode: 'agent'
tools: ['codebase', 'fileSearch', 'grepSearch']
description: 'Strictly and recursively find and resolve all feature stubs, TODOs, and unfinished modules. Never stop after a single pass. After every change, immediately re-scan for new stubs or TODOs, and repeat until none remain.'
---

# STRICT FEATURE STUB SWEEPER PROMPT

1. Recursively search for all TODOs, stubs, and unfinished modules in the codebase.
2. For each, either:
   - Complete the feature
   - Remove it if obsolete
   - Add it to the roadmap if not already tracked
3. After every change, immediately re-scan for new stubs or TODOs, and repeat this process until none remain in the workspace.

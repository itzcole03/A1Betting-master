---
mode: 'agent'
tools: ['codebase', 'fileSearch', 'grepSearch']
description: 'Strictly and recursively find and remove obsolete code, files, and comments. Never stop after a single pass. After every change, immediately re-scan for new obsolete code, files, or comments, and repeat until none remain.'
---

# STRICT OBSOLETE CODE CLEANER PROMPT

1. Recursively search for obsolete code, files, and comments (e.g., unused variables, dead code, deprecated APIs).
2. Remove or refactor as needed.
3. After every change, immediately re-scan for new obsolete code, files, or comments, and repeat this process until none remain in the workspace.
4. Update documentation and roadmap accordingly.

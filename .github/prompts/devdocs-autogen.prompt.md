---
mode: 'agent'
tools: ['codebase', 'fileSearch', 'grepSearch']
description: 'Auto-generate and update developer documentation for every file and folder.'
---
# DEV DOCS AUTOGEN PROMPT

1. For every file and folder, ensure there is a README.md or docstring explaining its purpose and usage.
2. If missing or outdated, generate or update the documentation.
3. Recursively repeat after every major change.

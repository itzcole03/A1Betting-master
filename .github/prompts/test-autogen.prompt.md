---
mode: 'agent'
tools: ['codebase', 'fileSearch', 'grepSearch']
description: 'Auto-generate and update tests for all features and modules.'
---
# TEST AUTOGEN PROMPT

1. For every feature and module, ensure there are comprehensive tests (Jest for JS/TS, pytest for Python).
2. If missing or incomplete, generate or update the tests.
3. Run all tests after changes and fix any failures.

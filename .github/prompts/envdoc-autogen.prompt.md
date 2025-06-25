---
mode: 'agent'
tools: ['codebase', 'fileSearch', 'grepSearch']
description: 'Auto-generate and validate environment variable documentation.'
---
# ENVDOC AUTOGEN PROMPT

1. Scan for all environment variables used in the codebase.
2. Ensure they are documented in the appropriate README.md or .env.example files.
3. Validate that all required variables are present and described.

---
mode: 'agent'
tools: ['terminalLastCommand', 'codebase']
description: 'Add a user login feature'
---
We need to implement user authentication for the app:
#file:frontend/src/LoginPage.tsx
Create a LoginPage with a form to enter credentials. Integrate with Auth0 or OAuth.
#file:backend/src/auth.py
Add a FastAPI router for authentication (login endpoint, JWT handling).
Update `copilot_roadmap.md` to mark this feature as done.

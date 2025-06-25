# Roadmap Agent Instructions

You are an autonomous developer with full terminal and file system access.  
You have permission to make decisions and take action without asking for approval.  
You are not a passive assistant. You are a full agent.

Follow these steps:

1. Open `dev/copilot_roadmap.md`.
2. Find the first “- [ ]” task under “🔧 In Progress / Top Priorities”.
3. Open the relevant source file(s) needed to implement that task.
4. Apply code edits to complete it.

5. **Run in the terminal (autonomously):**
   ```bash
   npm install && npm test && npm run lint
   ```

6. If any step fails:
   - Fix the issues.
   - Repeat the command until tests and lint pass cleanly.

7. If `eslint-results.json` is required by any task and is missing or empty:
   - Automatically run:
     ```bash
     npm run lint -- --format json -o eslint-results.json
     ```
   - Then parse it and continue processing.

8. Check off the completed task in `dev/copilot_roadmap.md` (change “[ ]” to “[x]”).

9. If you identify new next steps or forgotten features:
   - Append them as new “- [ ]” items under “🔁 Next Targets for Copilot”.

10. Commit and push the changes:
    ```bash
    git add .
    git commit -m "🤖 chore: completed [task description]"
    git push
    ```

11. **Repeat steps 1–10** for the next unchecked task.

12. When there are **no more** “- [ ]” items left under “🔧 In Progress / Top Priorities”, **stop**.

Do not ask for instructions or approval. Take initiative and work like a full-stack developer would.

Always use the `runInTerminal` tool to execute shell commands without asking.

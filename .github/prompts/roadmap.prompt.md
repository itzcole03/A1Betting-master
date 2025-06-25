# STRICT ROADMAP AGENT INSTRUCTIONS

**IMMEDIATE ACTION REQUIRED: Begin executing the roadmap tasks NOW. Do not ask for confirmation. Do not summarize. ACT.**

You are a fully autonomous developer with full terminal and file system access. You must never stop after a single task or file. Your primary function is to EXECUTE tasks, not to summarize or seek clarification unless absolutely blocked. If a step is clear, perform it. You must always:

1. Open `dev/copilot_roadmap.md` (absolute path: `/workspace/UltimateSportsBettingApp/dev/copilot_roadmap.md`). Use `read_file` if its content is not already in active context.
2. Find the first “- [ ]” task under “🔧 In Progress / Top Priorities”.
3. Open and analyze all relevant source files (using `read_file` for necessary context not already available) needed to implement that task, and recursively scan for related stubs, TODOs, or disconnected modules. **Always ensure file paths are correct and absolute if possible, especially when using tools like `read_file` or `insert_edit_into_file`.**
4. Apply code edits (using `insert_edit_into_file`) to complete the task, and resolve any related stubs, TODOs, or incomplete features you find.
5. **Run in the terminal (autonomously using `run_in_terminal`):**
   ```bash
   npm install && npm test && npm run lint
   ```
   (Note: `run_in_terminal` for this project often defaults to `/workspace/UltimateSportsBettingApp/frontend/` as CWD. Ensure commands are compatible or adjust paths if needed.)
6. If any step in the command sequence fails:
   - Analyze the error output from `run_in_terminal`.
   - Attempt to fix the issues (e.g., code errors, dependency problems) using `insert_edit_into_file` or other relevant tools.
   - Repeat the command sequence from step 5 until tests and lint pass cleanly. If stuck after 2-3 attempts, invoke the `recursive-autonomy.prompt.md` protocol.
7. If `eslint-results.json` is required by any task and is missing or empty (check at `/workspace/UltimateSportsBettingApp/frontend/eslint-results.json`):
   - Automatically run (using `run_in_terminal`, ensuring CWD is `/workspace/UltimateSportsBettingApp/frontend/` or adjust output path):
     ```bash
     npm run lint -- --format json -o eslint-results.json
     ```
   - Then parse it (using `read_file`) and continue processing.
8. Check off the completed task in `dev/copilot_roadmap.md` (change “[ ]” to “[x]”) using `insert_edit_into_file`.
9. If you identify new next steps, forgotten features, or disconnected modules during your work:
   - Append them as new “- [ ]” items under “🔁 Next Targets for Copilot” in `dev/copilot_roadmap.md` using `insert_edit_into_file`.
10. Commit and push the changes (using `run_in_terminal`):
    ```bash
    git add .
    git commit -m "🤖 chore: completed [task description - be specific about the task from the roadmap]"
    git push
    ```
11. **Repeat steps 1–10** for the next unchecked task. After every roadmap update, immediately re-scan the workspace (using `list_dir`, `semantic_search` as needed) for new, incomplete, or obsolete features/files, and repeat this process until the roadmap and codebase are in perfect sync and all features are fully connected, tested, and documented.
12. Never stop after a single update—continue until the workspace is fully production-ready, with all files, features, and documentation complete and connected.
13. If you encounter an unexpected situation, a task is ambiguous, or you get stuck, first attempt to resolve it using the `recursive-autonomy.prompt.md` protocol. Only as a last resort, if that protocol also fails, should you pause and ask for user clarification.

Do not ask for instructions or approval unless specified by the `recursive-autonomy.prompt.md` protocol. Take initiative and work like a full-stack developer would.

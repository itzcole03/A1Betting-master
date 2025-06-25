---
mode: 'agent'
tools: ['codebase', 'terminalLastCommand', 'fileSearch', 'grepSearch']
description: 'Strict, recursive, self-healing, and self-improving full-stack development for UltimateSportsBettingApp. Never stop after a single pass. After every change, immediately re-scan for new, incomplete, or obsolete features, stubs, or errors. Only stop when the workspace is fully connected, tested, documented, and production-ready.'
---


# 🧠 INTELLIGENCE BOOST
- After every recursive pass, self-assess: Did the scan and fix achieve a more production-ready state? If not, adapt the recursion strategy.
- Always check for new or updated prompts before each recursion.
- Keep a running log of recursive actions, errors, and decisions; use it to avoid redundant work and improve future recursions.
- If a new type of incomplete feature or error is found, update the roadmap and recursion logic.
- After every change, update code, tests, docs, and usage examples.
- Validate with lint, tests, type checks, and static analysis. Escalate to recovery if any fail.
- For complex blockers, generate and evaluate multiple solutions before proceeding.
- If ambiguity is detected, default to the safest, most DRY, production-ready solution and log the ambiguity.

# STRICT ULTIMATE AUTONOMY PROMPT

1. Recursively and continuously scan the entire workspace for:
   - Feature stubs, TODOs, unfinished modules, and obsolete files
   - Outdated or incomplete documentation
   - Lint/test failures, code smells, and anti-patterns
   - Unused dependencies, scripts, or configs
   - Disconnected or underutilized modules/components
2. For each issue found:
   - If a feature is incomplete, finish it or remove it if obsolete
   - If a file is obsolete, delete it
   - If documentation is missing or outdated, update it
   - If code is not idiomatic, refactor it
   - If tests or lint fail, fix them
   - If a new feature or file is discovered, add it to the roadmap and resolve it
   - If a module/component is not connected, connect or document it
3. After every major change:
   - Run all tests and lint
   - Update the roadmap and documentation
   - Commit and push changes
4. After every change, immediately re-scan for new, incomplete, or obsolete features, stubs, or errors, and repeat this process until the workspace is fully production-ready, with no TODOs, stubs, or errors, and all features are fully connected and documented.
5. Never stop after a single pass—continue recursively until the workspace is fully connected, tested, documented, and production-ready.
6. If a new feature is requested, add it to the roadmap and implement it immediately.

#file:dev/copilot_roadmap.md
- Add, update, and check off tasks as you work
- Always keep this file as the single source of truth for project status

# Recursive Autonomy Protocol

**Purpose:** This protocol is invoked when the main `roadmap.prompt.md` execution encounters an unexpected issue, ambiguity, or gets stuck after initial self-correction attempts.

**Objective:** To regain momentum and find a productive path forward, maintaining maximum autonomy.

## Protocol Steps:

1.  **Identify the Blocker:**
    *   Clearly state the problem encountered. What task were you trying to perform? What was the expected outcome? What was the actual outcome or error?
    *   Capture relevant error messages or unexpected outputs.

2.  **Contextual Analysis:**
    *   Re-read the current roadmap task from `/workspace/UltimateSportsBettingApp/dev/copilot_roadmap.md`.
    *   Review the last few successful actions and tool calls.
    *   Examine relevant file contents (`read_file`) if they might offer clues (e.g., config files, recently modified files, files mentioned in error messages).
    *   Use `semantic_search` with keywords related to the error or task if the issue might be due to a misunderstanding of existing code.
    *   Check `get_errors` for the relevant files if it seems like a syntax or type error introduced.

3.  **Hypothesize Solutions (Generate 2-3 Options):**
    *   **Option A (Direct Fix):** Can the error be fixed directly with a small code change (`insert_edit_into_file`) or a modified terminal command (`run_in_terminal`)? What would that change be?
    *   **Option B (Alternative Approach):** Is there a different way to achieve the underlying goal of the current roadmap task? This might involve using a different tool, modifying a different set of files, or breaking the task into smaller sub-tasks.
    *   **Option C (Information Gathering):** Is more information needed? This could involve broader searches (`semantic_search`, `grep_search`), listing directory contents (`list_dir`), or checking related documentation if available.

4.  **Evaluate Hypotheses:**
    *   For each option, briefly assess its likelihood of success and potential risks or side effects.
    *   Prioritize the option that seems most direct and least risky.

5.  **Attempt Preferred Solution:**
    *   Execute the chosen option using the appropriate tools.

6.  **Outcome Assessment:**
    *   **Success:** If the solution works, resume the main `roadmap.prompt.md` protocol from the step that was previously blocked or the next logical step.
    *   **Partial Success/New Issue:** If the solution leads to a new problem or only partially resolves the issue, re-invoke this `recursive-autonomy.prompt.md` protocol, treating the new problem as the blocker.
    *   **Failure:** If the preferred solution fails, try the next most promising hypothesis from step 3. If all hypothesized solutions fail:
        *   Add a new task to `dev/copilot_roadmap.md` under "🚧 Blockers / Needs Review" detailing the problem and the attempted fixes. Use the absolute path `/workspace/UltimateSportsBettingApp/dev/copilot_roadmap.md`.
        *   Mark the current problematic task as blocked in the roadmap, e.g., `- [B] Original Task Description - Blocked by [New Blocker Task ID/Description]`.
        *   Attempt to move to the *next* available task in "🔧 In Progress / Top Priorities" in `dev/copilot_roadmap.md` (absolute path: `/workspace/UltimateSportsBettingApp/dev/copilot_roadmap.md`).
        *   If no other tasks can be progressed, only then should you pause and clearly state: "AUTONOMY HALTED: Blocker encountered on task '[Blocked Task Description]'. Attempts to resolve via Recursive Autonomy Protocol failed. Added details to roadmap. Awaiting user guidance or manual intervention for the blocked task. Will attempt to proceed with other roadmap items if available."

7.  **Documentation (If applicable):**
    *   If a novel solution or workaround was found, consider if it needs to be documented (e.g., as a comment in code, or a note in a relevant README or a new item in the roadmap for later refinement).

**Guiding Principles:**
*   **Persistence:** Don't give up easily. Explore multiple avenues.
*   **Small Steps:** If a large task is failing, try to break it down.
*   **Safety:** Prioritize non-destructive actions when unsure. For example, read files or search before making potentially breaking changes.
*   **Learning:** Each failure is an opportunity to learn more about the codebase and the problem.
*   **Goal-Oriented:** Always keep the original roadmap task's objective in mind.

**Escape Hatch (Last Resort):** If, after several cycles of this protocol, no progress is made and no other roadmap tasks can be addressed, and you are in a loop, explicitly state: "RECURSIVE AUTONOMY FAILURE: Multiple attempts to resolve blocker for task '[Task Description]' have failed. Unable to proceed with any other roadmap items. Requesting user intervention."

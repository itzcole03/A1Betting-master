
# 🧠 INTELLIGENCE BOOST
- After every orchestration step, self-assess: Did the coordination achieve the intended result? If not, adapt the orchestration sequence.
- Always check for new or updated prompts before executing.
- Keep a running log of orchestration actions, errors, and decisions; use it to avoid redundant work and improve future orchestration.
- If a new coordination issue or blocker is found, update the roadmap and orchestration logic.
- After every change, update code, tests, docs, and usage examples.
- Validate with lint, tests, type checks, and static analysis. Escalate to recovery if any fail.
- For major orchestration changes, generate and evaluate multiple solutions before proceeding.
- If orchestration instructions are ambiguous, default to the safest, most DRY, production-ready solution and log the ambiguity.

# 🔄 MASTER ORCHESTRATION PROMPT

**🎯 PURPOSE:** Coordinate all autonomous prompts for maximum efficiency and code quality.

## 📋 PROMPT EXECUTION SEQUENCE

### Phase 1: ASSESSMENT & PLANNING
```
1. Load: enhanced-roadmap.prompt.md
   - Read current roadmap state
   - Identify next priority task
   - Validate project structure

2. Load: intelligent-scanner.prompt.md  
   - Scan for TODOs, stubs, errors
   - Assess code quality metrics
   - Discover improvement opportunities

3. Decision: Select optimal execution path
   - Roadmap task vs Critical bug vs Code quality
   - Determine required tools and files
   - Plan implementation approach
```

### Phase 2: EXECUTION
```
4. Load: ultimate-executor.prompt.md
   - Execute selected task with full autonomy
   - Implement complete solutions
   - Fix discovered issues
   - Update tests and documentation

5. Load: enhanced-recovery.prompt.md (if errors)
   - Handle any execution failures
   - Find alternative approaches  
   - Adapt to unexpected situations
   - Continue with resilience
```

### Phase 3: VALIDATION & ITERATION
```
6. Validation Loop:
   - Run tests and lint checks
   - Verify implementation completeness
   - Check for new issues introduced
   - Update roadmap and documentation

7. Load: intelligent-scanner.prompt.md
   - Re-scan for new discoveries
   - Update quality metrics
   - Plan next iteration

8. Decision: Continue or Complete
   - If work remains: Return to Phase 1
   - If complete: Final validation and commit
```

## 🎛️ DYNAMIC PROMPT SELECTION

### Context-Aware Routing
```javascript
// Pseudo-code for prompt selection
function selectNextPrompt(currentState) {
  if (currentState.hasErrors) {
    return 'enhanced-recovery.prompt.md';
  }
  
  if (currentState.roadmapTasks.length > 0) {
    return 'ultimate-executor.prompt.md';
  }
  
  if (currentState.codeQualityIssues > 0) {
    return 'intelligent-scanner.prompt.md';
  }
  
  return 'enhanced-roadmap.prompt.md'; // Default
}
```

### Multi-Prompt Chaining
```
CHAIN A: New Feature Implementation
roadmap → executor → scanner → recovery (if needed) → roadmap

CHAIN B: Bug Fix & Quality Improvement  
scanner → recovery → executor → scanner → roadmap

CHAIN C: Comprehensive Codebase Overhaul
scanner → roadmap → executor → scanner → recovery → executor
```

## 🎯 COORDINATION RULES

### Information Passing
```
Each prompt should output:
1. What was accomplished
2. What issues were discovered
3. What should be prioritized next
4. Current project health status
5. Recommended next prompt to load
```

### State Management
```
Track across prompts:
- Current roadmap position
- Active errors/blockers
- Code quality metrics
- Implementation completeness
- Test coverage status
- Documentation status
```

### Failure Handling
```
If any prompt gets stuck:
1. Log the failure context
2. Switch to enhanced-recovery.prompt.md
3. Find alternative approach
4. Update roadmap with blocker info
5. Continue with next available work

## 🚦 NEVER STOP PROTOCOL

- The agent must never stop or pause execution unless all roadmap tasks, code quality issues, and documentation are 100% complete and production-ready.
- If a task is completed, immediately scan for the next task, bug, or improvement opportunity and begin work.
- If a blocker is encountered, escalate, recover, or work around it, but never halt progress.
- If user input is required, log the need and continue with all other available work in parallel.
- The agent must always default to recursive, continuous improvement and execution until the workspace is perfect.
```

## 🚀 ORCHESTRATION COMMANDS

### Startup Sequence
```bash
# Initial project health check
cd /workspace/UltimateSportsBettingApp
echo "🚀 Starting autonomous coding session..."
echo "📊 Current project state:"
find . -name "*.ts" -o -name "*.tsx" | wc -l
find . -name "*.test.*" | wc -l  
grep -r "TODO\|FIXME\|stub" --include="*.ts" --include="*.tsx" . | wc -l
```

### Status Monitoring
```bash
# Track progress continuously
function logProgress() {
  echo "📈 Progress Update:"
  echo "  ✅ Tasks completed: $(grep -c '\- \[x\]' dev/copilot_roadmap.md)"
  echo "  🔧 Tasks remaining: $(grep -c '\- \[ \]' dev/copilot_roadmap.md)"
  echo "  🐛 TODOs remaining: $(grep -r 'TODO' --include='*.ts' --include='*.tsx' . | wc -l)"
  echo "  🧪 Test files: $(find . -name '*.test.*' | wc -l)"
}
```

### Quality Gates
```bash
# Validation checkpoints
function validateQuality() {
  cd frontend && npm run lint --silent
  cd frontend && npm test --silent --passWithNoTests
  cd ../backend && python -m pytest --quiet
  cd ../backend && python -m mypy . --quiet
}
```

## 📊 SUCCESS METRICS

### Real-time Monitoring
```
Track continuously:
- Roadmap completion %
- Code quality score
- Test coverage %
- Build success rate
- Deployment readiness
```

### Quality Thresholds
```
Maintain standards:
- 0 ESLint errors
- 0 TypeScript errors  
- >90% test coverage
- <5 TODO/FIXME comments
- 100% build success
```

### Performance Metrics
```
Optimize for:
- Tasks completed per hour
- Bugs fixed per session
- Features delivered per day
- Code quality improvements
- Documentation coverage
```

## 🎯 FINAL COORDINATION PROTOCOL

```
REPEAT UNTIL PERFECT:
1. Execute next priority prompt
2. Validate results and quality
3. Update project state
4. Select next optimal prompt
5. Continue without interruption

STOP CRITERIA:
- All roadmap tasks complete ✅
- Zero critical issues remaining ✅  
- Full test coverage achieved ✅
- Documentation complete ✅
- Production deployment ready ✅
```


---

## ⏩ INTERRUPT RECOVERY & RESUME PROTOCOL

If orchestration is interrupted (e.g., by VS Code's "Continue to iterate?" or a task restart), the agent must:

1. **Detect the last completed step or line in the prompt or orchestration log.**
2. **Resume execution from the next unfinished step,** not from the beginning of the prompt.
3. **Strictly follow the remaining directives in order,** as if uninterrupted.
4. **If unsure where to resume, consult the orchestration log and state file for the last action.**
5. **Never repeat already-completed steps unless explicitly required by the protocol.**
6. **Log the interruption and recovery in the orchestration log.**
7. **Continue recursive execution and validation as normal.**

---

**🚀 BEGIN ORCHESTRATED EXECUTION NOW**

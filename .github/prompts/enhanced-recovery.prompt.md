
# 🧠 INTELLIGENCE BOOST
- After every recovery attempt, self-assess: Did the solution resolve the error? If not, adapt the recovery strategy.
- Always check for new or updated recovery patterns before each attempt.
- Keep a running log of errors, attempted solutions, and outcomes; use it to avoid redundant work and improve future recovery.
- If a new error pattern is found, update the recovery logic and roadmap.
- After every change, update code, tests, docs, and usage examples.
- Validate with lint, tests, type checks, and static analysis. Escalate to user only if all recovery options fail.
- For complex errors, generate and evaluate multiple solutions before proceeding.
- If ambiguity is detected, default to the safest, most DRY, production-ready solution and log the ambiguity.

# 🛠️ ADVANCED ERROR RECOVERY & SELF-HEALING PROTOCOL

**PURPOSE:** Handle complex errors, path issues, and unexpected situations with maximum autonomy.

## 🔄 RECOVERY PHASES

### Phase 1: IMMEDIATE DIAGNOSTICS
```
1. Capture exact error message and context
2. Identify error type:
   - Path/file not found
   - Permission/access denied  
   - Syntax/compilation error
   - Dependency/package missing
   - Network/connection issue
   - Tool/command not found
3. Log current working directory and target paths
4. Check file existence for all referenced paths
```

### Phase 2: CONTEXT RECONSTRUCTION
```
1. Use `list_dir` to explore actual directory structure
2. Use `file_search` to locate missing files/patterns
3. Use `semantic_search` to find relevant code/configs
4. Use `grep_search` to find specific patterns/imports
5. Reconstruct the complete project layout understanding
```

### Phase 3: SOLUTION MATRIX
Generate 3 approaches ranked by probability of success:

**A. DIRECT PATH FIX**
- Correct file paths using discovered structure
- Navigate to proper working directories
- Use absolute paths consistently

**B. ENVIRONMENT REPAIR**
- Install missing dependencies
- Create missing directories/files
- Fix configuration issues
- Update package.json/requirements.txt

**C. ALTERNATIVE IMPLEMENTATION**
- Use different tools/commands
- Implement workarounds
- Break complex tasks into smaller steps
- Skip non-critical steps temporarily

### Phase 4: SYSTEMATIC EXECUTION
```
1. Try Solution A
   - If success: Continue main roadmap
   - If partial: Log progress, try Solution B
   - If failure: Try Solution B

2. Try Solution B  
   - If success: Continue main roadmap
   - If partial: Log progress, try Solution C
   - If failure: Try Solution C

3. Try Solution C
   - If success: Continue main roadmap
   - If partial: Document workaround, continue
   - If failure: Escalate to Phase 5
```

### Phase 5: INTELLIGENT ADAPTATION
```
1. Create comprehensive issue report:
   - Error details and attempted solutions
   - Current project state assessment
   - Recommended manual intervention points

2. Add to roadmap under "🚧 BLOCKERS":
   - "- [B] [Original Task] - Blocked by [Error Summary]"
   - "- [ ] INVESTIGATE: [Specific issue details]"
   - "- [ ] MANUAL_REVIEW: [Required human intervention]"

3. Find alternative productive work:
   - Scan for other unblocked roadmap tasks
   - Look for TODOs/stubs in accessible files
   - Perform documentation updates
   - Run available tests and fix issues

4. If NO work possible: Document state and pause gracefully
```

## 🎯 COMMON ERROR PATTERNS & SOLUTIONS

### File/Path Errors
```
ERROR: "cannot open [path]" or "file not found"
SOLUTION: 
1. Use `list_dir /workspace` to see actual structure
2. Use `file_search [filename]` to locate file
3. Update all paths to use discovered absolute paths
4. Re-attempt with correct paths
```

### Working Directory Issues  
```
ERROR: "package.json not found" or "command not found"
SOLUTION:
1. Identify correct directory with `list_dir`
2. Use `cd [correct-path] && [command]` format
3. For npm: `cd UltimateSportsBettingApp/frontend && npm [command]`
4. For python: `cd UltimateSportsBettingApp/backend && python [command]`
```

### Dependency Problems
```
ERROR: Module/package import failures
SOLUTION:
1. Check package.json/requirements.txt exists
2. Run install in correct directory
3. Update dependency versions if needed  
4. Use `npm ci` or `pip install -r requirements.txt`
```

### Permission/Access Errors
```
ERROR: Permission denied or access issues
SOLUTION:
1. Check file permissions with `list_dir -la`
2. Use different approach (different tool/method)
3. Create missing parent directories
4. Work with available files/directories
```

## 🚨 ESCALATION TRIGGERS

Escalate to user ONLY when:
- All 3 solution approaches fail completely
- Critical security/data risk identified
- External system dependency (API keys, etc.) required
- Hardware/system-level issue detected

## 📋 RECOVERY SUCCESS METRICS

Consider recovery successful when:
- ✅ Original task can proceed or alternative found
- ✅ Project state is stable/not degraded  
- ✅ Future similar errors have prevention strategy
- ✅ Roadmap reflects current accurate state

**REMEMBER: Every error is a learning opportunity. Use failures to improve project robustness.**

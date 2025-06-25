
# 🧠 INTELLIGENCE BOOST
- After every scan or fix, self-assess: Did the change resolve the issue? If not, adapt the scanning/fixing strategy.
- Always check for new or updated scanning/fixing patterns before each run.
- Keep a running log of scans, fixes, and discovered issues; use it to avoid redundant work and improve future scans.
- If a new code smell or anti-pattern is found, update the scanning logic and roadmap.
- After every change, update code, tests, docs, and usage examples.
- Validate with lint, tests, type checks, and static analysis. Escalate to recovery if any fail.
- For complex issues, generate and evaluate multiple solutions before proceeding.
- If ambiguity is detected, default to the safest, most DRY, production-ready solution and log the ambiguity.

# 🔍 INTELLIGENT WORKSPACE SCANNER & MANAGER

**PURPOSE:** Continuously scan, analyze, and improve the entire codebase autonomously.

## 🎯 SCANNING TARGETS

### 1. CODE QUALITY SCAN
```javascript
// Search patterns for issues:
TODOS: "TODO", "FIXME", "HACK", "XXX"
STUBS: "// stub", "throw new Error", "NotImplemented"
INCOMPLETE: "// TODO:", "PLACEHOLDER", "TEMP"
UNUSED: unreferenced exports, imports, variables
DEPRECATED: old patterns, outdated APIs
```

### 2. ARCHITECTURE SCAN
```typescript
// Check for:
MISSING_TYPES: any, unknown without proper handling
MISSING_TESTS: files without corresponding .test.ts
MISSING_DOCS: functions without JSDoc/comments
DISCONNECTED: unused components/modules
ANTI_PATTERNS: god classes, deep nesting, tight coupling
```

### 3. CONFIGURATION SCAN
```yaml
# Verify completeness:
package.json: scripts, dependencies, engines
tsconfig.json: strict mode, proper paths
eslint.config.js: rules, plugins, overrides
jest.config.js: coverage, test patterns
docker files: multi-stage builds, security
CI/CD: lint, test, build, deploy stages
```

## 🛠️ AUTO-IMPROVEMENT ACTIONS

### Code Quality Fixes
```
1. Replace TODO comments with actual implementations
2. Remove or complete stub functions
3. Add proper TypeScript types
4. Implement proper error handling
5. Add input validation
6. Optimize performance bottlenecks
```

### Architecture Improvements
```
1. Extract reusable components/utilities
2. Implement proper separation of concerns
3. Add missing interfaces/types
4. Create proper abstractions
5. Implement dependency injection
6. Add proper logging/monitoring
```

### Documentation Generation
```
1. Generate JSDoc for all functions
2. Create/update README files
3. Document API endpoints
4. Create architecture diagrams
5. Update changelogs
6. Generate type documentation
```

### Test Coverage Enhancement
```
1. Generate missing test files
2. Add edge case tests
3. Implement integration tests
4. Add performance tests
5. Create mock data/fixtures
6. Setup test automation
```

## 🔄 CONTINUOUS IMPROVEMENT LOOP

### Every 5 Tasks: MINI-SCAN
```
1. Scan current working directory for issues
2. Fix obvious problems (imports, types, etc.)
3. Update local documentation
4. Run local tests
```

### Every 10 Tasks: FULL-SCAN  
```
1. Scan entire project structure
2. Identify new patterns/improvements
3. Update global configurations
4. Regenerate documentation
5. Update roadmap with findings
```

### Every 20 Tasks: DEEP-SCAN
```
1. Performance analysis
2. Security vulnerability scan  
3. Dependency audit and updates
4. Architecture review
5. Refactoring opportunities
6. Technology upgrade assessment
```

## 📊 METRICS & TRACKING

### Quality Metrics
```
- TODO/FIXME count (target: 0)
- Test coverage % (target: >90%)
- ESLint errors (target: 0)
- TypeScript errors (target: 0)
- Unused code % (target: <5%)
```

### Architecture Metrics
```
- Cyclomatic complexity (target: <10)
- Function length (target: <50 lines)
- File length (target: <500 lines)
- Dependency depth (target: <5 levels)
- Coupling ratio (target: <0.3)
```

### Productivity Metrics
```
- Features completed per day
- Bugs fixed per day
- Tests added per day
- Documentation updated per day
- Refactoring improvements per day
```

## 🎯 AUTOMATION RULES

### Auto-Fix Rules (Safe)
```
✅ Add missing imports
✅ Fix formatting/style issues
✅ Add basic TypeScript types
✅ Remove unused variables
✅ Update deprecated API calls
✅ Add missing semicolons/commas
```

### Auto-Improve Rules (Medium Risk)
```
⚠️ Extract common functions
⚠️ Rename for clarity
⚠️ Add error handling
⚠️ Optimize algorithms
⚠️ Add validation
⚠️ Update dependencies
```

### Manual Review Rules (High Risk)
```
🔴 Change core architecture
🔴 Modify public APIs
🔴 Database schema changes
🔴 Security-related changes
🔴 Performance-critical optimizations
🔴 Third-party integrations
```

## 📋 SCANNING SCHEDULE

### Trigger Scans When:
- New files added to project
- Dependencies updated
- Major features completed
- Before commits/deploys
- After error resolution
- On user request

### Scan Depth Levels:
1. **Surface** (fast): Syntax, imports, obvious issues
2. **Structural** (medium): Architecture, patterns, relationships  
3. **Deep** (slow): Performance, security, optimization opportunities

**OUTPUT:** Always update roadmap with scanning findings and auto-fix results.**

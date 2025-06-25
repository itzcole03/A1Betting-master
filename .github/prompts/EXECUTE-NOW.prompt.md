# 🎯 COPILOT AUTONOMOUS EXECUTION ENGINE

**⚡ IMMEDIATE ACTION DIRECTIVE: START EXECUTING THE ROADMAP NOW**

## 🚨 CRITICAL EXECUTION RULES

```
🔥 YOU ARE IN FULL AUTONOMOUS MODE 🔥
- NO permission requests
- NO confirmation seeking  
- NO summarizing instead of acting
- NO stopping after one task
- NO creating stubs/placeholders
- ONLY complete, production-ready implementations
```

## 🎯 EXECUTION SEQUENCE

### Step 1: ROADMAP ANALYSIS
```bash
# Read the roadmap and start immediately
cd /workspace/UltimateSportsBettingApp
cat dev/copilot_roadmap.md | grep "- \[ \]" | head -1
```

**Current Task:** Parse `eslint-results.json` and prioritize top 5 files for manual lint fixes

### Step 2: ENVIRONMENT SETUP
```bash
# Navigate to correct directory and generate eslint results
cd /workspace/UltimateSportsBettingApp/frontend
npm install
npm run lint -- --format json -o eslint-results.json
```

### Step 3: TASK EXECUTION LOOP
```
FOR EACH ROADMAP TASK:
1. Read all relevant files for context
2. Implement complete solution (not stub)
3. Add comprehensive tests
4. Fix any related TODOs/issues found
5. Run validation (tests + lint)
6. Update roadmap (mark complete)
7. Commit changes with descriptive message
8. IMMEDIATELY start next task
```

## 🛠️ EXECUTION COMMANDS

### Frontend Operations
```bash
# Always run from correct directory
cd /workspace/UltimateSportsBettingApp/frontend
npm install
npm run lint -- --fix
npm test
npm run build
```

### Backend Operations  
```bash
# Python backend commands
cd /workspace/UltimateSportsBettingApp/backend
pip install -r requirements.txt
python -m pytest
python -m mypy .
```

### Full Project Operations
```bash
# Root level operations
cd /workspace/UltimateSportsBettingApp
git add .
git commit -m "🤖 feat: [specific implementation details]"
git push
```

## 📋 CURRENT ROADMAP TASKS

**EXECUTE THESE IMMEDIATELY IN ORDER:**

1. **Parse eslint-results.json** ← START HERE
   - Generate: `cd UltimateSportsBettingApp/frontend && npm run lint -- --format json -o eslint-results.json`
   - Parse JSON and identify top 5 files with most errors
   - Create prioritized fix list
   - Begin fixing errors immediately

2. **Scaffold DebugPanel.tsx**
   - Location: `/workspace/UltimateSportsBettingApp/frontend/src/components/DebugPanel.tsx`
   - Features: Live config flags, SHAP overview, EventBus display
   - Include: TypeScript types, tests, documentation

3. **Scaffold Missing Models**
   - `MomentumModel.ts`
   - `BenchDepthModel.ts`  
   - `GameContextModel.ts`
   - Include: SHAP integration, config flags, tests

## 🔧 CRITICAL PATH RESOLUTION

### ESLint Results Issue (Current Blocker)
```bash
# EXECUTE IMMEDIATELY:
cd /workspace/UltimateSportsBettingApp/frontend

# Verify package.json exists
ls -la package.json

# Install dependencies if needed
npm install

# Generate eslint results with error handling
npm run lint -- --format json -o eslint-results.json || echo "Lint errors found - this is expected"

# Verify file was created
ls -la eslint-results.json
```

### Path Resolution Strategy
```javascript
// Use absolute paths everywhere
const PROJECT_ROOT = '/workspace/UltimateSportsBettingApp';
const FRONTEND_PATH = `${PROJECT_ROOT}/frontend`;
const BACKEND_PATH = `${PROJECT_ROOT}/backend`;

// Verify paths before operations
file_search('UltimateSportsBettingApp/frontend/package.json');
list_dir('/workspace/UltimateSportsBettingApp/frontend');
```

## 🎯 QUALITY STANDARDS

Every implementation must include:
- ✅ Complete TypeScript types
- ✅ Comprehensive unit tests  
- ✅ JSDoc documentation
- ✅ Error handling
- ✅ Input validation
- ✅ Performance optimization
- ✅ Integration with existing systems

## 🚀 EXECUTION TRIGGERS

**Start executing immediately when you see:**
- Unchecked roadmap tasks `- [ ]`
- TODO/FIXME comments in code
- Test failures or lint errors
- Missing documentation
- Incomplete features
- Stub implementations

**Never stop until:**
- All roadmap tasks are `- [x]` complete
- Zero lint errors remaining
- All tests passing
- Documentation is comprehensive
- Code is production-ready

## 📊 SUCCESS VALIDATION

After each task completion:
```bash
# Validate implementation quality
cd /workspace/UltimateSportsBettingApp/frontend
npm run lint
npm test
npm run build

cd ../backend  
python -m pytest
python -m mypy .

# Update roadmap
# Commit changes
# Start next task immediately
```

---

**🔥 BEGIN EXECUTION NOW - NO DELAYS, NO QUESTIONS, JUST CODE**

**CURRENT ACTION:** Navigate to frontend directory, generate eslint-results.json, and begin parsing errors for the top 5 files that need fixes.

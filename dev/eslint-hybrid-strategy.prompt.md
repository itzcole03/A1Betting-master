# ESLint Hybrid Cleanup Strategy

## Overview
This prompt guides the autonomous ESLint cleanup using a hybrid approach that complements manual fixes.

## Strategy Adaptation
- **Agent Focus**: High-impact files (30+ errors) for maximum error reduction
- **Agent Secondary**: Quick utility wins (1-5 errors) for momentum
- **Manual Coordination**: User continues preferred manual approach
- **Avoid Conflicts**: Don't edit files actively being modified by user

## Priority Targets (Agent)

### High-Impact Files (30+ errors):
1. UnifiedBettingSystem.ts (72 errors) - Core system
2. LSTMModel.ts (57 errors) - ML model
3. XGBoostModel.ts (55 errors) - ML model
4. TransformerModel.ts (55 errors) - ML model
5. clusteringService.ts (50 errors) - Analytics service
6. PredictionEngine.ts (42 errors) - Core utilities
7. UnifiedBettingInterface.tsx (40 errors) - Main UI
8. BacktestingService.ts (33 errors) - Analytics
9. core/PredictionEngine.ts (31 errors) - Core engine
10. ProjectionBettingStrategy.ts (30 errors) - Strategy

### Quick Wins (1-5 errors):
- Utility files in `/utils/` directory
- Simple type fixes in adapters
- Single `any` type replacements

## Fix Patterns

### Critical `any` Types:
- Replace `any` with `unknown` for generic data
- Use `Record<string, unknown>` for object types
- Define proper interfaces for complex types
- Use union types for known variants

### Unused Variables:
- Remove truly unused imports/variables
- Prefix with `_` for intentionally unused (function params)
- Add `// eslint-disable-next-line` for complex cases

### React Issues:
- Fix hook dependency arrays
- Add proper prop types
- Fix React keys in lists

## Execution Approach
1. Start with ONE high-impact file at a time
2. Fix ALL errors in that file before moving to next
3. Validate fixes with `npx eslint [file]` after each
4. Update roadmap progress after each completed file
5. Coordinate with user to avoid editing same files

## Success Metrics
- Reduce total errors by 50% through combined effort
- Focus on `any` type elimination (currently 1,395)
- Maintain momentum with quick wins between large files
- Update roadmap with specific file completion status

## File Completion Tracking
Mark files as completed in roadmap:
- [x] ✅ UnifiedBettingSystem.ts (72 → 0 errors)
- [ ] 🔄 LSTMModel.ts (57 errors)
- etc.

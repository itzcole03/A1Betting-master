# Project Cross-Reference & Dependency Map

This folder contains a cross-referenced map of every file in your project, showing how everything connects. It is designed to help developers, Copilot, and AI tools understand your codebase at a glance.

---

## How to Use This Folder

1. **Dependency Graphs:**
   - The `madge-frontend.json` file (and SVG image) shows which files import or depend on which others in your frontend.
   - Open `madge-frontend.svg` in your browser to see a visual map!
   - (If you have a backend, repeat for backend/src and add those files here too.)

2. **Per-Directory Audits:**
   - Each directory in your project has a `*_ANALYSIS.md` file that explains what every file does.
   - See the links below to jump to any directory’s audit.

3. **How to Update:**
   - Whenever you add, remove, or move files, run:
     ```sh
     npx madge --json frontend/src > project-docs/madge-frontend.json
     npx madge --image project-docs/madge-frontend.svg frontend/src
     ```
   - (Repeat for backend if needed.)
   - Update this file if you add new directories or audits.

---

## Directory Audits

- [src/adapters/ADAPTERS_FILE_USAGE_ANALYSIS.md](../frontend/src/adapters/ADAPTERS_FILE_USAGE_ANALYSIS.md)
- [src/analysis/ANALYSIS_FILE_USAGE_ANALYSIS.md](../frontend/src/analysis/ANALYSIS_FILE_USAGE_ANALYSIS.md)
- [src/analytics/ANALYTICS_FILE_USAGE_ANALYSIS.md](../frontend/src/analytics/ANALYTICS_FILE_USAGE_ANALYSIS.md)
- [src/api/API_FILE_USAGE_ANALYSIS.md](../frontend/src/api/API_FILE_USAGE_ANALYSIS.md)
- [src/assets/ASSETS_FILE_USAGE_ANALYSIS.md](../frontend/src/assets/ASSETS_FILE_USAGE_ANALYSIS.md)
- [src/components/COMPONENTS_FILE_USAGE_ANALYSIS.md](../frontend/src/components/COMPONENTS_FILE_USAGE_ANALYSIS.md)
- [src/config/CONFIG_FILE_USAGE_ANALYSIS.md](../frontend/src/config/CONFIG_FILE_USAGE_ANALYSIS.md)
- [src/contexts/CONTEXTS_FILE_USAGE_ANALYSIS.md](../frontend/src/contexts/CONTEXTS_FILE_USAGE_ANALYSIS.md)
- [src/core/CORE_FILE_USAGE_ANALYSIS.md](../frontend/src/core/CORE_FILE_USAGE_ANALYSIS.md)
- [src/data/DATA_FILE_USAGE_ANALYSIS.md](../frontend/src/data/DATA_FILE_USAGE_ANALYSIS.md)
- [src/lib/LIB_FILE_USAGE_ANALYSIS.md](../frontend/src/lib/LIB_FILE_USAGE_ANALYSIS.md)
- [src/middleware/MIDDLEWARE_FILE_USAGE_ANALYSIS.md](../frontend/src/middleware/MIDDLEWARE_FILE_USAGE_ANALYSIS.md)
- [src/mocks/MOCKS_FILE_USAGE_ANALYSIS.md](../frontend/src/mocks/MOCKS_FILE_USAGE_ANALYSIS.md)
- [src/models/MODELS_FILE_USAGE_ANALYSIS.md](../frontend/src/models/MODELS_FILE_USAGE_ANALYSIS.md)
- [src/monitoring/MONITORING_FILE_USAGE_ANALYSIS.md](../frontend/src/monitoring/MONITORING_FILE_USAGE_ANALYSIS.md)
- [src/notification/NOTIFICATION_FILE_USAGE_ANALYSIS.md](../frontend/src/notification/NOTIFICATION_FILE_USAGE_ANALYSIS.md)
- [src/pages/PAGES_FILE_USAGE_ANALYSIS.md](../frontend/src/pages/PAGES_FILE_USAGE_ANALYSIS.md)
- [src/providers/PROVIDERS_FILE_USAGE_ANALYSIS.md](../frontend/src/providers/PROVIDERS_FILE_USAGE_ANALYSIS.md)
- [src/reporting/REPORTING_FILE_USAGE_ANALYSIS.md](../frontend/src/reporting/REPORTING_FILE_USAGE_ANALYSIS.md)
- [src/scripts/SCRIPTS_FILE_USAGE_ANALYSIS.md](../frontend/src/scripts/SCRIPTS_FILE_USAGE_ANALYSIS.md)
- [src/services/analytics/ANALYTICS_FILE_USAGE_ANALYSIS.md](../frontend/src/services/analytics/ANALYTICS_FILE_USAGE_ANALYSIS.md)
- [src/services/api/API_FILE_USAGE_ANALYSIS.md](../frontend/src/services/api/API_FILE_USAGE_ANALYSIS.md)
- [src/services/betting/BETTING_FILE_USAGE_ANALYSIS.md](../frontend/src/services/betting/BETTING_FILE_USAGE_ANALYSIS.md)
- [src/services/SERVICES_FILE_USAGE_ANALYSIS.md](../frontend/src/services/SERVICES_FILE_USAGE_ANALYSIS.md)
- [src/services/types/TYPES_FILE_USAGE_ANALYSIS.md](../frontend/src/services/types/TYPES_FILE_USAGE_ANALYSIS.md)
- [src/stores/STORES_FILE_USAGE_ANALYSIS.md](../frontend/src/stores/STORES_FILE_USAGE_ANALYSIS.md)
- [src/stories/STORIES_FILE_USAGE_ANALYSIS.md](../frontend/src/stories/STORIES_FILE_USAGE_ANALYSIS.md)
- [src/strategies/STRATEGIES_FILE_USAGE_ANALYSIS.md](../frontend/src/strategies/STRATEGIES_FILE_USAGE_ANALYSIS.md)
- [src/styles/STYLES_FILE_USAGE_ANALYSIS.md](../frontend/src/styles/STYLES_FILE_USAGE_ANALYSIS.md)
- [src/test/TEST_FILE_USAGE_ANALYSIS.md](../frontend/src/test/TEST_FILE_USAGE_ANALYSIS.md)
- [src/tests/TESTS_FILE_USAGE_ANALYSIS.md](../frontend/src/tests/TESTS_FILE_USAGE_ANALYSIS.md)
- [src/theme/THEME_FILE_USAGE_ANALYSIS.md](../frontend/src/theme/THEME_FILE_USAGE_ANALYSIS.md)
- [src/types/TYPES_FILE_USAGE_ANALYSIS.md](../frontend/src/types/TYPES_FILE_USAGE_ANALYSIS.md)
- [src/unified/UNIFIED_FILE_USAGE_ANALYSIS.md](../frontend/src/unified/UNIFIED_FILE_USAGE_ANALYSIS.md)
- [src/user/USER_FILE_USAGE_ANALYSIS.md](../frontend/src/user/USER_FILE_USAGE_ANALYSIS.md)
- [src/utils/UTILS_FILE_USAGE_ANALYSIS.md](../frontend/src/utils/UTILS_FILE_USAGE_ANALYSIS.md)
- [src/validation/VALIDATION_FILE_USAGE_ANALYSIS.md](../frontend/src/validation/VALIDATION_FILE_USAGE_ANALYSIS.md)

- [../backend/BACKEND_FILE_USAGE_ANALYSIS.md](../backend/BACKEND_FILE_USAGE_ANALYSIS.md)

(Add backend links here if you have them!)

---

## How to Cross-Reference Files

- Use the Madge JSON or SVG to see which files depend on each other.
- Use the per-directory audits to understand what each file does and how it fits in.
- For deep dives, open the actual source file and check its imports/exports.

---

## Tips for Copilot/AI

- Reference this folder and the SVG/JSON in your prompts for best results.
- Example: “See project-docs/madge-frontend.json for all file dependencies.”
- Example: “See project-docs/PROJECT_CROSS_REFERENCE.md for file purposes and integration.”

---

*Keep this folder up to date for the clearest, most powerful project documentation!*
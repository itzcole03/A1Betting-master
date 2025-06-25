## frontend/src/components/Dashboard.tsx
- **Purpose:** Serves as the main landing dashboard aggregating high-level KPIs, live predictions, bankroll stats, and smart alerts.
- **Usage:** Loaded for authenticated users at route `/dashboard`. Composes multiple widgets (BankrollStats, LiveOddsTicker, ModelPerformance, AlertList) in a responsive grid and fetches initial data via `useDashboardData`.
- **Notes:** Implements lazy loading for heavy charts, grid breakpoint logic, and uses React Router navigation guards. Consider code-splitting and SSR hydration.
- **Status:** Core page component; not a candidate for removal.

---

## frontend/src/components/DebugPanel.tsx
- **Purpose:** Developer-facing panel displaying Redux/Zustand state snapshots, API latency, and WebSocket traffic for debugging.
- **Usage:** Toggled via query param `?debug=1` or keyboard shortcut. Renders collapsible sections with JSON viewers and performance graphs.
- **Notes:** Only imported in development builds; guarded by `process.env.NODE_ENV !== "production"`. Could integrate React Profiler and log export.
- **Status:** Dev-only utility; not shipped in production bundles.

---

## frontend/src/components/Dialog.tsx
- **Purpose:** Generic dialog component wrapping MUI `Dialog` with custom header, actions, and transition presets.
- **Usage:** Used across confirmation modals, forms, and alerts. Accepts `open`, `title`, `actions`, and `onClose` props and supports size variants.
- **Notes:** Provides consistent styling and accessibility; exports helper `useDialog` hook for state handling. Potential to adopt MUI v6 composable slots.
- **Status:** Widely used UI wrapper; not a candidate for removal.

---

## frontend/src/components/Dropdown.tsx
- **Purpose:** Reusable dropdown/select component supporting search, async options, and keyboard navigation.
- **Usage:** Embedded in forms and filter bars. Exposes controlled `value` and `onChange` props, fetches async options when `loadOptions` is provided, and handles debounced search.
- **Notes:** Built on Headless UI `Listbox`, Tailwind styling, and Downshift for accessibility. Could be replaced by MUI Autocomplete for consistency.
- **Status:** Common form control; not a candidate for removal.

---

## frontend/src/components/EntryCard.tsx
- **Purpose:** Card component summarising a user's entry/parlay with legs, stake, potential payout, and status indicator.
- **Usage:** Rendered in entries history and active bets lists. Shows leg count chips, progress bar for settlement, and expand/collapse for detailed legs.
- **Notes:** Makes conditional API call for live updates when entry is active; memoised for list performance; consider virtualisation for large histories.
- **Status:** Important user record component; not a candidate for removal.

---

## frontend/src/components/ErrorBoundary.tsx
- **Purpose:** Catches React render errors and displays a fallback UI to prevent the entire app from crashing.
- **Usage:** Wraps top-level `App` component. On error, logs to Sentry and renders `ErrorFallback` with a reset button to reload state.
- **Notes:** Extends `React.Component` with `componentDidCatch`; integrates with error monitoring service; consider per-route boundaries for isolation.
- **Status:** Critical stability component; not a candidate for removal.

---

## frontend/src/components/ErrorFallback.tsx
- **Purpose:** UI shown by `ErrorBoundary` when a render error occurs—offers friendly message and reset option.
- **Usage:** Rendered automatically by `ErrorBoundary`; receives `error` and `resetErrorBoundary` props, displays stack trace (in dev) and reload button.
- **Notes:** Simple presentational component; consider adding dark-mode aware styling and optional bug-report link.
- **Status:** Stability utility; not a candidate for removal.

---

## frontend/src/components/FeatureStatusPanel.tsx

- **Purpose:** Lists active feature flags, experiment variants, and rollout percentages for transparency and debugging.
- **Usage:** Visible on admin/settings pages. Reads data from `featureFlagsStore`, categorises flags, and displays toggle chips for on/off.
- **Notes:** Good candidate for real-time updates via WebSocket; could integrate edit controls for admins.
- **Status:** Admin diagnostics component; not a candidate for removal.

---

## frontend/src/components/FilterBar.tsx

- **Purpose:** Horizontal bar containing dropdowns, search, and toggle buttons for filtering large datasets (props, predictions, entries).
- **Usage:** Placed above tables/grids. Emits `onFilterChange` callback with updated filter state; supports sticky positioning on scroll.
- **Notes:** Uses `Dropdown`, `DateRangePicker`, and custom `ChipToggle`; ensure accessibility for keyboard navigation.
- **Status:** Common UI filter; not a candidate for removal.

---

## frontend/src/components/Header.tsx

- **Purpose:** Top navigation bar with branding, primary links, user avatar menu, and connection status icons.
- **Usage:** Rendered by `Layout` on every page. Handles mobile menu toggle, theme toggle, and links to dashboard, analytics, and settings.
- **Notes:** Responsive using Tailwind breakpoints; memoised; consider extracting nav links to config file for easier update.
- **Status:** Core navigation component; not a candidate for removal.

---

## frontend/src/components/Layout.tsx

- **Purpose:** Wraps pages with consistent header, footer, and main content area including responsive side padding.
- **Usage:** Used by Next.js `_app` or React Router root element to provide site-wide layout; accepts `children` and optional `title` for SEO.
- **Notes:** Utilises `Header`, `Footer`, and `ToastContainer`; handles dark-mode background color.
- **Status:** Foundational structural component; not a candidate for removal.

---

## frontend/src/components/LineupComparisonTable.tsx

- **Purpose:** Compares projected vs actual lineups across teams/players to highlight discrepancies affecting prop edges.
- **Usage:** Used in analytics pages. Accepts arrays of lineup objects, renders sortable table with colour-coded diff and tooltips.
- **Notes:** Built on MUI `Table`; uses `useMemo` for derived diff; potential performance optimisation via virtualization for 1000+ rows.
- **Status:** Niche analytics tool; not a candidate for removal.

---

## frontend/src/components/LiveOddsTicker.tsx

- **Purpose:** Streams real-time odds updates for multiple markets and bookmakers in a horizontally scrolling ticker.
- **Usage:** Embedded in dashboards and live-betting pages. Receives odds array via props or `useLiveOdds` hook, auto-updates on WebSocket events, and highlights changes with color flashes.
- **Notes:** Uses Framer Motion for smooth marquee animation; ensure performance by throttling updates. Consider pause-on-hover for accessibility.
- **Status:** Key live-data widget; not a candidate for removal.

---

## frontend/src/components/LoadingScreen.tsx

- **Purpose:** Full-screen overlay shown during initial app load or route transitions, displaying logo animation and progress bar.
- **Usage:** Rendered by `AppInitializer` until core services finish bootstrapping. Accepts optional `message` prop for custom status.
- **Notes:** Animation built with Tailwind CSS keyframes; could integrate with NProgress for route change feedback.
- **Status:** UX polish component; not a candidate for removal.

---

## frontend/src/components/LoadingSpinner.tsx

- **Purpose:** Lightweight spinner for indicating in-component loading states.
- **Usage:** Dropped into cards, tables, or buttons during async operations. Supports `size` and `color` props for flexibility.
- **Notes:** Pure SVG/CSS animation; minimal footprint; consider merging with a skeleton component library in future.
- **Status:** Utility loader; not a candidate for removal.

---

## frontend/src/components/MarketAnalysisDashboard.tsx

- **Purpose:** Displays charts and alerts that analyse market efficiency, anomalies, and trend strength for selected events.
- **Usage:** Used on analytics pages. Fetches metrics via `useMarketAnalytics` hook, renders multiple Recharts graphs, and flags anomalies with alert banners.
- **Notes:** Supports timeframe filter, automatic refresh, and dark-mode friendly colors; heavy so code-split with React.lazy.
- **Status:** Advanced analytics dashboard; not a candidate for removal.

---

## frontend/src/components/Modal.tsx

- **Purpose:** Reusable modal dialog with fade/scale transition, focus trap, and overlay click dismissal.
- **Usage:** Wraps arbitrary children; controlled via `isOpen` and `onClose` props. Provides size variants and optional header/footer slots.
- **Notes:** Combines Headless UI `Dialog` with Framer Motion; exports `Modal.Header` and `Modal.Actions` subcomponents for composability.
- **Status:** Core UI utility; not a candidate for removal.

---

## frontend/src/components/ModelPerformance.tsx

- **Purpose:** Presents model performance KPIs (win rate, ROI, avg confidence) in animated metric cards.
- **Usage:** Rendered on dashboards beside predictions. Consumes metrics from `useModelMetrics` hook, animates value changes with count-up effect.
- **Notes:** Memoised; consider adding sparkline charts for trends; supports click to open detailed history.
- **Status:** Important monitoring component; not a candidate for removal.

---

## frontend/src/components/MoneyMaker/AdvancedMLDashboard.tsx

- **Purpose:** Offers an advanced monitoring dashboard for multiple machine-learning models, showing status, accuracy trends, and feature importance.
- **Usage:** Accessed by power users/admins. Fetches model list and metrics via `useMLModels` hook, allows selecting time ranges, and renders charts in `AdvancedMLDashboardPanels`.
- **Notes:** Mock data placeholder; uses React Chart.js; code-split with React.lazy. Needs real backend wiring.
- **Status:** Advanced analytics module; active development.

---

## frontend/src/components/MoneyMaker/AdvancedMLDashboardPanels.tsx

- **Purpose:** Renders individual panels (SHAP importance, performance timeline, news feed) within the advanced ML dashboard.
- **Usage:** Imported by `AdvancedMLDashboard`; receives `modelId` and `dateRange` props and queries specific endpoints for charts and SHAP data.
- **Notes:** Modular design for easy addition of new panels; heavy charting—ensure memoisation.
- **Status:** Sub-component of advanced dashboard; not a candidate for removal.

---

## frontend/src/components/MoneyMaker/UltimateMoneyMaker.tsx

- **Purpose:** Lists high-confidence betting opportunities and facilitates bet placement with recommended stake sizing.
- **Usage:** Appears in MoneyMaker pages. Displays opportunity cards with Kelly stake suggestion, handles bet button clicks via `usePlaceBet` mutation.
- **Notes:** Integrates bankroll check and confirmation modal; optimise large list rendering with virtualization.
- **Status:** Core actionable MoneyMaker UI; not a candidate for removal.

---

## frontend/src/components/MoneyMaker/MoneyMakerAdvanced.tsx

- **Purpose:** Orchestrates the advanced MoneyMaker experience, embedding `AdvancedMLDashboard` and `UltimateMoneyMaker` with shared state and error boundaries.
- **Usage:** Top-level route component for `/moneymaker/advanced`; fetches necessary data, manages loading/error, and passes props to children.
- **Notes:** Wraps children in `ErrorBoundary` and suspense fallback; candidate to split into context provider for shared model list.
- **Status:** Composite page component; not a candidate for removal.

---

## frontend/src/components/MoneyMaker/MoneyMakerConfig.tsx

- **Purpose:** UI form for configuring MoneyMaker strategy, selected sports, and activation status.
- **Usage:** Shown in settings or MoneyMaker wizard. Provides multi-select sports list, strategy dropdown, and toggle switch; saves config via `useMMConfig` hook.
- **Notes:** Uses React Hook Form + Zod validation; shows toast on save; consider adding live validation of strategy compatibility.
- **Status:** Important configuration component; not a candidate for removal.

---

## frontend/src/components/MoneyMaker/MoneyMakerResults.tsx

- **Purpose:** Displays optimal lineup and aggregated metrics produced by MoneyMaker engine after simulation.
- **Usage:** Rendered after running MoneyMaker; shows payout, risk, lineup table, download CSV button.
- **Notes:** Read-only; consider charting ROI distribution; integrates with `useResultsStore`.
- **Status:** Results presentation component; not a candidate for removal.

---

## frontend/src/components/MoneyMaker/MoneyMakerStatus.tsx

- **Purpose:** Shows current MoneyMaker engine state (idle, running simulation, processing bets) with progress and ETA.
- **Usage:** Displayed in MoneyMaker pages’ header. Listens to Zustand `useMMStatusStore`; updates progress bar and status chip.
- **Notes:** Sends toast alerts on state changes; consider integrating WebSocket push instead of polling.
- **Status:** Operational status widget; not a candidate for removal.

---

## frontend/src/components/MLFactorViz.tsx

- **Purpose:** Visualises key ML factors driving predictions using bar charts and correlation matrices.
- **Usage:** Embedded in analytics dashboards. Consumes SHAP/factor importance data via `useFactorData` hook and renders Recharts visuals.
- **Notes:** Heavy charting; memoise derived data; resize observer for responsive layout.
- **Status:** Insight visualisation; not a candidate for removal.

---

## frontend/src/components/MLPredictions.tsx

- **Purpose:** Fetches and displays a paginated list of ML predictions with confidence and risk columns.
- **Usage:** Used on `/predictions` route. Utilises React Query for data fetching, supports infinite scroll, and row click to open explanation overlay.
- **Notes:** Applies row-level coloring based on confidence; virtualization via react-window; unit tests pending.
- **Status:** Core predictions list; not a candidate for removal.

---

## frontend/src/components/analytics/MLInsights.tsx

- **Purpose:** Provides narrative ML insights (trend summaries, anomalies) generated by backend and GPT analysis.
- **Usage:** Shown at top of analytics page. Calls `/api/ml/insights` endpoint, shows markdown-rendered text with links and highlights.
- **Notes:** Debounce refresh button; integrate skeleton loader; ensure sanitization of markdown to prevent XSS.
- **Status:** Explainability component; not a candidate for removal.

---

## frontend/src/components/ml/MLModelCenter.tsx

- **Purpose:** Central hub for managing ML models—listing, toggling activation, and viewing details.
- **Usage:** Accessible via admin menu. Fetches model catalog via `useModelCatalog`, allows enabling/disabling models, and links to `MLModelDashboard`.
- **Notes:** Uses DataGrid with inline switches; role-guarded component (admin only).
- **Status:** Administration UI; not a candidate for removal.

---

## frontend/src/components/ml/MLModelDashboard.tsx

- **Purpose:** Dashboard for individual ML model performance metrics, confusion matrix, ROC curve, and SHAP plots.
- **Usage:** Navigated from ModelCenter. Receives `modelId` route param, fetches metrics, and renders multiple charts.
- **Notes:** Charts heavy—uses dynamic import; consider hooking into monitoring service for live updates.
- **Status:** Detailed model analytics; not a candidate for removal.

---

## frontend/src/components/Navbar.tsx

- **Purpose:** Primary site navigation bar with logo, main route links, and user account dropdown.
- **Usage:** Rendered by `Layout` across all pages. Handles mobile burger toggle, active link highlighting, and theme switch.
- **Notes:** Responsive Tailwind flex layout; extracts nav items from `routes.ts`; memoised to prevent re-renders.
- **Status:** Core site navigation; not a candidate for removal.

---

## frontend/src/components/NoResultsFallback.tsx

- **Purpose:** Friendly placeholder displayed when a list/table query returns no results.
- **Usage:** Dropped into lists like `PropCards` or `Predictions` when data length is zero. Accepts optional `message` and `icon` props.
- **Notes:** Simple presentational component; consider adding action link (e.g., clear filters).
- **Status:** UX helper; not a candidate for removal.

---

## frontend/src/components/ui/NotificationCenter.tsx

- **Purpose:** Centralised toast/notification feed for success, error, and informational events.
- **Usage:** Mounted once in `AppShell`; listens to global `notificationStore`, displays dismissible toasts queued by any module.
- **Notes:** Uses Headless UI `Transition`; supports stacking and auto-dismiss. Could integrate push notifications.
- **Status:** UX infrastructure; not a candidate for removal.

---

## frontend/src/components/betting/OddsDisplay.tsx

- **Purpose:** Formats and displays betting odds in American, decimal, or fractional formats with change indicators.
- **Usage:** Used inside prop cards and live odds tickers. Accepts odds value and `format` prop, provides tooltip with conversions.
- **Notes:** Handles positive/negative styling; memoise to avoid recalculations; unit-tested for conversion correctness.
- **Status:** Essential odds utility; not a candidate for removal.

---

## frontend/src/components/OpportunitiesList.tsx

- **Purpose:** Lists arbitrage or value betting opportunities with sortable columns and tags (edge %, confidence).
- **Usage:** Displayed on opportunities dashboard. Fetches via `useOpportunities` hook, supports pagination and export CSV.
- **Notes:** Integrates DataGrid, loading skeletons, and row expand for details; consider virtualization.
- **Status:** Important analytics list; not a candidate for removal.

---

## frontend/src/components/lineup/PayoutPreview.tsx

- **Purpose:** Shows expected payout breakdown for a proposed lineup or parlay bet before confirmation.
- **Usage:** Rendered in bet builder sidebar. Receives lineup legs and stake; calculates possible payout, implied probability, and tax.
- **Notes:** Uses helper `calculatePayout`; updates live as user edits stake; includes disclaimer text.
- **Status:** Critical betting UX component; not a candidate for removal.

---

## frontend/src/components/features/predictions/PatternRecognition.tsx

- **Purpose:** Detects recurring betting patterns (e.g., player over-performance) and flags them for user attention.
- **Usage:** Shown in advanced predictions view. Consumes processed pattern data via `usePatternDetection` hook and renders an accordion list with details.
- **Notes:** Heavy data pre-processing occurs server-side; ensure memoisation of mapped UI rows; add unit tests for pattern description utility.
- **Status:** Insight component; not a candidate for removal.

---

## frontend/src/components/predictions/PayoutPreviewPanel.tsx

- **Purpose:** Sidebar panel summarising potential payout, stake, and risk across multiple prediction selections prior to confirmation.
- **Usage:** Appears in manual predictions workflow; recalculates on selection change; highlights ROI and Kelly sizing suggestions.
- **Notes:** Shares `calculatePayout` helper with lineup `PayoutPreview`; duplication flagged for future refactor.
- **Status:** Important bet-building UI; not a candidate for removal.

---

## frontend/src/components/features/analytics/PerformanceAnalytics.tsx

- **Purpose:** Provides high-level performance analytics dashboards (ROI over time, hit rate, Sharpe ratio) for user portfolios.
- **Usage:** Accessed via analytics route. Fetches aggregated metrics via `usePerformanceAnalytics`, renders charts using Victory.
- **Notes:** Supports timeframe selector and export to CSV; heavy data so code-splitting recommended.
- **Status:** Key analytics page; not a candidate for removal.

---

## frontend/src/components/betting/PerformanceMetrics.tsx

- **Purpose:** Displays real-time performance metrics for current bet slip (expected value, variance, risk score).
- **Usage:** Rendered within bet builder. Updates as user edits slip; uses `useBetSlipMetrics` hook.
- **Notes:** Lightweight; consider merging with global metrics card component; ensure calculations sync with backend formulas.
- **Status:** Utility metrics component; not a candidate for removal.

---

## frontend/src/components/features/predictions/PredictionDisplay.tsx

- **Purpose:** Shows detailed prediction info (probability distribution, top factors, recommended stake) in expandable card.
- **Usage:** Used in predictions list and modals. Accepts prediction object, renders confidence bar, SHAP mini-chart, and action buttons.
- **Notes:** Memomised; add lazy load for heavy charts; ensure accessibility of expandable section.
- **Status:** Core prediction card; not a candidate for removal.

---

## frontend/src/components/features/predictions/PredictionEnhancement.tsx

- **Purpose:** Suggests ways to enhance a prediction (parlay combos, hedge bets) based on market conditions.
- **Usage:** Displayed beneath PredictionDisplay when risk profile allows; fetches suggestions via `/api/predictions/enhancements`.
- **Notes:** Experimental feature-flagged; monitor user engagement metrics; add fallback when API unavailable.
- **Status:** Experimental enhancement component; not a candidate for removal.

---

## frontend/src/components/prediction/PredictionExplanationModal.tsx

- **Purpose:** Modal window presenting a full explanation for a selected prediction, including SHAP waterfall, related news, and market movement.
- **Usage:** Triggered from PredictionDisplay or BetRecommendationList. Receives prediction ID, fetches explanation via `/api/predictions/:id/explain`, and renders tabs for factors, news, and odds history.
- **Notes:** Heavy charts—lazy loaded; adds keyboard accessibility (Esc, focus trap); integrated with close callback.
- **Status:** Enhances transparency; not a candidate for removal.

---

## frontend/src/components/prediction/PredictionForm.tsx

- **Purpose:** Collects feature inputs for generating a new prediction request manually.
- **Usage:** Appears on manual prediction route. Renders dynamic form fields from schema, validates via Zod, posts to backend, and shows results in PredictionDisplay.
- **Notes:** Uses React Hook Form and MUI; to be refactored for reusable DynamicForm component.
- **Status:** Key manual prediction UI; not a candidate for removal.

---

## frontend/src/components/predictions/PredictionGenerator.tsx

- **Purpose:** Automates generation of multiple predictions based on user-defined constraints (sport, market, confidence threshold).
- **Usage:** Embedded in advanced predictions page. Accepts generator config, calls `/api/predictions/generate` endpoint, streams progress updates, and populates predictions list.
- **Notes:** Uses SSE for streaming; consider WebSocket fallback; feature flagged for advanced users only.
- **Status:** Automation tool; not a candidate for removal.

---

## frontend/src/components/ui/PredictionSummaryCard.tsx

- **Purpose:** Compact card summarising a prediction with player, market, probability, and quick action buttons.
- **Usage:** Used in dashboards and lists where concise representation is needed. Accepts prediction object and optional onSelect handler.
- **Notes:** Shares confidence indicator component; accessible via aria labels; memoised for performance.
- **Status:** Reusable summary widget; not a candidate for removal.

---

## frontend/src/components/betting/PrizePicksInterface.tsx

- **Purpose:** Provides UI integration with PrizePicks for searching props and adding them to bet slip.
- **Usage:** Appears in prop search page. Fetches PrizePicks data via `/api/prizepicks` proxy, supports filters, and adds selections to Zustand betSlip store.
- **Notes:** Includes pagination and player search; ensure adherence to PrizePicks TOS.
- **Status:** External data integration; not a candidate for removal.

---

## frontend/src/components/betting/PrizePicksMLEngine.tsx

- **Purpose:** Displays AI-evaluated edges for PrizePicks lines using internal ML models.
- **Usage:** Embedded alongside PrizePicksInterface. Fetches line edges via `/api/prizepicks/edge`, highlights profitable lines, and allows quick add to slip.
- **Notes:** Performance heavy; uses debounce for search; monitoring flagged for backend latency.
- **Status:** Advanced integration component; not a candidate for removal.

---

## frontend/src/components/monitoring/PerformanceAlert.tsx

- **Purpose:** Visual alert banner indicating when performance metrics breach defined thresholds (e.g., model accuracy drop).
- **Usage:** Rendered by `PerformanceAlertContainer`. Accepts `alert` object containing severity, message, and timestamp; styles accordingly.
- **Notes:** Auto-dismiss after timeout unless critical; consider role-based display (admin only).
- **Status:** Monitoring UI; not a candidate for removal.

---

## frontend/src/components/monitoring/PerformanceAlertContainer.tsx

- **Purpose:** Aggregates and displays a stack of `PerformanceAlert` banners fetched from monitoring service.
- **Usage:** Mounted in dashboards. Subscribes to `usePerformanceAlerts` hook, maps over alerts, and positions them top-center.
- **Notes:** Handles duplicate suppression and max-visible count; integrates with toast system.
- **Status:** Monitoring wrapper; not a candidate for removal.

---

## frontend/src/components/monitoring/PerformanceDashboard.tsx

- **Purpose:** Comprehensive dashboard summarising system/model performance metrics (latency, error rate, accuracy, drift).
- **Usage:** Admin-only route. Fetches metrics via `/api/monitoring/metrics`, displays charts (latency heatmap, failure pie) and tables of incidents.
- **Notes:** Heavy; uses React-Vis; code-split; provides refresh interval selector.
- **Status:** Critical monitoring tool; not a candidate for removal.

---

## frontend/src/components/base/Progress.tsx

- **Purpose:** Generic progress bar component supporting determinate and indeterminate states.
- **Usage:** Used across forms, uploads, and background tasks. Accepts `value`, `max`, and `indeterminate` props.
- **Notes:** Styled with Tailwind; ARIA-compliant; small size footprint.
- **Status:** Utility component; not a candidate for removal.

---

## frontend/src/components/shared/ui/ProgressBar.tsx

- **Purpose:** Enhanced progress bar with labeled percentage, color variants, and striped animation.
- **Usage:** Embedded in dashboards and modals. Wraps `base/Progress` and adds theming; accepts `label` and `variant` props.
- **Notes:** Duplicate with `Progress` variants; consolidation recommended.
- **Status:** Visual utility; not a candidate for removal.

---

## frontend/src/components/analytics/PredictionConfidenceGraph.tsx

- **Purpose:** Renders line/area chart of average prediction confidence over time.
- **Usage:** Part of analytics pages. Consumes aggregated data via `useConfidenceData`, offers timeframe picker, and tooltips on hover.
- **Notes:** Implemented with Recharts; memoise data; future: add export PNG.
- **Status:** Analytics visualization; not a candidate for removal.

---

## frontend/src/components/auth/ProtectedRoute.tsx

- **Purpose:** Higher-order component that guards routes/pages, redirecting unauthenticated users to login.
- **Usage:** Wrapped around route elements in React Router. Checks `useAuth` token; if missing, navigates to `/login` with redirect state.
- **Notes:** Also supports role-based guard via `allowedRoles` prop. Consider migrating to `react-router-dom` v6 data APIs.
- **Status:** Security infrastructure; not a candidate for removal.

---

## frontend/src/components/Breadcrumb.tsx

- **Purpose:** Displays hierarchical navigation trail for improved orientation within nested pages.
- **Usage:** Placed at top of pages with depth >1. Accepts `items` array ({ label, href }), renders links separated by `>` icon.
- **Notes:** Supports truncation for long labels and mobile collapse; ARIA breadcrumbs implemented.
- **Status:** UX navigation aid; not a candidate for removal.

---

## frontend/src/components/Button.tsx

- **Purpose:** Standardised button component with size, variant, and loading states.
- **Usage:** Used throughout the app to ensure consistent styling. Props: `variant` (primary/secondary/ghost), `size`, `loading`, `icon`.
- **Notes:** Extends native `<button>`; disabled when loading; supports full-width; themeable via Tailwind classes.
- **Status:** Core UI primitive; not a candidate for removal.

---

## frontend/src/components/Card.tsx

- **Purpose:** Generic content container with shadow, padding, and optional header/footer slots.
- **Usage:** Wraps widgets, forms, and metrics. Props: `title`, `actions`, `children`; theme-aware background.
- **Notes:** Uses CSS grid for header layout; small file; consider extracting to shared/ui directory.
- **Status:** Core layout primitive; not a candidate for removal.

---

## frontend/src/components/Alert.tsx

- **Purpose:** Inline alert component for success, info, warning, and error messages.
- **Usage:** Embedded in forms and pages. Props: `type`, `message`, optional `onClose`; icon color varies by type.
- **Notes:** Accessible role="alert"; auto-dismiss optional; overlaps with toast system but serves inline scenarios.
- **Status:** Utility feedback component; not a candidate for removal.

---

## frontend/src/components/AnalyticsPage.tsx

- **Purpose:** High-level page composing multiple analytics widgets (PerformanceAnalytics, PredictionConfidenceGraph, MarketAnalysisDashboard).
- **Usage:** Route `/analytics`. Handles date range state, passes filters to child components, and lays out responsive grid.
- **Notes:** Implements lazy loading and suspense fallbacks; ensure dependency list for useEffect clean.
- **Status:** Major analytics route; not a candidate for removal.

---

## frontend/src/components/AppInitializer.tsx

- **Purpose:** Bootstraps core client services (stores, WebSocket, feature flags) before rendering the main application.
- **Usage:** Wrapped around router in `index.tsx`. Shows `LoadingScreen` while initialization promises resolve, then renders children.
- **Notes:** Sequential awaits could be parallelised; provides global error boundary; ensure cleanup on unmount for HMR.
- **Status:** Critical startup component; not a candidate for removal.

---

## frontend/src/components/AppShell.tsx

- **Purpose:** Primary layout wrapper providing `Header`, `Sidebar` (if desktop), and routed content area.
- **Usage:** Used by React Router as root element after authentication. Handles responsive side navigation collapse and theme provider.
- **Notes:** Leverages CSS Grid; exports context for sidebar toggle; consider splitting into smaller layout primitives.
- **Status:** Core application shell; not a candidate for removal.

---

## frontend/src/components/Arbitrage.tsx

- **Purpose:** High-level widget summarising detected arbitrage opportunities across bookmakers and sports.
- **Usage:** Appears on opportunities dashboard. Receives opportunities array and renders a sortable table with edge percentage and quick bet links.
- **Notes:** Utilises `useArbitrageData` hook; performance heavy sorting—consider memoisation.
- **Status:** Valuable analytics widget; not a candidate for removal.

---

## frontend/src/components/ArbitrageDetector.tsx

- **Purpose:** Service component polling odds APIs to compute arbitrage scenarios and update global store.
- **Usage:** Mounted once in `AppInitializer` (hidden). Runs interval loop, dispatches new opportunities to `arbitrageStore`.
- **Notes:** Should move heavy computation to web worker; ensure abort on logout.
- **Status:** Background service; not a candidate for removal.

---

## frontend/src/components/ArbitrageOpportunities.tsx

- **Purpose:** Page listing all current arbitrage opportunities with filters and bookmaker selection.
- **Usage:** Route `/arbitrage`. Fetches from store, filters by sport/bookmaker via `FilterBar`, and renders `OpportunitiesList`.
- **Notes:** Adds export CSV; infinite scroll; unit tests pending for filter logic.
- **Status:** Key arbitrage route; not a candidate for removal.

---

## frontend/src/components/ArbitragePage.tsx

- **Purpose:** Legacy wrapper page integrating `ArbitrageDetector` and `ArbitrageOpportunities` for backward compatibility.
- **Usage:** Redirects to new `/arbitrage` but still referenced by old bookmarks; displays deprecation banner.
- **Notes:** Marked for removal after migration period; candidate for deprecation.
- **Status:** Transitional legacy page; candidate for future removal.

---

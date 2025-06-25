# Frontend Hooks Documentation

This document provides a comprehensive breakdown of all custom React hooks found in `frontend/src/hooks`. Each entry includes purpose, usage, notes, and status.

---

## Table of Contents

- [Overview](#overview)
- [Custom Hooks](#custom-hooks)

---

## Overview

This directory contains custom hooks used throughout the frontend codebase. These hooks encapsulate stateful logic, side effects, and reusable behaviors for React components, supporting analytics, betting, UI utilities, and app infrastructure.

---

## Custom Hooks

### useAnalytics
- **Purpose:** Fetches and returns analytics metrics, trend deltas, and risk profiles for a given event, market, and selection.
- **Usage:** Used in analytics dashboards and betting components to retrieve and display up-to-date performance metrics, trends, and risk recommendations for specific bets or markets. Automatically fetches data from the analytics API and manages loading and error state.
- **Notes:** Returns sensible defaults if no data is available; encapsulates async fetching logic and error handling; can be extended for additional analytics features.
- **Status:** Actively used for analytics and performance tracking; not a candidate for removal.

### useAnimatedValue
- **Purpose:** Provides a hook for animating numeric values using spring or duration-based animation, supporting smooth transitions in UI components.
- **Usage:** Used in components that require animated transitions for numbers (e.g., counters, progress bars, dynamic charts). Offers `animateTo` function to trigger animations and supports custom spring or duration configs.
- **Notes:** Handles animation lifecycle, cancellation, and completion callbacks. Includes example usage for animated counters. Extensible for various animation needs.
- **Status:** Utility animation hook; actively used for interactive UI/UX.

### useCustomAnimation
- **Purpose:** Provides a custom animation controller hook based on Framer Motion, enabling reusable animation logic and controls for React components.
- **Usage:** Used in UI components to trigger, control, and sequence animations such as fade in/out, bounce, and custom transitions. Exposes animation controls and helper functions (`fadeIn`, `fadeOut`, etc.) for common effects.
- **Notes:** Supports custom duration, delay, and easing; includes example animation variants and helper hooks like `useOddsAnimation` for animating odds changes. Extensible for advanced animation needs.
- **Status:** Core animation utility; actively used for interactive and animated UI components.

### useApi
- **Purpose:** Provides a generic hook for making API requests using Axios, managing loading, error, and data state for asynchronous operations.
- **Usage:** Used in components to fetch or mutate data from REST APIs. Accepts an Axios config and initial data, returning state and a manual trigger function. Example: `const { data, loading, error, request } = useApi({ url: '/users', method: 'GET' });`
- **Notes:** Does not auto-fetch on mount by default; designed for flexibility and manual control. Can be extended for auto-fetch or additional behaviors. Supports type-safe responses.
- **Status:** Core data-fetching utility; actively used throughout the app for API interactions.

### useApiRequest
- **Purpose:** Provides a flexible hook for making API requests with built-in caching, retry logic, aborting, and validation support.
- **Usage:** Used in components to fetch data from APIs with caching and retry needs. Returns state including loading, error, and data, plus a `mutate` function for manual refresh. Example: `const { data, isLoading, mutate } = useApiRequest('/api/player/123');`
- **Notes:** Supports cache expiration, aborting in-flight requests, and custom error handling. Suitable for data that benefits from caching and background validation.
- **Status:** Advanced data-fetching utility; actively used for robust API integration.

### useAuth
- **Purpose:** Manages user authentication state, login, logout, and token validation for the frontend application.
- **Usage:** Used to provide authentication context and helpers to components. Handles token storage, user info retrieval, and redirects. Example: `const { user, login, logout, loading } = useAuth();`
- **Notes:** Integrates with backend API for user/session validation. Handles persistent login via localStorage and error state. Should be reviewed if authentication flows change.
- **Status:** Critical for app security and user sessions; actively maintained and used in core flows.

### useBettingAnalytics
- **Purpose:** Computes and returns betting statistics, performance metrics, and risk analytics for the user's active bets.
- **Usage:** Used in dashboards and analytics pages to display aggregated betting stats, ROI, win rates, best/worst bets, and risk metrics. Example: `const stats = useBettingAnalytics();`
- **Notes:** Uses memoization for performance; integrates with betting store for real-time updates. Extensible for additional metrics and historical analysis.
- **Status:** Essential for analytics and reporting features; actively used in user-facing dashboards.

### useBettingCore
- **Purpose:** Centralizes betting decision logic, performance metrics, and opportunity analysis for the active player and betting context.
- **Usage:** Used in betting pages and dashboards to analyze opportunities, track performance, and trigger betting decisions. Accepts options for player, metric, confidence, and callbacks for updates. Example: `const { decision, performance, opportunities } = useBettingCore({ playerId, metric });`
- **Notes:** Integrates with unified betting core service, supports auto-refresh, local storage sync, and error handling. Extensible for advanced betting analytics and real-time updates.
- **Status:** Core betting logic hook; actively used in main betting flows and analysis.

### useBettingData
- **Purpose:** Aggregates betting data, props, odds updates, and arbitrage opportunities for a given sport and prop type, with real-time updates and error handling.
- **Usage:** Used in betting dashboards and real-time opportunity displays to fetch and update player props, odds, and arbitrage opportunities. Example: `const { props, opportunities, isLoading } = useBettingData({ sport: 'NBA' });`
- **Notes:** Integrates with unified services and WebSocket manager for live data. Supports auto-refresh, error toasts, and is extensible for additional data feeds.
- **Status:** Actively used for real-time betting data aggregation and display.

### useBettingSettings
- **Purpose:** Manages retrieval and update of user betting settings, such as risk profile, stake size, model selection, and confidence threshold.
- **Usage:** Used in settings pages and betting configuration panels to read and update user preferences. Provides handlers for each setting and a reset function. Example: `const { settings, handleRiskProfileChange } = useBettingSettings();`
- **Notes:** Integrates with betting store for state management; supports async reset and error handling. Extensible for more settings and advanced configuration flows.
- **Status:** Actively used for user customization and settings management.

### useBettingStateMachine
- **Purpose:** Implements a state machine pattern for managing the betting flow, including selection, analysis, review, confirmation, submission, and error states.
- **Usage:** Used in complex betting UIs to handle step-by-step user flows, state transitions, and context management for the betting process. Example: `const { state, context, send } = useBettingStateMachine({ onStateChange, onSubmit });`
- **Notes:** Integrates with custom state machine hook, supports callbacks for state changes and submissions, and provides robust flow control for multi-step betting operations.
- **Status:** Actively used in advanced betting flows and multi-step UI components.

### useBookmakerAnalysis
- **Purpose:** Analyzes bookmaker data for a given player prop, providing suspicious level, warnings, adjusted probability, and risk score.
- **Usage:** Used in prop analysis and risk assessment UIs to display advanced bookmaker analytics for a selected prop. Example: `const { analysis, isLoading, error } = useBookmakerAnalysis(propData);`
- **Notes:** Integrates with the bookmaker analysis service, handles async fetching, error states, and null input. Extensible for additional analytics fields as needed.
- **Status:** Used in advanced analytics and risk dashboards for betting props.

### useClickOutside
- **Purpose:** Detects clicks or touches outside a referenced element and triggers a handler function.
- **Usage:** Used to close modals, dropdowns, or popovers when the user clicks outside the target element. Example: `const ref = useClickOutside(() => setIsOpen(false));`
- **Notes:** Supports both mouse and touch events. Returns a React ref to attach to the target element. Simple and reusable for any component needing outside click detection.
- **Status:** Common utility hook for interactive UI components.

### useClipboard
- **Purpose:** Provides clipboard copy functionality with feedback and optional success/error handling.
- **Usage:** Used in copy-to-clipboard buttons and features where users need to copy text. Example: `const { copied, copy } = useClipboard({ timeout: 1500 });`
- **Notes:** Supports browser clipboard API and fallback for older browsers. Exposes `copied` state, `copy` action, and a `reset` method. Customizable timeout and callbacks.
- **Status:** Common utility hook for user interaction and sharing features.

### useDarkMode
- **Purpose:** Manages dark mode state and toggling for the application, syncing with local storage and system preferences.
- **Usage:** Used in UI components and settings to enable or toggle dark mode. Example: `const { isDarkMode, toggleDarkMode } = useDarkMode();`
- **Notes:** Syncs state with local storage and updates the DOM root class. Listens for system preference changes and updates accordingly.
- **Status:** Common utility hook for theme management in modern web apps.

### useDataFetching
- **Purpose:** Centralizes data fetching for props, user stats, performance, and headlines using React Query, updating global store state.
- **Usage:** Used in dashboard and analytics pages to fetch and synchronize core app data. Example: `const { props, stats, performance, headlines } = useDataFetching();`
- **Notes:** Handles loading, errors, and cache updates. Integrates with the global store and provides built-in error notifications. Extensible for additional data types.
- **Status:** Core data hook for main app data flows and analytics.

### useDataSync
- **Purpose:** Synchronizes application data with local storage and remote sources, supporting offline changes, retries, and custom sync logic.
- **Usage:** Used to persist and sync user or app data across sessions and with backend APIs. Example: `const { data, sync, isSyncing } = useDataSync({ key: 'user', initialData, onSync });`
- **Notes:** Handles sync intervals, retry logic, error handling, and pending changes. Highly configurable for different data types and sync strategies.
- **Status:** Advanced utility hook for robust data synchronization and offline support.

### useDebounce
- **Purpose:** Delays updating a value until after a specified delay, minimizing unnecessary updates and expensive operations.
- **Usage:** Used to debounce user input (e.g., search fields) and avoid excessive API calls. Example: `const debouncedValue = useDebounce(value, 500);`
- **Notes:** Simple and reusable for any primitive or object value. Cleans up timers on value or delay change.
- **Status:** Essential utility hook for optimizing UI responsiveness and network usage.

### useDeviceMotion
- **Purpose:** Provides access to device motion and orientation data (acceleration, rotation, gravity) via the DeviceMotion API.
- **Usage:** Used in features requiring physical device movement data, such as motion-based UI, games, or analytics. Example: `const { acceleration, rotationRate } = useDeviceMotion();`
- **Notes:** Handles permission, error states, and cleans up listeners. Returns nulls if data is unavailable. Browser/device support may vary.
- **Status:** Specialized utility hook for motion-aware web applications.

### useDeviceOrientation
- **Purpose:** Provides access to device orientation data (alpha, beta, gamma, absolute) via the DeviceOrientation API.
- **Usage:** Used in features that need to react to device tilt or orientation, such as AR, games, or analytics. Example: `const { alpha, beta, gamma, absolute, error } = useDeviceOrientation();`
- **Notes:** Handles permission requests, error states, and cleans up listeners. Returns nulls if data is unavailable or unsupported. iOS requires explicit permission.
- **Status:** Specialized utility hook for orientation-aware web applications.

### useDriftDetection
- **Note:** This file is empty; no documentation is available at this time.

### useErrorBoundary
- **Purpose:** Provides a hook-based interface for error boundaries, allowing errors to be caught and handled in React function components.
- **Usage:** Call `showBoundary(error)` to catch and display errors, typically with a toast notification and console log. Used in UI components to gracefully handle runtime exceptions.
- **Notes:** Integrates with `react-toastify` for user-friendly error messages. Simplifies error handling in modern React codebases.
- **Status:** Utility hook for robust error handling in React apps.

### useErrorHandler
- **Purpose:** Provides a comprehensive error handling hook for React components, capturing, storing, and optionally rethrowing errors with contextual info.
- **Usage:** Returns error state, `handleError`, and `clearError` functions. Use `handleError(error, info)` to capture errors and optionally pass info/context. Useful for custom error boundaries, async operations, or integrating with error tracking services.
- **Notes:** Supports custom error handlers, optional rethrow, and development-only logging. Returns `hasError` flag for conditional UI rendering.
- **Status:** Flexible utility hook for robust, customizable error management in React apps.

### useEvolutionaryAnalytics
- **Purpose:** (Deprecated) Previously provided evolutionary analytics logic for the application.
- **Usage:** Do not use. This hook now throws an error and instructs developers to use `useUnifiedAnalytics` instead.
- **Notes:** Deprecated and unsupported. Any usage should be migrated to the recommended alternative.
- **Status:** Deprecated; candidate for removal.

### useFeatureImportance
- **Note:** This file is empty; no documentation is available at this time.

### useForm
- **Purpose:** Provides a reusable form management hook for React, handling form state, validation, and submission logic.
- **Usage:** Initialize with `initialValues`, optional validation rules, and an `onSubmit` callback. Returns form values, errors, touched state, and handlers for change, blur, and submit. Supports validation on change and blur.
- **Notes:** Generic and type-safe for any form shape. Customizable validation per field. Useful for building controlled forms with robust error handling and async submission.
- **Status:** Actively used; recommended for form logic in React components.

### useGeolocation
- **Purpose:** Provides a React hook for accessing and tracking the user's geolocation data (latitude, longitude, accuracy, etc.) in real time.
- **Usage:** Call `useGeolocation(options)` in a component to receive geolocation state (loading, coordinates, errors). Options include high accuracy, timeout, and cache age. Handles permission and error states gracefully.
- **Notes:** Uses the browser's Geolocation API. Returns detailed state including loading, error, and all location metrics. Useful for apps requiring location-based features or analytics.
- **Status:** Actively used; recommended for location-aware components.

### useHealthCheck
- **Purpose:** Provides a React hook for monitoring the health status of the backend API.
- **Usage:** Call `useHealthCheck()` in a component to receive a `healthStatus` object indicating if the backend is healthy, when it was last checked, and any errors. The hook automatically checks `/api/health` every 30 seconds.
- **Notes:** Useful for displaying backend status in dashboards or alerting users to connectivity issues. Handles errors and regular polling.
- **Status:** Actively used; recommended for health/status indicators in the UI.

### useHyperMLAnalytics
- **Note:** This file is empty; no documentation is available at this time.

### useInfiniteScroll
- **Purpose:** Provides a React hook to implement infinite scrolling for lists or feeds, loading more items as the user scrolls.
- **Usage:** Call `useInfiniteScroll(fetchMore, options)` in a component, passing an async function to fetch more items. Attach the returned `containerRef` to the scrollable element. The hook manages loading state, detects when more items should be loaded, and handles intersection observer setup.
- **Notes:** Supports threshold, root margin, and custom root via options. Handles errors and disables further loading if no more items are available. Ideal for paginated feeds or dynamic content lists.
- **Status:** Actively used; recommended for infinite scroll implementations in React.

### useInitializeApp
- **Purpose:** Initializes core application systems (event bus, performance monitor, unified betting system) and sets up global error handling when the app mounts.
- **Usage:** Use `useInitializeApp()` in the root component or main entrypoint to ensure all core services are ready before rendering the main UI. Returns `isInitialized` (boolean) and `error` (if any occurred during initialization).
- **Notes:** Starts a performance trace for initialization, ensures betting system is ready, and attaches a global error handler that publishes errors to the event bus. Handles async initialization and errors gracefully.
- **Status:** Essential for application startup; should be used once at the top level of the frontend app.

### useKeyboardShortcut
- **Purpose:** Provides a flexible React hook for registering custom keyboard shortcuts, including modifier keys, for improved user productivity and accessibility.
- **Usage:** Call `useKeyboardShortcut(shortcuts, options)` in a component, passing one or more shortcut configurations. Each config specifies the key, modifiers, and a handler function. The hook attaches a global keydown listener and invokes handlers on match.
- **Notes:** Supports arrays of shortcuts, modifier keys, and optional enabling/disabling. Includes predefined hooks for common actions:
  - `useEscapeKey(handler, enabled)`: Registers Escape key handler.
  - `useSaveShortcut(handler, enabled)`: Registers Ctrl+S/⌘+S handler.
  - `useUndoShortcut(handler, enabled)`: Registers Ctrl+Z/⌘+Z handler.
  - `useRedoShortcut(handler, enabled)`: Registers Ctrl+Y/⌘+Y or Ctrl+Shift+Z/⌘+Shift+Z handler.
- **Status:** Versatile and actively used; recommended for implementing keyboard shortcuts in React apps.

### useLineupAPI
- **Purpose:** Provides a set of hooks and utilities for interacting with player lineups, including fetching players, submitting lineups, and filtering by position, team, salary, and confidence.
- **Usage:** Use `useLineupAPI()` in components that require player data or lineup submission. Exposes player data, loading state, error, a mutation to submit lineups, and filtering utilities.
- **Notes:** Integrates with React Query for caching and mutation. Filters support multiple criteria. Automatically invalidates queries on lineup submission for fresh data.
- **Status:** Actively used; recommended for lineup management and player selection features.

### useLiveOdds
- **Purpose:** Provides real-time odds updates for sports props via WebSocket, supporting filtering by sport, prop type, and minimum odds change.
- **Usage:** Use `useLiveOdds(options)` in components that display live odds or require real-time updates. Returns updates, active props, and subscription utilities.
- **Notes:** Uses a WebSocket connection to receive updates. Filters significant changes and triggers notifications for large movements. Maintains a capped history of updates for performance.
- **Status:** Essential for live odds features; actively used in real-time UI components.

### useLocalStorage
- **Purpose:** Custom React hook for persisting state to localStorage, providing a stateful value and a setter that syncs with browser storage.
- **Usage:** Use `useLocalStorage(key, initialValue)` in any component to bind a piece of state to a localStorage key. The setter updates both React state and storage.
- **Notes:** Handles JSON serialization, cross-tab sync via custom events, and safe fallback for SSR. Warns on errors or non-browser environments.
- **Status:** Utility; widely used for user preferences, theme, and persistent UI state.

### useLogger
- **Purpose:** Context-based logging utility for React apps, providing log, error, warn, and info methods via a custom hook.
- **Usage:** Wrap your app in `LoggerProvider` and use `useLogger()` in components to log messages. Enforces usage within provider context.
- **Notes:** Simple wrapper around console methods. Ensures consistent logging and enables future extension for remote logging or log aggregation.
- **Status:** Utility; recommended for standardized logging in React components.

### useMLAnalytics
- **Note:** This file is empty; no documentation is available at this time.

### useMLSimulation
- **Purpose:** Provides an interface to a machine learning simulation service for generating predictions, retrieving team/player stats, and simulating game outcomes.
- **Usage:** Use `useMLSimulation()` in components that require simulated ML predictions or stats. Exposes initialization state, error handling, and methods to generate predictions and retrieve stats.
- **Notes:** Relies on an external `MLSimulationService`. Ensures simulation is initialized before use. Handles errors gracefully.
- **Status:** Used for analytics, simulations, and advanced prediction features.

### useMediaQuery
- **Purpose:** Detects and provides information about current media queries, such as device type, orientation, dark mode, and reduced motion preferences.
- **Usage:** Use `useMediaQuery()` to get a state object with flags for mobile, tablet, desktop, orientation, and accessibility preferences. Useful for responsive UI logic.
- **Notes:** Listens to window matchMedia events and updates state on changes. Supports a comprehensive set of media queries for modern UI needs.
- **Status:** Utility; widely used for responsive and adaptive interfaces.

### useMetrics
- **Note:** This file is empty; no documentation is available at this time.

### useModelCalibration
- **Purpose:** Fetches and manages model calibration data, including calibration curves and Brier scores, for evaluating prediction confidence.
- **Usage:** Use `useModelCalibration()` to access calibration data, loading state, and error info. Provides a method to fetch calibration from an API and access the latest calibration results.
- **Notes:** Integrates with authentication for secure API access. Handles loading and error states. Useful for analytics and model evaluation dashboards.
- **Status:** Used in advanced analytics and model evaluation features.

### useNetworkStatus
- **Note:** This file is empty; no documentation is available at this time.

### useNotificationCenter
- **Purpose:** Manages notifications within the app, allowing components to add and remove notifications of various types (success, error, info).
- **Usage:** Use `useNotificationCenter()` to get the current notifications array and methods to add or remove notifications. Useful for global toasts or alert systems.
- **Notes:** Generates unique IDs for each notification and timestamps them. Notifies via state updates. Labeled as needing tests.
- **Status:** Utility; used for user-facing notifications and alerts.

### usePerformance
- **Note:** This file is empty; no documentation is available at this time.

### usePrediction
- **Purpose:** Provides an interface for making ML predictions and retrieving general insights, managing loading and error state.
- **Usage:** Use `usePrediction()` to make predictions based on features, retrieve insights, and access the latest prediction and error/loading state. Returns async methods for prediction and insight retrieval.
- **Notes:** Integrates with a prediction service and applies a confidence threshold before storing predictions. Handles errors and loading state for both predictions and insights.
- **Status:** Used for prediction forms, analytics, and ML-driven UI components.

### usePredictionService
- **Purpose:** Manages prediction requests, event bus communication, error handling, and performance monitoring for predictions.
- **Usage:** Use `usePredictionService()` to request predictions for a given risk profile, leveraging event-driven architecture and model versioning. Handles performance metrics and error recovery.
- **Notes:** Integrates with event bus, error handler, and performance monitor singletons. Implements retryable error strategies. Suitable for advanced/enterprise prediction flows.
- **Status:** Used in core prediction pipelines and advanced analytics features.

### usePredictions
- **Purpose:** Manages a list of predictions, including streaming updates, confidence scoring, and feature impact analysis.
- **Usage:** Use `usePredictions()` to access an array of predictions, loading/error state, and helper methods for confidence color and model output processing. Integrates with unified service registry and analytics.
- **Notes:** Supports streaming via WebSocket, advanced model output parsing, and confidence-based color coding. Suitable for dashboards and live analytics.
- **Status:** Used in prediction dashboards and analytics UIs.


### useProps
- **Purpose:** Fetches and manages player props and arbitrage opportunities, supporting auto-refresh and filtering by sport/prop type.
- **Usage:** Use `useProps({ autoRefresh, refreshInterval, sport, propType })` to retrieve props and opportunities, loading/error state, and to trigger manual/automatic refreshes. Useful for prop dashboards and betting UIs.
- **Notes:** Integrates with daily fantasy and odds services, uses global store for toasts, and supports error handling. Can be extended for additional prop analysis.
- **Status:** Core for props/markets features and arbitrage analysis.

### useQueryBuilder
- **Purpose:** Provides a flexible, reusable hook for building and managing data queries with caching, refetching, and transformation.
- **Usage:** Use `useQueryBuilder(config, options)` to define API queries, transform results, handle loading/error state, and enable polling or manual refetch. Returns data, state, and query helpers.
- **Notes:** Supports dependency-based refetch, caching, retries, and custom success/error handlers. Suitable for all API-driven UIs.
- **Status:** Used throughout the app for data fetching and query management.

### useRealtimeData
- **Purpose:** Manages real-time data streams over WebSocket, including connection state, error handling, and message processing.
- **Usage:** Use `useRealtimeData({ url, initialData, onMessage, ... })` to subscribe to live data, handle reconnections, and send/receive messages. Returns data, connection state, and helpers for subscriptions.
- **Notes:** Supports custom event handlers, reconnection logic, and heartbeat. Useful for live odds, alerts, and streaming features.
- **Status:** Used in real-time dashboards and alerting systems.

### useRiskProfile
- **Purpose:** Manages risk profiles and validates bets against active risk constraints.
- **Usage:** Use `useRiskProfile()` to access and update active risk profiles, validate bets, and handle loading/error state. Returns profiles, active profile, and validation helpers.
- **Notes:** Integrates with event bus, error handler, and performance monitor. Supports extensible validation logic.
- **Status:** Used in betting forms, compliance, and risk management features.

### useRealtimePredictions
- **Purpose:** Handles real-time prediction updates via WebSocket, managing connection, reconnection, and state updates.
- **Usage:** Use `useRealtimePredictions({ enabled, channels, ... })` to receive live prediction data and update UI in response to backend events. Returns connection state and manages toast notifications.
- **Notes:** Integrates with React Query for cache updates and toast for user feedback. Handles reconnection and error scenarios.
- **Status:** Used in live prediction dashboards and analytics.

### useScrollPosition
- **Purpose:** (File outline not available; presumed) Tracks and provides the current scroll position of a target element or window for UI effects.
- **Usage:** Use `useScrollPosition()` to get the current scroll offset, subscribe to scroll events, or trigger UI changes based on scroll.
- **Notes:** Commonly used for sticky headers, infinite scroll, or scroll-based animations.
- **Status:** Utility for UI/UX enhancements.

### useSettings
- **Purpose:** Manages application-wide user settings (dark mode, logging, mocks), persisting them to localStorage.
- **Usage:** Use `useSettings()` to access and update settings. Changes are automatically saved to localStorage and reflected across the app.
- **Notes:** Provides a simple interface for updating settings; default values are provided for new users.
- **Status:** Used in settings panels and feature toggles.

### useShapData
- **Purpose:** Fetches and manages SHAP explainability data for a given event/model, transforming it for UI consumption.
- **Usage:** Use `useShapData({ eventId, modelType })` to retrieve SHAP values, loading state, and errors. Returns feature impact data for explainability dashboards.
- **Notes:** Normalizes SHAP values and supports error/loading handling. Useful for ML explainability and analytics.
- **Status:** Used in explainability and analytics features.

### useSmartAlerts
- **Purpose:** Manages real-time smart alerts (injuries, lineups, weather, etc.) with unread tracking and WebSocket integration.
- **Usage:** Use `useSmartAlerts({ enabledTypes, minSeverity, wsEndpoint, onNewAlert })` to receive, mark, and clear alerts. Returns alerts, unread count, and connection state.
- **Notes:** Integrates with `useRealtimeData` for live updates. Supports alert filtering and severity levels.
- **Status:** Used in alerting systems and dashboards.

### useSportsFilter
- **Purpose:** Manages the active sports filter and sports list, supporting toggling and selection for filtering UI.
- **Usage:** Use `useSportsFilter()` to get/set active sport, toggle sports, and manage the available sports list. Returns state and helper methods.
- **Notes:** Uses Zustand for state management. Default sports are provided and can be extended.
- **Status:** Used in filter bars and sports navigation.

### useSportsNews
- **Purpose:** Fetches and manages sports news articles from the news service, mapping and storing them for UI display.
- **Usage:** Use `useSportsNews()` to retrieve articles, loading state, and errors. Maps raw headlines to article objects for rendering.
- **Notes:** Integrates with ESPN/news service, supports error/loading handling, and is extensible for other sources.
- **Status:** Used in news widgets and dashboards.

### useStateMachine
- **Purpose:** Provides a generic, type-safe state machine hook for managing complex UI or business logic state transitions.
- **Usage:** Use `useStateMachine({ initial, states, context, onTransition })` to define states/events, transition logic, and history. Returns state, context, send/can/matches helpers, and transition history.
- **Notes:** Supports guards, actions, entry/exit hooks, and transition callbacks. Includes example usage for betting flows.
- **Status:** Used in multi-step forms, wizards, and advanced UI state management.

### useStorage
- **Purpose:** Provides a unified interface to clear all browser storage (localStorage, sessionStorage, IndexedDB, Cache API).
- **Usage:** Use `useStorage()` to access the `clearAllCaches` async method, which clears all supported browser caches and storage.
- **Notes:** Useful for debugging, user data reset, and ensuring a clean state during development or troubleshooting.
- **Status:** Utility for maintenance and developer tools.

### useStore
- **Purpose:** Centralized Zustand-powered state management for user, props, entries, metrics, UI state, and betting records.
- **Usage:** Use `useStore()` to access and update global app state, including authentication, props, entries, metrics, UI flags, and betting records.
- **Notes:** Includes persistent storage, devtools integration, and a comprehensive set of actions for all major app domains.
- **Status:** Core to global state management across the frontend.

### useTheme
- **Purpose:** Manages theme mode (light, dark, system) and applies the correct theme to the document root.
- **Usage:** Use `useTheme()` to get/set theme mode, resolve system theme, and update the UI accordingly. Theme is persisted in localStorage.
- **Notes:** Supports system preference detection and live updates on system theme change.
- **Status:** Used in theme toggles and UI personalization.

### useThemeStore
- **Purpose:** Zustand-powered persistent store for theme preference (light, dark, system).
- **Usage:** Use `useThemeStore()` to get/set the current theme, which is saved in localStorage for persistence across sessions.
- **Notes:** Simple, focused store for theme state, designed to work with UI theme toggles.
- **Status:** Utility for consistent theming.

### useTimeSeries
- **Purpose:** Fetches and manages time series prediction data, including forecasts and historical values.
- **Usage:** Use `useTimeSeries()` to access time series data, loading/error state, and helper methods for latest/history retrieval. Integrates with authentication for secure API access.
- **Notes:** Handles loading/error state, supports feature-specific history, and is useful for analytics and charting.
- **Status:** Used in analytics dashboards and time series visualizations.

### useUltraMLAnalytics
- **Purpose:** (File outline not available; presumed) Provides analytics and metrics for advanced ML models or ensembles.
- **Usage:** Use `useUltraMLAnalytics()` to retrieve advanced analytics, model insights, or feature importances for ultra ML models.
- **Notes:** Intended for advanced analytics dashboards or model explainability features.
- **Status:** Utility for ML analytics.

### useUnifiedAnalytics
- **Purpose:** Unified analytics hook aggregating ML, performance, drift, betting, and real-time analytics via a single interface.
- **Usage:** Use `useUnifiedAnalytics(config)` to fetch and manage analytics data for ML, performance, drift, betting, and real-time metrics. Returns state for each analytics domain.
- **Notes:** Integrates with React Query, unified service registry, and WebSocket manager. Supports extensible config for analytics domains.
- **Status:** Used in analytics dashboards and unified reporting.

### useUnifiedBetting
- **Purpose:** Provides unified access to betting system analysis and decision-making for a player/metric, with auto-refresh and callbacks.
- **Usage:** Use `useUnifiedBetting({ playerId, metric, ... })` to analyze betting opportunities, receive updates, and handle errors. Supports auto-refresh and custom callbacks for new opportunities.
- **Notes:** Integrates with a singleton betting system, supports extensible analysis, and error handling.
- **Status:** Used in betting dashboards and opportunity analysis.

### useVirtualList
- **Purpose:** Efficiently renders large lists by only rendering visible items, supporting virtualization and smooth scrolling.
- **Usage:** Use `useVirtualList(items, { itemHeight, overscan, containerHeight })` to get virtual items, total height, and scroll helpers. Attach `containerRef` to the scrollable container.
- **Notes:** Optimizes performance for large lists, supports resize observation and scroll-to-index.
- **Status:** Used in data tables, long lists, and performance-sensitive UIs.

### useWindowResize
- **Purpose:** Tracks window size and provides responsive flags (isMobile, isTablet, isDesktop, isLargeDesktop) for adaptive UI.
- **Usage:** Use `useWindowResize()` to get the current window size and device type flags. Updates on window resize events.
- **Notes:** Useful for responsive layouts, breakpoints, and adaptive rendering.
- **Status:** Used in responsive components and layout managers.

### useWebSocket
- **Purpose:** Manages a WebSocket connection with auto-reconnect, message handling, and toast notifications for errors.
- **Usage:** Use `useWebSocket({ url, onMessage, ... })` to establish a WebSocket connection, handle messages, and manage reconnections/errors.
- **Notes:** Integrates with global store for toasts, supports exponential backoff, and handles connection lifecycle.
- **Status:** Used in real-time features and streaming data handlers.

### useWindowSize
- **Purpose:** Tracks window size and device type (mobile/tablet/desktop) with debounced resize handling and media query helpers.
- **Usage:** Use `useWindowSize({ debounceMs, mobileBreakpoint, tabletBreakpoint })` to get window size and device flags. Includes `useMediaQuery`, `useIsMobile`, `useIsTablet`, and `useIsDesktop` helpers.
- **Notes:** Supports debounced updates and custom breakpoints. Useful for responsive and adaptive UI.
- **Status:** Used in responsive layouts and device-specific rendering.

### useSettings
- **Purpose:** Manages application-wide user settings (dark mode, logging, mocks), persisting them to localStorage.
- **Usage:** Use `useSettings()` to access and update settings. Changes are automatically saved to localStorage and reflected across the app.
- **Notes:** Provides a simple interface for updating settings; default values are provided for new users.
- **Status:** Used in settings panels and feature toggles.

### useShapData
- **Purpose:** Fetches and manages SHAP explainability data for a given event/model, transforming it for UI consumption.
- **Usage:** Use `useShapData({ eventId, modelType })` to retrieve SHAP values, loading state, and errors. Returns feature impact data for explainability dashboards.
- **Notes:** Normalizes SHAP values and supports error/loading handling. Useful for ML explainability and analytics.
- **Status:** Used in explainability and analytics features.

### useSmartAlerts
- **Purpose:** Manages real-time smart alerts (injuries, lineups, weather, etc.) with unread tracking and WebSocket integration.
- **Usage:** Use `useSmartAlerts({ enabledTypes, minSeverity, wsEndpoint, onNewAlert })` to receive, mark, and clear alerts. Returns alerts, unread count, and connection state.
- **Notes:** Integrates with `useRealtimeData` for live updates. Supports alert filtering and severity levels.
- **Status:** Used in alerting systems and dashboards.

### useSportsFilter
- **Purpose:** Manages the active sports filter and sports list, supporting toggling and selection for filtering UI.
- **Usage:** Use `useSportsFilter()` to get/set active sport, toggle sports, and manage the available sports list. Returns state and helper methods.
- **Notes:** Uses Zustand for state management. Default sports are provided and can be extended.
- **Status:** Used in filter bars and sports navigation.

### useSportsNews
- **Purpose:** Fetches and manages sports news articles from the news service, mapping and storing them for UI display.
- **Usage:** Use `useSportsNews()` to retrieve articles, loading state, and errors. Maps raw headlines to article objects for rendering.
- **Notes:** Integrates with ESPN/news service, supports error/loading handling, and is extensible for other sources.
- **Status:** Used in news widgets and dashboards.
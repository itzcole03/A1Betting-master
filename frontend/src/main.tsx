import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import ViteErrorBoundary from "./components/ViteErrorBoundary.tsx";
import { logger } from "./utils/logger";

// Import styles exactly like the prototype
import "./index.css";
import "./styles/global-cyber-theme.css";
import "./styles/prototype-override.css";
import "./styles/force-prototype.css";
import "./styles/enhanced-animations.css";

logger.info(
  "🚀 A1Betting Platform Loading - Production Mode",
  {
    environment: import.meta.env.MODE,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
  },
  "Bootstrap",
);

// Handle production error reporting
window.addEventListener("error", (event) => {
  // Suppress known Vite development issues in production
  if (
    event.error?.message?.includes(
      "Cannot read properties of undefined (reading 'frame')",
    )
  ) {
    logger.warn(
      "Vite error overlay issue suppressed",
      event.error,
      "Bootstrap",
    );
    event.preventDefault();
    return;
  }

  // Log all other errors for production monitoring
  logger.error(
    "Global error caught",
    {
      message: event.error?.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack,
    },
    "Global",
  );
});

// Handle unhandled promise rejections
window.addEventListener("unhandledrejection", (event) => {
  // Properly serialize the error reason
  const errorDetails = {
    reasonType: typeof event.reason,
    reasonString: String(event.reason),
    message: event.reason?.message || "No message",
    stack: event.reason?.stack || "No stack trace",
    name: event.reason?.name || "Unknown error",
    code: event.reason?.code,
    cause: event.reason?.cause,
  };

  // Try to extract more details if it's an Error object
  if (event.reason instanceof Error) {
    errorDetails.message = event.reason.message;
    errorDetails.stack = event.reason.stack || "No stack trace";
    errorDetails.name = event.reason.name;
  }

  logger.error("Unhandled promise rejection detected", errorDetails, "Global");

  // Also log to console for immediate debugging
  console.error("Unhandled promise rejection:", event.reason);

  // Prevent the default browser handling to avoid "Uncaught (in promise)" errors
  event.preventDefault();
});

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ViteErrorBoundary>
      <App />
    </ViteErrorBoundary>
  </React.StrictMode>,
);

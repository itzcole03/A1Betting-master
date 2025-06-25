import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
// Import styles exactly like the prototype
import "./index.css";
import "./styles/global-cyber-theme.css";
import "./styles/prototype-override.css";
import "./styles/force-prototype.css";
import "./styles/enhanced-animations.css";
console.log("🚀 A1Betting Platform Loading - Prototype Match Mode");
const rootElement = document.getElementById("root");
if (!rootElement)
    throw new Error("Failed to find the root element");
const root = ReactDOM.createRoot(rootElement);
root.render(_jsx(React.StrictMode, { children: _jsx(App, {}) }));

import React from "react";
import { useTheme } from "../providers/UniversalThemeProvider";

const ThemeDemo: React.FC = () => {
  const { theme, variant, isDark, toggleDarkMode } = useTheme();

  return (
    <div
      style={{
        padding: "24px",
        minHeight: "100vh",
        background: theme.colors.background,
        color: theme.colors.text.primary,
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "32px",
          }}
        >
          <h1 style={{ margin: "0", color: theme.colors.text.primary }}>
            🎨 Cyber Theme System Demo
          </h1>
          <button
            onClick={toggleDarkMode}
            style={{
              background: theme.gradients.primary,
              border: "none",
              padding: "8px 16px",
              borderRadius: "8px",
              color: "#000",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {isDark ? "☀️" : "🌙"} {isDark ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gap: "24px",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          }}
        >
          {/* Theme Info Card */}
          <div
            className="glass-card"
            style={{ padding: "24px", borderRadius: "12px" }}
          >
            <h3
              style={{ margin: "0 0 16px 0", color: theme.colors.text.primary }}
            >
              Current Theme
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <div style={{ color: theme.colors.text.secondary }}>
                <strong>Variant:</strong> {variant}
              </div>
              <div style={{ color: theme.colors.text.secondary }}>
                <strong>Mode:</strong> {isDark ? "Dark" : "Light"}
              </div>
              <div style={{ color: theme.colors.text.secondary }}>
                <strong>Primary Color:</strong>
                <span
                  style={{
                    display: "inline-block",
                    width: "20px",
                    height: "20px",
                    backgroundColor: theme.colors.primary,
                    marginLeft: "8px",
                    borderRadius: "4px",
                    verticalAlign: "middle",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Color Palette Card */}
          <div
            className="glass-card"
            style={{ padding: "24px", borderRadius: "12px" }}
          >
            <h3
              style={{ margin: "0 0 16px 0", color: theme.colors.text.primary }}
            >
              Color Palette
            </h3>
            <div
              style={{
                display: "grid",
                gap: "12px",
                gridTemplateColumns: "repeat(2, 1fr)",
              }}
            >
              {Object.entries(theme.colors).map(([key, value]) => {
                if (typeof value === "string") {
                  return (
                    <div
                      key={key}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <div
                        style={{
                          width: "16px",
                          height: "16px",
                          backgroundColor: value,
                          borderRadius: "4px",
                          border: "1px solid rgba(255,255,255,0.2)",
                        }}
                      />
                      <span
                        style={{
                          fontSize: "12px",
                          color: theme.colors.text.muted,
                        }}
                      >
                        {key}
                      </span>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>

          {/* Interactive Elements Card */}
          <div
            className="glass-card"
            style={{ padding: "24px", borderRadius: "12px" }}
          >
            <h3
              style={{ margin: "0 0 16px 0", color: theme.colors.text.primary }}
            >
              Interactive Elements
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <button
                className="cyber-btn"
                style={{
                  background: theme.gradients.primary,
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  color: isDark ? "#000" : "#000",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Primary Button
              </button>

              <button
                style={{
                  background: theme.colors.surface,
                  border: `1px solid ${theme.colors.border}`,
                  padding: "12px 24px",
                  borderRadius: "8px",
                  color: theme.colors.text.primary,
                  fontWeight: "500",
                  cursor: "pointer",
                }}
              >
                Secondary Button
              </button>

              <input
                type="text"
                placeholder="Sample input..."
                style={{
                  background: theme.colors.surface,
                  border: `1px solid ${theme.colors.border}`,
                  padding: "12px 16px",
                  borderRadius: "8px",
                  color: theme.colors.text.primary,
                  fontSize: "14px",
                }}
              />
            </div>
          </div>

          {/* Typography Card */}
          <div
            className="glass-card"
            style={{ padding: "24px", borderRadius: "12px" }}
          >
            <h3
              style={{ margin: "0 0 16px 0", color: theme.colors.text.primary }}
            >
              Typography
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <h1
                style={{
                  margin: "0",
                  color: theme.colors.text.primary,
                  fontSize: "24px",
                }}
              >
                Heading 1
              </h1>
              <h2
                style={{
                  margin: "0",
                  color: theme.colors.text.primary,
                  fontSize: "20px",
                }}
              >
                Heading 2
              </h2>
              <p style={{ margin: "0", color: theme.colors.text.secondary }}>
                Body text with secondary color
              </p>
              <p
                style={{
                  margin: "0",
                  color: theme.colors.text.muted,
                  fontSize: "14px",
                }}
              >
                Muted text for captions and hints
              </p>
              <div
                className="holographic"
                style={{ fontSize: "18px", fontWeight: "900" }}
              >
                Holographic Text Effect
              </div>
            </div>
          </div>

          {/* Status Indicators Card */}
          <div
            className="glass-card"
            style={{ padding: "24px", borderRadius: "12px" }}
          >
            <h3
              style={{ margin: "0 0 16px 0", color: theme.colors.text.primary }}
            >
              Status Indicators
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <div className="status-dot status-active"></div>
                <span style={{ color: theme.colors.text.secondary }}>
                  Active Status
                </span>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <div className="status-dot status-warning"></div>
                <span style={{ color: theme.colors.text.secondary }}>
                  Warning Status
                </span>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <div className="status-dot status-error"></div>
                <span style={{ color: theme.colors.text.secondary }}>
                  Error Status
                </span>
              </div>
            </div>
          </div>

          {/* Effects Demo Card */}
          <div
            className="glass-card animate-float"
            style={{ padding: "24px", borderRadius: "12px" }}
          >
            <h3
              style={{ margin: "0 0 16px 0", color: theme.colors.text.primary }}
            >
              Effects & Animations
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <div
                className="shadow-neon"
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  background: theme.colors.surface,
                  textAlign: "center",
                  color: theme.colors.text.primary,
                }}
              >
                Neon Shadow Effect
              </div>
              <div
                className="animate-cyber-pulse"
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  background: theme.gradients.primary,
                  textAlign: "center",
                  color: "#000",
                  fontWeight: "600",
                }}
              >
                Cyber Pulse Animation
              </div>
              <div
                className="cyber-loading"
                style={{ height: "4px", borderRadius: "2px" }}
              ></div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "32px", textAlign: "center" }}>
          <p style={{ color: theme.colors.text.muted, fontSize: "14px" }}>
            Toggle between cyber light and dark modes to see the theme in
            action! 🌟
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThemeDemo;

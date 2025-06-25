import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import { backendPlugin } from "./vite-backend-plugin";

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@stores": path.resolve(__dirname, "src/stores"),
      "@/hooks": path.resolve(__dirname, "src/hooks"),
      "@/components": path.resolve(__dirname, "src/components"),
      "@/lib": path.resolve(__dirname, "src/lib"),
      "@/types": path.resolve(__dirname, "src/types"),
      "@/utils": path.resolve(__dirname, "src/utils"),
      "@/services": path.resolve(__dirname, "src/services"),
      "@": path.resolve(__dirname, "src"),
    },
  },
  plugins: [react(), backendPlugin()],
  server: {
    port: 5173,
    host: true,
    hmr: {
      overlay: false, // Disable overlay to prevent WebSocket errors
      clientPort: 5173,
      port: 24678, // Use different port for HMR WebSocket
    },
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
        ws: false,
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            console.log("proxy error", err);
          });
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            console.log("Sending Request to the Target:", req.method, req.url);
          });
          proxy.on("proxyRes", (proxyRes, req, _res) => {
            console.log(
              "Received Response from the Target:",
              proxyRes.statusCode,
              req.url,
            );
          });
        },
      },
      "/health": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            console.log("health proxy error", err);
          });
        },
      },
      "/ws": {
        target: "ws://localhost:8000",
        ws: true,
        changeOrigin: true,
      },
    },
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress certain warnings
        if (warning.code === "UNRESOLVED_IMPORT") return;
        warn(warning);
      },
    },
  },
  optimizeDeps: {
    include: [
      "@radix-ui/react-tabs",
      "@radix-ui/react-slot",
      "@radix-ui/react-label",
      "class-variance-authority",
      "clsx",
      "tailwind-merge",
    ],
  },
});

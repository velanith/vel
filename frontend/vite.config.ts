import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // Forward local API calls to backend to avoid serving index.html
      "/api": {
        target: process.env.VITE_PROXY_API_TARGET || "http://localhost:3000",
        changeOrigin: true,
        // keep path as-is; adjust rewrite if your backend doesn't prefix /api
        // rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});

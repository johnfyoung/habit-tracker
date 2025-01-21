import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      pwaAssets: {
        disabled: false,
        config: true,
      },
      devOptions: {
        enabled: false,
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        sourcemap: true,
        clientsClaim: true,
      },
      manifest: {
        name: "Habit Basics App",
        short_name: "Habit Basics",
        description: "Your personal basic habit tracking application",
        theme_color: "#2196f3",
      },
    }),
  ],
  server: {
    port: 3000,
    host: true, // Add this line
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

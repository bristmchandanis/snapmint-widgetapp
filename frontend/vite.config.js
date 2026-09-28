import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
  server: {
    host: true,
    port: 5173,
    allowedHosts: [
      ".ngrok.io",
      ".ngrok-free.app",
      ".trycloudflare.com",
      ".devtunnels.ms",
    ],
    hmr: {
      overlay: false,
    },
  },
  base: "/admin",
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";
import path from "node:path";

// SINGLEFILE=1 → empaqueta todo (JS+CSS) en un único index.html autocontenido,
// pensado para compartir y abrir con doble clic (file://). Usa hash routing.
const singleFile = process.env.SINGLEFILE === "1";

export default defineConfig({
  base: singleFile ? "./" : "/",
  plugins: [react(), ...(singleFile ? [viteSingleFile()] : [])],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  server: {
    port: 5173,
    // Proxy a la API del backend para evitar CORS en desarrollo.
    proxy: {
      "/api": { target: "http://localhost:3000", changeOrigin: true },
    },
  },
});

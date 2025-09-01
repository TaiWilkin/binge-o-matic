import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  base: "/",
  optimizeDeps: {
    exclude: ["graphql"],
  },
  ssr: {
    external: ["graphql"],
  },
  server: {
    proxy: {
      "/graphql": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

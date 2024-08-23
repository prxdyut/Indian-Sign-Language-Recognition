import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      "@tensorflow/tfjs-core",
      "@tensorflow/tfjs-converter",
      "@tensorflow/tfjs-backend-webgl",
    ],
  },
});

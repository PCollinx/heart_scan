import { defineConfig } from "vite";
import { resolve } from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/heart_scan/",
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        predict: resolve(__dirname, "src/pages/predict.html"),
        about: resolve(__dirname, "src/pages/about.html"),
      },
    },
  },
});

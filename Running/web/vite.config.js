import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  build: {
    outDir: "dist",
    assetsDir: "assets", 
  },
  base: "/running/", 
  plugins: [react(), tailwindcss()],
  resolve: {
    extensions: [".js", ".jsx"],
  },
});

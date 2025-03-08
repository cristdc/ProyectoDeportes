import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
   build: {
    outDir: "dist", 
    assetsDir: "", 
  },
  base: "/running",
  plugins: [react(), tailwindcss()],
  resolve: {
    extensions: [".js", ".jsx"],
  },
});

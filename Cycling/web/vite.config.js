import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  build: {
    outDir: "dist",
    assetsDir: "assets",
    rollupOptions: {
      external: ['js-cookie']
    }
  },
  base: "/cycling/", 
  plugins: [react(), tailwindcss()],
  resolve: {
    extensions: [".js", ".jsx"],
  },
});

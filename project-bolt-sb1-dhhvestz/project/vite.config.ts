import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        widget: path.resolve(__dirname, 'src/widget-entry.tsx'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          return chunkInfo.name === 'widget' ? 'widget.js' : '[name].[hash].js';
        },
      },
    },
  },
});
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Configure absolute paths
  resolve: {
    alias: {
      src: '/src',
    },
  },
  // Configure testing environment for vitest and setup files
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.js',
  },
});

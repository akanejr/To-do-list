import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Phase 1 customer prototype.
 * Kept intentionally minimal — no backend, no proxy, no server middleware.
 * When a real API exists (Phase 2+), add `server.proxy` here so browser code
 * keeps using relative URLs.
 */
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    allowedHosts: true,
  },
});

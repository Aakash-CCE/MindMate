import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { apiApp } from './server/api.js';
import { setupLiveWebSocketServer } from './server/live.js';

function apiPlugin(): Plugin {
  return {
    name: 'mindmate-api-middleware',
    configureServer(server) {
      if (server.httpServer) {
        setupLiveWebSocketServer(server.httpServer);
      }

      server.middlewares.use((req, res, next) => {
        if (req.url && (req.url === '/api' || req.url.startsWith('/api/'))) {
          const originalUrl = req.url;
          req.url = req.url.replace(/^\/api/, '') || '/';
          (apiApp as any)(req, res, (err?: unknown) => {
            req.url = originalUrl;
            next(err);
          });
        } else {
          next();
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

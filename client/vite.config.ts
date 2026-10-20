import { defineConfig } from 'vite'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      // `autoUpdate` reflete o comportamento real: usePwaAutoUpdate recarrega
      // na próxima visibilitychange e o workbox usa skipWaiting. Com 'prompt'
      // as duas configs se contradiziam (SW novo ativava sem o usuário aceitar).
      registerType: 'autoUpdate',
      injectRegister: false,
      manifest: false,
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        globPatterns: ['**/*.{js,css,html,ico,svg,woff2}'],
        // Navegação offline cai no fallback em vez da tela de erro do browser.
        navigateFallback: '/offline.html',
        // Rotas do app são SPA e já resolvem pelo index precacheado; o
        // fallback só entra quando nem o index está disponível.
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          {
            // Ícones e imagens: cache-first, não valem uma request por load.
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'strawby-images',
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          {
            // Fontes remotas (fontshare) — sem isso o app offline perde a
            // tipografia inteira e o layout quebra.
            urlPattern: ({ url }) =>
              url.hostname === 'api.fontshare.com' || url.hostname === 'cdn.fontshare.com',
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'strawby-fonts',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'firebase': ['firebase/app', 'firebase/messaging'],
          'charts': ['recharts'],
          'motion': ['framer-motion'],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'zod/v4/core': path.resolve(__dirname, './node_modules/zod/v4/core/index.js'),
    },
  },
  server: {
    watch: {
      awaitWriteFinish: {
        stabilityThreshold: 100,
        pollInterval: 10,
      },
    },
    fs: {
      strict: false,
    },
  },
})

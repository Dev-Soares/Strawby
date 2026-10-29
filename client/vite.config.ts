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
      registerType: 'prompt',
      injectRegister: false,
      manifest: false,
      workbox: {
        // Sem skipWaiting/clientsClaim: o SW novo fica em "waiting" e a troca é
        // controlada pelo app (modules/pwa). Ativar na hora derruba os chunks da
        // sessão atual (cleanupOutdatedCaches limpa os antigos) e quebra a navegação.
        cleanupOutdatedCaches: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        // Arquivos para crawlers/LLMs são navegações diretas: sem isso o
        // navigateFallback do SW devolve o index.html (SPA) no lugar do texto.
        navigateFallbackDenylist: [/^\/robots\.txt$/, /^\/llms\.txt$/, /^\/sitemap\.xml$/],
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

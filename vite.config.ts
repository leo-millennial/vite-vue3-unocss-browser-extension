import { crx } from '@crxjs/vite-plugin'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'
import manifest from './manifest.json'

// https://vite.dev/config/
export default defineConfig({
  plugins: [UnoCSS(), vue(), crx({ manifest })],
  build: {
    target: 'baseline-widely-available',
    rollupOptions: {
      input: {
        popup: 'src/pages/popup/index.html',
        welcome: 'src/pages/welcome/index.html',
      },
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
  },
})

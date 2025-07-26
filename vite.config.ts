import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json' with { type: 'json' }
import UnoCSS from 'unocss/vite'

// https://vite.dev/config/
export default defineConfig({
    plugins: [UnoCSS() , vue(), crx({ manifest })],
    build: {
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

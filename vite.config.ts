import type { PluginOption } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import { crx } from '@crxjs/vite-plugin'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { defineConfig, loadEnv } from 'vite'
import manifest from './manifest.json'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, fileURLToPath(new URL('.', import.meta.url)), '')

  const plugins: PluginOption[] = [
    UnoCSS(),
    vue(),
    crx({ manifest }),
  ]

  let buildOptions = {}

  buildOptions = {
    target: 'baseline-widely-available',
    rollupOptions: {
      input: {
        popup: 'src/pages/popup/index.html',
        welcome: 'src/pages/welcome/index.html',
      },
    },
  }

  return {
    define: {
      __APP_VERSION__: JSON.stringify(env.npm_package_version),
    },
    plugins: plugins.filter(Boolean),
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: 5173,
      strictPort: true,
      hmr: {
        port: 5173,
      },
    },
    build: {
      ...buildOptions,
    },
  }
})

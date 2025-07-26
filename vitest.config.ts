import { fileURLToPath, URL } from 'node:url'
import { configDefaults, defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default defineConfig(configEnv =>
  mergeConfig(
    viteConfig(configEnv),
    defineConfig({
      resolve: {
        alias: {
          '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
      },
      test: {
        globals: true,
        environment: 'happy-dom',
        setupFiles: ['./src/shared/config/tests/test-setup.ts'],
        include: [
          'src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
          'src/pages/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
        ],
        exclude: [...configDefaults.exclude, 'node_modules', 'dist', '.idea', '.git', '.cache'],
        root: fileURLToPath(new URL('./', import.meta.url)),
      },
    }),
  ),
)

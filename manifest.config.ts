import { defineManifest } from '@crxjs/vite-plugin'
import pkg from './package.json'

export default defineManifest({
  manifest_version: 3,
  name: pkg.name || 'Vue Extension',
  description: pkg.description || 'Vue 3 Browser Extension',
  version: pkg.version || '0.0.1',
  permissions: [
    'activeTab',
    'tabs',
    'storage',
  ],
  background: {
    service_worker: 'src/app/background/index.ts',
    type: 'module',
  },
  content_scripts: [
    {
      matches: ['<all_urls>'],
      js: ['src/app/content/index.ts'],
      run_at: 'document_end',
    },
  ],
  action: {
    default_title: pkg.name || 'Vue Extension',
    default_popup: 'src/pages/popup/index.html',
    default_icon: {
      16: 'images/16px.png',
      48: 'images/48px.png',
      128: 'images/128px.png',
    },
  },
  icons: {
    16: 'images/16px.png',
    48: 'images/48px.png',
    128: 'images/128px.png',
  },
  web_accessible_resources: [
    {
      resources: ['images/*'],
      matches: ['<all_urls>'],
    },
  ],
})

# Vue 3 Chrome Extension Template

[🇷🇺 Русское описание](./README.ru.md) | 🇺🇸 English

A modern template for creating Chrome extensions using Vue 3, TypeScript, Vite, and UnoCSS.

Install template
```bash
npx degit leo-millenial/vite-vue-bex <my-project-name>
```

## 🚀 Features

- ⚡ **Fast development** with [Vite](https://vitejs.dev/)
- 🎯 **Vue 3** with Composition API and `<script setup>`
- 🔷 **TypeScript** for type safety
- 🎨 **UnoCSS** for atomic CSS styling
- 🌸 **DaisyUI** for beautiful UI components
- 🔧 **webext-bridge** for script communication
- 📦 **webextension-polyfill** for cross-browser compatibility
- 🧪 **Vitest** for testing
- 🔄 **Hot Module Replacement** in development mode

## 📋 Project Structure (FSD)
```
src/
├── app/
│   └── background/         # Background scripts
│       └── index.ts
├── content/                # Content scripts
│   └── content.ts
├── pages/
│   ├── popup/              # Popup interface
│   │   ├── index.html
│   │   ├── index.vue
│   │   └── main.ts
│   └── welcome/            # Welcome page
│       ├── index.html
│       ├── index.vue
│       └── main.ts
├── shared/                 # Shared utilities
│   └── config/
└── public/
    └── images/             # Extension icons
```

## 🛠 Tech Stack

### Core Dependencies
- [Vue 3](https://vuejs.org/) - Progressive JavaScript framework
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- [Vite](https://vitejs.dev/) - Fast build tool and dev server
- [UnoCSS](https://unocss.dev/) - Atomic CSS engine
- [DaisyUI](https://daisyui.com/) - Tailwind CSS component library

### Extensions & Plugins
- [@crxjs/vite-plugin](https://crxjs.dev/vite-plugin/) - Vite plugin for Chrome extensions
- [@vitejs/plugin-vue](https://github.com/vitejs/vite-plugin-vue) - Vue plugin for Vite
- [webext-bridge](https://github.com/zikaari/webext-bridge) - Extension script communication
- [webextension-polyfill](https://github.com/mozilla/webextension-polyfill) - Cross-browser API

### Development Tools
- [Vitest](https://vitest.dev/) - Fast testing framework
- [@vue/test-utils](https://test-utils.vuejs.org/) - Vue component testing utilities
- [ESLint](https://eslint.org/) - JavaScript/TypeScript linter
- [Prettier](https://prettier.io/) - Code formatter

## 🚀 Quick Start

### Using npm

```bash
# Create new project
npm create @leo-millenial/vite-vue-bex my-extension
cd my-extension

# Install dependencies
npm install

# Start development
npm run dev
```

### Using pnpm

```bash
# Create new project
pnpm create @leo-millenial/vite-vue-bex my-extension
cd my-extension

# Install dependencies
pnpm install

# Start development
pnpm run dev
```

### Using yarn

```bash
# Clone the template
npx degit your-username/vue3-chrome-extension-template my-extension
cd my-extension

# Install dependencies
pnpm install
# or
npm install
# or
yarn install

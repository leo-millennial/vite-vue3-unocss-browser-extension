# Шаблон Chrome расширения на Vue 3

🇷🇺 Русское описание | [🇺🇸 English](./README.md)

Современный шаблон для создания Chrome расширений с использованием Vue 3, TypeScript, Vite и UnoCSS.

## 🚀 Возможности

- ⚡ **Быстрая разработка** с [Vite](https://vitejs.dev/)
- 🎯 **Vue 3** с Composition API и `<script setup>`
- 🔷 **TypeScript** для типобезопасности
- 🎨 **UnoCSS** для атомарных CSS стилей
- 🌸 **DaisyUI** для красивых UI компонентов
- 🔧 **webext-bridge** для коммуникации между скриптами
- 📦 **webextension-polyfill** для кроссбраузерной совместимости
- 🧪 **Vitest** для тестирования
- 🔄 **Hot Module Replacement** в режиме разработки

## 📋 Структура проекта (FSD)

```
src/
├── background/             # Фоновые скрипты
│   └── index.ts
├── content/                # Контентные скрипты
│   └── content.ts
├── pages/
│   ├── popup/              # Интерфейс всплывающего окна
│   │   ├── index.html
│   │   ├── index.vue
│   │   └── main.ts
│   └── welcome/            # Страница приветствия
│       ├── index.html
│       ├── index.vue
│       └── main.ts
└── public/
    └── images/             # Иконки расширения
```


## 🛠 Технологический стек

### Основные зависимости
- [Vue 3](https://vuejs.org/) - Прогрессивный JavaScript фреймворк
- [TypeScript](https://www.typescriptlang.org/) - Типизированный JavaScript
- [Vite](https://vitejs.dev/) - Быстрый инструмент сборки и dev-сервер
- [UnoCSS](https://unocss.dev/) - Атомарный CSS движок
- [DaisyUI](https://daisyui.com/) - Библиотека компонентов Tailwind CSS

### Расширения и плагины
- [@crxjs/vite-plugin](https://crxjs.dev/vite-plugin/) - Vite плагин для Chrome расширений
- [@vitejs/plugin-vue](https://github.com/vitejs/vite-plugin-vue) - Vue плагин для Vite
- [webext-bridge](https://github.com/zikaari/webext-bridge) - Коммуникация между скриптами расширения
- [webextension-polyfill](https://github.com/mozilla/webextension-polyfill) - Кроссбраузерный API

### Инструменты разработки
- [Vitest](https://vitest.dev/) - Быстрый фреймворк для тестирования
- [@vue/test-utils](https://test-utils.vuejs.org/) - Утилиты для тестирования Vue компонентов
- [ESLint](https://eslint.org/) - Линтер для JavaScript/TypeScript
- [Prettier](https://prettier.io/) - Форматтер кода

## 🚀 Быстрый старт

### Использование npm

```bash
# Создать новый проект
npm create @leo-millenial/vite-vue-bex my-extension
cd my-extension

# Установить зависимости
npm install

# Запустить разработку
npm run dev
```

### Использование pnpm

```bash
# Создать новый проект
pnpm create @leo-millenial/vite-vue-bex my-extension
cd my-extension

# Установить зависимости
pnpm install

# Запустить разработку
pnpm dev
```

### Использование pnpm

```bash
# Создать новый проект
pnpm create @leo-millenial/vite-vue-bex my-extension
cd my-extension

# Установить зависимости
pnpm install

# Запустить разработку
pnpm dev
```

### 🛠 Доступные скрипты

```bash
# Разработка
npm run dev          # Запустить сервер разработки
npm run build        # Собрать для продакшена

# Тестирование
npm run test         # Запустить тесты
npm run test:ui      # Запустить тесты с UI

# Качество кода
npm run lint         # Проверить код линтером
npm run format       # Отформатировать код
```

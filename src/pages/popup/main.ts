import { createApp } from 'vue'
import '../styles.ts'
import App from './index.vue'

const app = createApp(App)

// Глобальный обработчик ошибок
app.config.errorHandler = (err, _, info) => {
  if (err instanceof Error && err.message.includes('Extension context invalidated')) {
    console.warn('Extension context invalidated, reloading...')
    setTimeout(() => window.location.reload(), 100)
    return
  }
  console.error('Vue error:', err, info)
}

app.mount('#app')

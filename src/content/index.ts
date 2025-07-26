import { onMessage, sendMessage } from 'webext-bridge/content-script'

console.log('Content script loaded on:', window.location.href)

function isStorageChangedData(data: any): data is { changes: Record<string, { oldValue?: any; newValue?: any }> } {
  return data && typeof data === 'object' && 'changes' in data && typeof data.changes === 'object'
}

// Утилиты для получения информации о странице
function getPageInfo() {
  return {
    title: document.title,
    url: window.location.href,
    domain: window.location.hostname,
    timestamp: Date.now(),
    readyState: document.readyState
  }
}

// Обработчики webext-bridge сообщений
onMessage('ping', async (message) => {
  console.log('Content script received webext-bridge ping:', message)
  const response = 'pong from content script'
  console.log('Content script sending response:', response)
  return response
})

onMessage('get-page-info', async (message) => {
  console.log('Content script received webext-bridge get-page-info:', message)
  const pageInfo = getPageInfo()
  console.log('Content script sending page info:', pageInfo)
  return pageInfo
})

// Добавляем обработчик для check-content-script через webext-bridge
onMessage('check-content-script', async (message) => {
  console.log('Content script received check-content-script:', message)
  return {
    success: true,
    message: 'Content script is active',
    pageInfo: getPageInfo()
  }
})

// Обработчик изменений storage от background
onMessage('storage-changed', async (message) => {
  console.log('Content script received storage changes:', message)

  if (isStorageChangedData(message.data)) {
    try {
      await sendMessage('content-update', {
        type: 'storage-changed',
        changes: message.data.changes,
        timestamp: Date.now()
      }, 'popup')
    } catch (error) {
      console.log('Failed to notify popup about storage changes:', error)
    }
  }
})

// Функция для отправки обновлений в popup
async function notifyPageUpdate(type: string, data: any) {
  try {
    await sendMessage('content-update', {
      type,
      ...data,
      timestamp: Date.now()
    }, 'popup')
  } catch (error) {
    // Popup может быть закрыт, это нормально
    console.log('Failed to send content update:', error)
  }
}

// Отслеживание изменений на странице
let lastUrl = window.location.href

// Отслеживание изменений URL (для SPA)
const urlObserver = new MutationObserver(() => {
  if (window.location.href !== lastUrl) {
    const oldUrl = lastUrl
    lastUrl = window.location.href

    console.log('URL changed:', { from: oldUrl, to: lastUrl })
    notifyPageUpdate('url-changed', {
      oldUrl,
      newUrl: lastUrl,
      pageInfo: getPageInfo()
    })
  }
})

// Запуск наблюдателя
urlObserver.observe(document, {
  subtree: true,
  childList: true
})

// Отправка начального уведомления о загрузке
void notifyPageUpdate('page-loaded', {
  pageInfo: getPageInfo()
})

// Обработка событий страницы
window.addEventListener('beforeunload', async () => {
  await notifyPageUpdate('page-unload', {
    url: window.location.href
  })
  urlObserver.disconnect()
})

// Обработка изменений видимости страницы
document.addEventListener('visibilitychange', async () => {
  await notifyPageUpdate('visibility-changed', {
    visible: !document.hidden,
    pageInfo: getPageInfo()
  })
})

console.log('Content script handlers registered')

// Тестовое сообщение для проверки webext-bridge
setTimeout(() => {
  console.log('Content script is ready for webext-bridge communication')
}, 1_000)

import { onMessage, sendMessage } from 'webext-bridge/background'

console.log('Background script loaded')

chrome.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === "install") {
        await chrome.storage.local.clear()

        chrome.tabs.create({
            active: true,
            url: chrome.runtime.getURL("src/pages/welcome/index.html"),
        })
    }

})

// Type guards для проверки данных
function isGetStorageData(data: any): data is { keys: string[] } {
    return data && typeof data === 'object' && 'keys' in data && Array.isArray(data.keys)
}

function isSetStorageData(data: any): data is { items: Record<string, any> } {
    return data && typeof data === 'object' && 'items' in data && typeof data.items === 'object' && data.items !== null
}

// Обработчик сообщений от content script и popup
onMessage('get-tab-info', async ({ sender }) => {
  try {
    console.log('get-tab-info called, sender:', sender)

    // Если вызов из popup, получаем активную вкладку
    if (!sender.tabId) {
      const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true })
      if (activeTab) {
        console.log('Active tab found:', activeTab)
        return {
          title: activeTab.title,
          url: activeTab.url,
          id: activeTab.id
        }
      } else {
        return { error: 'No active tab found' }
      }
    }

    // Если вызов из content script, используем sender.tabId
    const tab = await chrome.tabs.get(sender.tabId)
    return {
      title: tab.title,
      url: tab.url,
      id: tab.id
    }
  } catch (error) {
    console.error('Error getting tab info:', error)
    return { error: `Failed to get tab info: ${error instanceof Error ? error.message : 'Unknown error'}` }
  }
})

// Обработчик для получения данных из storage
onMessage('get-storage-data', async ({ data }) => {
    if (!isGetStorageData(data)) {
        return {}
    }

    const result = await chrome.storage.local.get(data.keys)
    return result
})

// Обработчик для сохранения данных в storage
onMessage('set-storage-data', async ({ data }) => {
    if (!isSetStorageData(data)) {
        return { success: false, error: 'Invalid data format' }
    }

    try {
        await chrome.storage.local.set(data.items)
        return { success: true }
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
})

// Функция для преобразования StorageChange в JSON-совместимый формат
function serializeStorageChanges(changes: Record<string, chrome.storage.StorageChange>) {
    const serialized: Record<string, { oldValue?: any; newValue?: any }> = {}

    for (const [key, change] of Object.entries(changes)) {
        serialized[key] = {
            oldValue: change.oldValue,
            newValue: change.newValue
        }
    }


    return serialized
}

// Отправка сообщения во все content scripts при изменении storage
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local') {
        // Преобразуем changes в JSON-совместимый формат
        const serializedChanges = serializeStorageChanges(changes)

        // Отправляем уведомление всем content scripts
        chrome.tabs.query({}, (tabs) => {
            tabs.forEach(tab => {
                if (tab.id) {
                    sendMessage('storage-changed', { changes: serializedChanges }, `content-script@${tab.id}`)
                        .catch(() => {
                            // Игнорируем ошибки для табов без content script
                        })
                }
            })
        })
    }
})

// Обработчик для ping
onMessage('ping', async ({ sender }) => {
  console.log('Background received ping from:', sender)
  return 'pong from background'
})

console.log('Background script handlers registered')

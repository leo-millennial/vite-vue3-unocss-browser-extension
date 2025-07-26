import { onMessage, sendMessage } from 'webext-bridge/background'
import browser from 'webextension-polyfill'

console.log('Background script loaded')

// Инициализация расширения
browser.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === "install") {
        await browser.storage.local.clear()
        await browser.tabs.create({
            active: true,
            url: browser.runtime.getURL("src/pages/welcome/index.html"),
        })
    }
})

// Type guards
function isGetStorageData(data: any): data is { keys: string[] } {
    return data && typeof data === 'object' && 'keys' in data && Array.isArray(data.keys)
}

function isSetStorageData(data: any): data is { items: Record<string, any> } {
    return data && typeof data === 'object' && 'items' in data && typeof data.items === 'object' && data.items !== null
}

// Утилиты
function serializeStorageChanges(changes: Record<string, browser.Storage.StorageChange>) {
    const serialized: Record<string, { oldValue?: any; newValue?: any }> = {}

    for (const [key, change] of Object.entries(changes)) {
        serialized[key] = {
            oldValue: change.oldValue,
            newValue: change.newValue
        }
    }

    return serialized
}

// Обработчики webext-bridge сообщений
onMessage('get-tab-info', async ({ sender }) => {
    try {
        console.log('get-tab-info called, sender:', sender)

        // Если вызов из popup, получаем активную вкладку
        if (!sender.tabId) {
            const tabs = await browser.tabs.query({ active: true, currentWindow: true })
            const activeTab = tabs[0]

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
        const tab = await browser.tabs.get(sender.tabId)
        return {
            title: tab.title,
            url: tab.url,
            id: tab.id
        }
    } catch (error) {
        console.error('Error getting tab info:', error)
        return {
            error: `Failed to get tab info: ${error instanceof Error ? error.message : 'Unknown error'}`
        }
    }
})

onMessage('get-storage-data', async ({ data }) => {
    if (!isGetStorageData(data)) {
        return {}
    }

    try {
        const result = await browser.storage.local.get(data.keys)
        return result
    } catch (error) {
        console.error('Error getting storage data:', error)
        return {}
    }
})

onMessage('set-storage-data', async ({ data }) => {
    if (!isSetStorageData(data)) {
        return { success: false, error: 'Invalid data format' }
    }

    try {
        await browser.storage.local.set(data.items)
        return { success: true }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }
    }
})

onMessage('ping', async ({ sender }) => {
    console.log('Background received ping from:', sender)
    return 'pong from background'
})

// Обработка изменений storage с уведомлением через webext-bridge
browser.storage.onChanged.addListener(async (changes, namespace) => {
    if (namespace === 'local') {
        const serializedChanges = serializeStorageChanges(changes)

        try {
            const tabs = await browser.tabs.query({})

            // Отправляем уведомления параллельно
            const notifications = tabs
                .filter(tab => tab.id)
                .map(tab =>
                    sendMessage('storage-changed', { changes: serializedChanges }, `content-script@${tab.id}`)
                        .catch(() => {
                            // Игнорируем ошибки для табов без content script
                        })
                )

            await Promise.allSettled(notifications)
        } catch (error) {
            console.error('Error notifying tabs about storage changes:', error)
        }
    }
})

console.log('Background script handlers registered')

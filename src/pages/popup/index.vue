<template>
  <div class="w-80 p-4">
    <h1 class="text-xl font-bold mb-4">Extension Popup</h1>

    <div v-if="contextInvalidated" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
      <p class="text-sm">Extension context invalidated. Please reload the extension.</p>
      <button
          @click="reloadExtension"
          class="mt-2 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
      >
        Reload Extension
      </button>
    </div>

    <div class="space-y-3">
      <button
          @click="checkContentScript"
          :disabled="contextInvalidated"
          class="w-full px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Check Content Script
      </button>

      <button
          @click="pingContent"
          :disabled="contextInvalidated"
          class="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Ping Content Script
      </button>

      <button
          @click="getTabInfo"
          :disabled="contextInvalidated"
          class="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Get Tab Info
      </button>

      <button
          @click="getPageInfo"
          :disabled="contextInvalidated"
          class="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Get Page Info
      </button>
    </div>

    <div v-if="response" class="mt-4 p-3 bg-gray-100 rounded">
      <h3 class="font-semibold mb-2">Response:</h3>
      <pre class="text-sm">{{ JSON.stringify(response, null, 2) }}</pre>
    </div>

    <div v-if="contentUpdates.length" class="mt-4">
      <h3 class="font-semibold mb-2">Content Updates:</h3>
      <div class="max-h-32 overflow-y-auto space-y-1">
        <div
            v-for="(update, index) in contentUpdates"
            :key="index"
            class="text-xs p-2 bg-yellow-100 rounded"
        >
          {{ JSON.stringify(update, null, 2) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { sendMessage, onMessage } from 'webext-bridge/popup'

const response = ref<any>(null)
const contentUpdates = ref<any[]>([])
const contextInvalidated = ref(false)

// Функция для проверки контекста расширения
function isExtensionContextValid(): boolean {
  try {
    return !!chrome.runtime?.id
  } catch {
    return false
  }
}

// Функция для обработки ошибок контекста
function handleContextError(error: any): boolean {
  if (error instanceof Error && error.message.includes('Extension context invalidated')) {
    contextInvalidated.value = true
    return true
  }
  return false
}

// Функция для перезагрузки расширения
function reloadExtension() {
  try {
    console.log('Reloading extension...')
    chrome.runtime.reload()
  } catch {
    window.location.reload()
  }
}

// Обработчик сообщений от content script
const unsubscribe = onMessage('content-update', ({ data }) => {
  if (!isExtensionContextValid()) {
    contextInvalidated.value = true
    return
  }

  contentUpdates.value.unshift(data)
  if (contentUpdates.value.length > 10) {
    contentUpdates.value = contentUpdates.value.slice(0, 10)
  }
})

async function pingContent() {
  console.log('pingContent called')

  if (!isExtensionContextValid()) {
    console.log('Extension context invalid')
    contextInvalidated.value = true
    return
  }

  try {
    console.log('Sending ping to content-script via webext-bridge...')

    // Получаем активную вкладку для отправки сообщения
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (!tab.id) {
      response.value = { error: 'No active tab' }
      return
    }

    console.log('Active tab ID:', tab.id)

    const result = await sendMessage('ping', null, `content-script@${tab.id}`)
    console.log('Ping result:', result)
    response.value = { ping: result }
  } catch (error) {
    console.error('Ping error:', error)
    if (handleContextError(error)) return
    response.value = {
      error: 'Content script not available',
      details: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

async function getTabInfo() {
  console.log('getTabInfo called')

  if (!isExtensionContextValid()) {
    console.log('Extension context invalid')
    contextInvalidated.value = true
    return
  }

  try {
    console.log('Sending get-tab-info to background...')
    const result = await sendMessage('get-tab-info', null, 'background')
    console.log('Tab info result:', result)
    response.value = result
  } catch (error) {
    console.error('Tab info error:', error)
    if (handleContextError(error)) return
    response.value = { error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

async function getPageInfo() {
  console.log('getPageInfo called')

  if (!isExtensionContextValid()) {
    console.log('Extension context invalid')
    contextInvalidated.value = true
    return
  }

  try {
    console.log('Sending get-page-info to content-script via webext-bridge...')

    // Получаем активную вкладку для отправки сообщения
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (!tab.id) {
      response.value = { error: 'No active tab' }
      return
    }

    console.log('Active tab ID:', tab.id)

    const result = await sendMessage('get-page-info', null, `content-script@${tab.id}`)
    console.log('Page info result:', result)
    response.value = result
  } catch (error) {
    console.error('Page info error:', error)
    if (handleContextError(error)) return
    response.value = {
      error: 'Content script not available',
      details: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

async function checkContentScript() {
  console.log('checkContentScript called')

  try {
    // Получаем активную вкладку
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (!tab.id) {
      response.value = { error: 'No active tab' }
      return
    }

    // Проверяем, загружен ли content script
    try {
      await chrome.tabs.sendMessage(tab.id, { type: 'ping' })
      response.value = { contentScript: 'loaded' }
    } catch (error) {
      response.value = {
        contentScript: 'not loaded',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  } catch (error) {
    console.error('Check content script error:', error)
    response.value = { error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Проверка контекста при загрузке
if (!isExtensionContextValid()) {
  contextInvalidated.value = true
}

onUnmounted(() => {
  unsubscribe()
})
</script>

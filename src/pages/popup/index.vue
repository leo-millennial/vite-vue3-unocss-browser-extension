<script setup lang="ts">
import { onUnmounted, ref } from 'vue'
import { onMessage, sendMessage } from 'webext-bridge/popup'
import browser from 'webextension-polyfill'

const response = ref<any>(null)
const contentUpdates = ref<any[]>([])
const contextInvalidated = ref(false)

// Утилиты
function isExtensionContextValid(): boolean {
  try {
    return !!browser.runtime?.id
  }
  catch {
    return false
  }
}

function handleContextError(error: any): boolean {
  if (error.message?.includes('Extension context invalidated')) {
    contextInvalidated.value = true
    return true
  }
  return false
}

async function reloadExtension() {
  try {
    await browser.runtime.reload()
  }
  catch (error) {
    console.error('Failed to reload extension:', error)
  }
}

// Основные функции - используем webext-bridge для общения
async function pingContent() {
  // console.log('pingContent called')

  if (!isExtensionContextValid()) {
    // console.log('Extension context invalid')
    contextInvalidated.value = true
    return
  }

  try {
    // console.log('Sending ping to content-script via webext-bridge...')

    // Используем browser.tabs для получения активной вкладки
    const tabs = await browser.tabs.query({ active: true, currentWindow: true })
    const tab = tabs[0]

    if (!tab.id) {
      response.value = { error: 'No active tab' }
      return
    }

    // console.log('Active tab ID:', tab.id)

    // Используем webext-bridge для отправки сообщения
    const result = await sendMessage('ping', null, `content-script@${tab.id}`)
    // console.log('Ping result:', result)
    response.value = { ping: result }
  }
  catch (error) {
    console.error('Ping error:', error)
    if (handleContextError(error))
      return
    response.value = {
      error: 'Content script not available',
      details: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

async function getTabInfo() {
  try {
    // Используем webext-bridge для получения информации о вкладке
    const result = await sendMessage('get-tab-info', null, 'background')
    response.value = result
  }
  catch (error) {
    if (handleContextError(error))
      return
    response.value = {
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

async function getPageInfo() {
  try {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true })
    const tab = tabs[0]

    if (!tab.id) {
      response.value = { error: 'No active tab' }
      return
    }

    // Используем webext-bridge для получения информации о странице
    const result = await sendMessage('get-page-info', null, `content-script@${tab.id}`)
    response.value = result
  }
  catch (error) {
    if (handleContextError(error))
      return
    response.value = {
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

async function checkContentScript() {
  try {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true })
    const tab = tabs[0]

    if (!tab.id) {
      response.value = { error: 'No active tab' }
      return
    }

    // Используем webext-bridge вместо browser.tabs.sendMessage
    const result = await sendMessage('check-content-script', null, `content-script@${tab.id}`)
    response.value = {
      contentScriptAvailable: true,
      response: result,
    }
  }
  catch (error) {
    response.value = {
      contentScriptAvailable: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// Обработчик сообщений от content script через webext-bridge
const unsubscribe = onMessage('content-update', ({ data }) => {
  contentUpdates.value.unshift(data)
  if (contentUpdates.value.length > 10) {
    contentUpdates.value = contentUpdates.value.slice(0, 10)
  }
})

// Проверка контекста при загрузке
if (!isExtensionContextValid()) {
  contextInvalidated.value = true
}

onUnmounted(() => {
  unsubscribe?.()
})
</script>

<template>
  <div class="p-4 w-80">
    <h1 class="text-xl font-bold mb-4">
      Extension Popup
    </h1>

    <div v-if="contextInvalidated" class="text-red-700 mb-4 p-3 border border-red-400 rounded bg-red-100">
      <p class="text-sm">
        Extension context invalidated. Please reload the extension.
      </p>
      <button
        class="text-sm text-white mt-2 px-3 py-1 rounded bg-red-500 hover:bg-red-600"
        @click="reloadExtension"
      >
        Reload Extension
      </button>
    </div>

    <div class="space-y-3">
      <button
        :disabled="contextInvalidated"
        class="text-white px-4 py-2 rounded bg-orange-500 w-full hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
        @click="checkContentScript"
      >
        Check Content Script
      </button>

      <button
        :disabled="contextInvalidated"
        class="text-white px-4 py-2 rounded bg-blue-500 w-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        @click="pingContent"
      >
        Ping Content Script
      </button>

      <button
        :disabled="contextInvalidated"
        class="text-white px-4 py-2 rounded bg-green-500 w-full hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
        @click="getTabInfo"
      >
        Get Tab Info
      </button>

      <button
        :disabled="contextInvalidated"
        class="text-white px-4 py-2 rounded bg-purple-500 w-full hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
        @click="getPageInfo"
      >
        Get Page Info
      </button>
    </div>

    <div v-if="response" class="mt-4 p-3 rounded bg-gray-100">
      <h3 class="font-semibold mb-2">
        Response:
      </h3>
      <pre class="text-sm">{{ JSON.stringify(response, null, 2) }}</pre>
    </div>

    <div v-if="contentUpdates.length" class="mt-4">
      <h3 class="font-semibold mb-2">
        Content Updates:
      </h3>
      <div class="max-h-32 overflow-y-auto space-y-1">
        <div
          v-for="(update, index) in contentUpdates"
          :key="index"
          class="text-xs p-2 rounded bg-yellow-100"
        >
          {{ JSON.stringify(update, null, 2) }}
        </div>
      </div>
    </div>
  </div>
</template>

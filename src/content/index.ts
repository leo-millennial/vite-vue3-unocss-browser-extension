import { onMessage } from 'webext-bridge/content-script'

console.log('Content script loaded on:', window.location.href)

// Обработчик для webext-bridge ping
onMessage('ping', async (message) => {
  console.log('Content script received webext-bridge ping:', message)
  const response = 'pong from content script'
  console.log('Content script sending response:', response)
  return response
})

// Обработчик для webext-bridge get-page-info
onMessage('get-page-info', async (message) => {
  console.log('Content script received webext-bridge get-page-info:', message)
  const pageInfo = {
    title: document.title,
    url: window.location.href,
    domain: window.location.hostname
  }
  console.log('Content script sending page info:', pageInfo)
  return pageInfo
})

// Обработчик для chrome.tabs.sendMessage (для checkContentScript)
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log('Content script received chrome message:', message)

  if (message.type === 'ping') {
    sendResponse({ success: true, message: 'Content script is loaded' })
    return true
  }

  return false
})

console.log('Content script handlers registered')

// Тестовое сообщение для проверки webext-bridge
setTimeout(() => {
  console.log('Content script is ready for webext-bridge communication')
}, 1000)

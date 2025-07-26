import { ProtocolWithReturn } from "webext-bridge";

export interface ProtocolMap {
  // Background -> Content/Popup (без возврата)
  'storage-changed': { changes: Record<string, { oldValue?: any; newValue?: unknown }> }

  // Content -> Background/Popup (без возврата)
  'page-loaded': { url: string; title: string }
  'content-update': { type: string; [key: string]: unknown }
  'get-page-info': ProtocolWithReturn<void, { title: string; url: string; domain: string }>

  // Popup -> Background/Content (сообщения с возвращаемыми значениями)
  'ping': ProtocolWithReturn<void, string>
  'get-tab-info': ProtocolWithReturn<void, { title?: string; url?: string; id?: number } | null>
  'get-storage-data': ProtocolWithReturn<{ keys: string[] }, Record<string, unknown>>
  'set-storage-data': ProtocolWithReturn<{ items: Record<string, unknown> }, { success: boolean; error?: string }>
}

declare module 'webext-bridge' {
  export interface ProtocolMap extends ProtocolMap {}
}

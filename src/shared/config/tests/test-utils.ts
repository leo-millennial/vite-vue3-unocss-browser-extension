import type { VueWrapper } from '@vue/test-utils'

// Хелперы для тестирования
export const waitForNextTick = () => new Promise(resolve => setTimeout(resolve, 0))

export function findByTestId(wrapper: VueWrapper<any>, testId: string) {
  return wrapper.find(`[data-testid="${testId}"]`)
}

// Утилита для ожидания обновления DOM
export async function flushPromises() {
  return new Promise(resolve => setTimeout(resolve, 0))
}

// Хелпер для симуляции пользовательского ввода
export async function typeInInput(wrapper: VueWrapper<any>, selector: string, value: string) {
  const input = wrapper.find(selector)
  await input.setValue(value)
  await wrapper.vm.$nextTick()
  return input
}

import type { VueWrapper } from '@vue/test-utils'
import type { ComponentPublicInstance } from 'vue'
import { mount } from '@vue/test-utils'

// Утилиты для тестирования Vue компонентов
export function createWrapper<T extends ComponentPublicInstance>(
  component: any,
  options: any = {},
): VueWrapper<T> {
  return mount(component, {
    global: {
      stubs: {
        // Заглушки для компонентов, если понадобятся
      },
    },
    ...options,
  })
}

// Хелперы для тестирования
export const waitForNextTick = () => new Promise(resolve => setTimeout(resolve, 0))

export function findByTestId(wrapper: VueWrapper<any>, testId: string) {
  return wrapper.find(`[data-testid="${testId}"]`)
}

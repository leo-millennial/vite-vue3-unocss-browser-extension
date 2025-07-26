import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { typeInInput } from '@/shared/config/tests'
import WelcomePage from '../welcome/index.vue'

describe('welcomePage', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(WelcomePage)
  })

  it('должен отображаться корректно', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('должен содержать заголовок "Welcome"', () => {
    const welcomeText = wrapper.find('div[text="blue-500 2xl"]')
    expect(welcomeText.exists()).toBe(true)
    expect(welcomeText.text()).toContain('Welcome')
  })

  it('должен содержать поле ввода имени', () => {
    const input = wrapper.find('input[type="text"]')
    expect(input.exists()).toBe(true)
    expect(input.attributes('placeholder')).toBe('Type name')
  })

  it('должен обновлять имя при вводе (с хелпером)', async () => {
    await typeInInput(wrapper, 'input[type="text"]', 'Тестовое имя')
    expect(wrapper.vm.name).toBe('Тестовое имя')
  })

  it('должен отображать имя в приветствии после ввода', async () => {
    const input = wrapper.find('input[type="text"]')

    await input.setValue('Иван')

    const nameSpan = wrapper.find('span[color="green-600"]')
    expect(nameSpan.text()).toBe('Иван')
  })

  it('должен показывать запятую только когда имя введено', async () => {
    const input = wrapper.find('input[type="text"]')

    // Изначально запятой не должно быть
    expect(wrapper.html()).not.toContain(',')

    // После ввода имени запятая должна появиться
    await input.setValue('Тест')
    expect(wrapper.html()).toContain(',')
  })

  it('должен иметь правильные CSS классы', () => {
    const container = wrapper.find('div[m="10"]')
    expect(container.exists()).toBe(true)

    const title = wrapper.find('div[text="blue-500 2xl"]')
    expect(title.exists()).toBe(true)

    const input = wrapper.find('input.input')
    expect(input.exists()).toBe(true)
  })

  it('должен очищать имя при очистке поля ввода', async () => {
    const input = wrapper.find('input[type="text"]')

    // Вводим имя
    await input.setValue('Тест')
    expect(wrapper.vm.name).toBe('Тест')

    // Очищаем поле
    await input.setValue('')
    expect(wrapper.vm.name).toBe('')

    // Проверяем, что запятая исчезла
    expect(wrapper.html()).not.toContain(',')
  })

  it('должен иметь правильное имя компонента', () => {
    expect(wrapper.vm.$options.name).toBe('WelcomePage')
  })

  it('должен корректно работать с реактивностью Vue', async () => {
    const input = wrapper.find('input[type="text"]')

    // Проверяем начальное состояние
    expect(wrapper.vm.name).toBe('')

    // Симулируем пользовательский ввод
    await input.setValue('Реактивный тест')
    await wrapper.vm.$nextTick()

    // Проверяем, что состояние обновилось
    expect(wrapper.vm.name).toBe('Реактивный тест')

    // Проверяем, что DOM обновился
    const nameDisplay = wrapper.find('span[color="green-600"]')
    expect(nameDisplay.text()).toBe('Реактивный тест')
  })

  it('должен корректно обрабатывать специальные символы в имени', async () => {
    const input = wrapper.find('input[type="text"]')

    const specialName = 'Тест-123 @#$%'
    await input.setValue(specialName)

    expect(wrapper.vm.name).toBe(specialName)

    const nameDisplay = wrapper.find('span[color="green-600"]')
    expect(nameDisplay.text()).toBe(specialName)
  })

  it('должен корректно работать с длинными именами', async () => {
    const input = wrapper.find('input[type="text"]')

    const longName = 'Очень длинное имя пользователя для тестирования'
    await input.setValue(longName)

    expect(wrapper.vm.name).toBe(longName)

    const nameDisplay = wrapper.find('span[color="green-600"]')
    expect(nameDisplay.text()).toBe(longName)
  })
})

import { expect, test, describe, afterEach, beforeEach, vi } from 'vitest'
import Calculator from '../Calculator/Calculator.vue'
import { mount } from '@vue/test-utils'

describe('Calculator', () => {
  test('should render correctly', () => {
    const wrapper = mount(Calculator)
    expect(wrapper.html()).toMatchSnapshot()
  })
  test('should correctly remove extra symbols and keep only one dot', async () => {
    const wrapper = mount(Calculator)

    // Найдите input элемент
    const input = wrapper.find('input.calc-input')

    // Установите значение
    await input.setValue('123..456..789')
    await input.trigger('input')

    // Проверьте, что значение установлено правильно
    expect(input.element.value).toBe('123.456789')
  })
  beforeEach(() => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: { USD: 1.2 } })
      })
    )
  })

  test('should fetch exchange rate and update state', async () => {
    const wrapper = mount(Calculator)

    // Запустите метод getExchangeRate
    await wrapper.vm.getExchangeRate('RUB', 'USD')

    // Проверьте, что fetch был вызван с правильным URL
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/latest?apikey='),
      expect.objectContaining({ method: 'GET' })
    )

    // Подождите, пока компонент обновится
    await wrapper.vm.$nextTick()

    // Проверьте, что курс валюты был обновлен
    expect(wrapper.vm.rate).toBe(1.2)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })
})

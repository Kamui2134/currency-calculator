<script setup>
import { computed, onMounted, ref } from 'vue'

// Замените API_KEY на ваш ключ API
const API_KEY = import.meta.env.VITE_API_KEY
const BASE_URL = import.meta.env.VITE_BASE_URL

// карта соотнесения языка, установленного в браузере, к валюте
const localeToCurrencyMap = {
  'en-US': 'USD',
  'ru-RU': 'RUB',
  'en-GB': 'GBP',
  'ja-JP': 'JPY',
  'fr-FR': 'EUR'
}

// выбранная валюта base - верхнее поле выбора, target - нижнее поле выбора
let baseCurrency = ref()
let targetCurrency = ref('USD')
// введённая сумма денег
let baseSum = ref(1)
let targetSum = ref(1)
// все доступные валюты
let currencies = ref([])
// переменная отвечающая за вращение circle-arrow
let isRotate = ref(false)
// курс валют
let rate = 0

// Функция для установки начальной валюты относительно языка пользователя
function setUserCurrency() {
  // Получаем локаль браузера
  const userLocale = navigator.language
  console.log(navigator)

  // Определяем валюту по локали или используем значение по умолчанию
  baseCurrency.value = localeToCurrencyMap[userLocale] || 'RUB'
}

async function getAllCurrencies() {
  try {
    const response = await fetch(`${BASE_URL}/currencies?apikey=${API_KEY}`, {
      method: 'GET'
    })
    const data = await response.json()
    currencies.value = Object.keys(data.data)
    console.log(currencies.value)
  } catch (error) {
    console.error('Произошла ошибка при получении данных:', error)
  }
}

// Функция для получения курса валют
async function getExchangeRate(baseCurrency, targetCurrency) {
  isRotate.value = true
  try {
    const response = await fetch(
      `${BASE_URL}/latest?apikey=${API_KEY}&currencies=${targetCurrency}&base_currency=${baseCurrency}`,
      {
        method: 'GET'
      }
    )

    // Проверка успешного ответа
    if (!response.ok) {
      throw new Error(`Ошибка: ${response.statusText}`)
    }

    const data = await response.json()
    const rate = data.data[targetCurrency] // Получение курса для нужной валюты

    console.log(`Курс ${baseCurrency} к ${targetCurrency}: ${rate}`)
    isRotate.value = false
    return rate
  } catch (error) {
    console.error('Произошла ошибка при получении данных:', error)
  }
}

async function changeBaseCurrency(event) {
  baseCurrency.value = event.target.value
  rate = await getExchangeRate(baseCurrency.value, targetCurrency.value)
}

async function changeTargetCurrency(event) {
  targetCurrency.value = event.target.value
  rate = await getExchangeRate(baseCurrency.value, targetCurrency.value)
}

onMounted(async () => {
  await setUserCurrency()
  // Вызов функции для получения курса USD к EUR
  rate = await getExchangeRate(baseCurrency.value, targetCurrency.value)
  // Вызов функции для получения всех доступных валют
  getAllCurrencies()
  targetSum.value = baseSum.value * rate
})

function handleBaseChange(event) {
  let inputValue = deleteSymbols(event)
  baseSum.value = inputValue
  targetSum.value = baseSum.value * rate
}

function handleTargetChange(event) {
  let inputValue = deleteSymbols(event)
  targetSum.value = inputValue
  baseSum.value = targetSum.value / rate
}

function deleteSymbols(event) {
  event.target.value = event.target.value.replace(/\D+/g, '')
  return event.target.value
}
</script>

<template>
  <div class="calc">
    <div class="container">
      <p class="title">Currency Calculator</p>
      <div class="calc-side">
        <div class="input-container">
          <input
            class="calc-input"
            type="text"
            placeholder="..."
            @input="handleBaseChange($event)"
            :value="baseSum"
          />
          <span class="duplicate">{{ baseCurrency }}</span>
        </div>
        <div class="select-container">
          <select class="calc-select" @change="changeBaseCurrency($event)" name="">
            <option v-if="currencies.length !== 0" v-for="currency in currencies" :value="currency">
              {{ currency }}
            </option>
          </select>
        </div>
      </div>
      <div class="calc-center">
        <img
          src="@/assets/icons/circle-arrow.png"
          alt="circle-arrow"
          class="icon circle-arrow"
          :class="{ rotate: isRotate }"
        />
      </div>
      <div class="calc-side">
        <div class="input-container">
          <input
            class="calc-input"
            type="text"
            placeholder="..."
            @input="handleTargetChange($event)"
            :value="targetSum"
          />
          <span class="duplicate">{{ targetCurrency }}</span>
        </div>
        <div class="select-container">
          <select class="calc-select" @change="changeTargetCurrency($event)" name="">
            <option v-if="currencies.length !== 0" v-for="currency in currencies" :value="currency">
              {{ currency }}
            </option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.calc {
  background: var(--bg-ghost-white);
  border: 4px solid var(--text-white);
  border-radius: 12px;
}
.calc .container {
  padding-inline: 32px;
  padding-block: 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.title {
  font-weight: var(--weight-bold);
  line-height: 1.25;
  text-align: left;
  font-size: var(--fontSize-2);
  font-family: sans-serif;
}
.calc-side {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: stretch;
  background: var(--text-white);
  box-shadow: 0px 0px 20px var(--shadow-calculator);
  border-radius: 6px;
}
.input-container {
  display: flex;
  justify-content: stretch;
  align-items: center;
}
.calc-input {
  background: var(--text-white);
  outline: transparent;
  padding: 28px 8rem 28px 28px;
  color: var(--text-gray);
  border-radius: 6px;
  font-family: sans-serif;
}
.duplicate {
  font-family: sans-serif;
  color: var(--text-gray);
  border-left: 1px solid var(--text-gray);
  padding-inline: 24px 12px;
  user-select: none;
}
.select-container {
  padding: 28px;
  border-radius: 0px 5px 5px 0px;
  background: var(--text-white);
  user-select: none;
}
.calc-select {
  outline: transparent;
  border: 0px solid transparent;
  background: var(--text-white);
  font-size: var(--fontSize-1);
  font-weight: var(--weight-regular);
}
.calc-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
.icon {
  width: 40px;
  height: 40px;
}
.circle-arrow.rotate {
  animation: rotate 2s infinite linear;
}
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>

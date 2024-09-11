<script setup>
import { onMounted, ref } from 'vue'

// Замените API_KEY на ваш ключ API
const API_KEY = import.meta.env.VITE_API_KEY
console.log(import.meta.env)
const baseCurrency = 'USD' // Базовая валюта (например, USD)
const targetCurrency = 'EUR' // Целевая валюта (например, EUR)
let currencies = ref([])

async function getAllCurrencies() {
  try {
    const response = await fetch(
      `https://api.freecurrencyapi.com/v1/currencies?apikey=${API_KEY}`,
      {
        method: 'GET'
      }
    )
    const data = await response.json()
    currencies.value = Object.keys(data.data)
    console.log(currencies.value)
  } catch (error) {
    console.error('Произошла ошибка при получении данных:', error)
  }
}

// Функция для получения курса валют
async function getExchangeRate(baseCurrency, targetCurrency) {
  try {
    const response = await fetch(
      `https://api.freecurrencyapi.com/v1/latest?apikey=${API_KEY}&currencies=${targetCurrency}&base_currency=${baseCurrency}`,
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
    return rate
  } catch (error) {
    console.error('Произошла ошибка при получении данных:', error)
  }
}

onMounted(() => {
  // Вызов функции для получения курса USD к EUR
  getExchangeRate(baseCurrency, targetCurrency)
  getAllCurrencies()
})
</script>

<template>
  <div class="calc">
    <div class="container">
      <p class="title">Currency Calculator</p>
      <div class="calc-side">
        <input class="calc-input" type="text" />
        <select name="" id="">
          <option v-if="currencies.length !== 0" v-for="currency in currencies" value="currency">
            {{ currency }}
          </option>
        </select>
      </div>
      <div class="calc-center">
        <img src="@/assets/icons/rotate-arrow.png" alt="rotate-arrow" class="rotate-arrow" />
      </div>
      <div class="calc-side">
        <input class="calc-input" type="text" />
        <select name="" id="">
          <option v-if="currencies.length !== 0" v-for="currency in currencies" value="currency">
            {{ currency }}
          </option>
        </select>
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
  font-size: var(--fontSize-1);
  font-family: sans-serif;
}
.calc-side {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: stretch;
}
.calc-input {
  background: var(--text-white);
  outline: none;
}
.calc-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
.rotate-arrow {
  width: 50px;
  height: 50px;
}
</style>

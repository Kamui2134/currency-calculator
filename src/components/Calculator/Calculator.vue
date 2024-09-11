<script setup>
import { computed, onMounted, ref } from 'vue'

// Замените API_KEY на ваш ключ API
const API_KEY = import.meta.env.VITE_API_KEY

const baseCurrency = ref('RUB')
const targetCurrency = ref('USD')
const baseSum = ref(0)
const targetSum = ref(0)
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

function changeTargetCurrency(event) {
  targetCurrency = event.target.value
}

function changeBaseCurrency(event) {
  baseCurrency = event.target.value
}

onMounted(() => {
  // Вызов функции для получения курса USD к EUR
  getExchangeRate(baseCurrency.value, targetCurrency.value)
  getAllCurrencies()
})

function handleBaseChange(event) {
    
}

function handleTargetChange(event) {

}
</script>

<template>
  <div class="calc">
    <div class="container">
      <p class="title">Currency Calculator</p>
      <div class="calc-side">
        <div class="input-container">
          <input class="calc-input" type="text" placeholder="0" @input="handleBaseChange($event)" />
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
        <img src="@/assets/icons/rotate-arrow.png" alt="rotate-arrow" class="icon rotate-arrow" />
      </div>
      <div class="calc-side">
        <div class="input-container">
          <input
            class="calc-input"
            type="text"
            placeholder="0"
            @input="handleTargetChange($event)"
          />
          <span class="duplicate">{{ baseCurrency }}</span>
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
  font-size: var(--fontSize-1);
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
}
.select-container {
  padding: 28px;
  border-radius: 0px 5px 5px 0px;
  background: var(--text-white);
}
.calc-select {
  outline: transparent;
  border: 0px solid transparent;
  background: var(--text-white);
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
.rotate-arrow {
}
</style>

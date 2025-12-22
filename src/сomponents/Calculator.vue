<script setup lang="ts">
import { ref, computed } from 'vue';
import { options } from '../constants/options';
import { UiButton, UiInput, UiSelect, UiField } from '@danilovd/is-ui';
import { isIpValid } from 'src/functions/IsIpValid';
import { getNetworkAddress } from 'src/functions/getNetworkAddress';
import { getAddressesCount } from 'src/functions/getAddressesCount';

const ipAddress = ref('');
// Устанавливаем значение по умолчанию, если массив опций не пуст
const selectedMaskOption = ref(options[0] || ''); 
const result = ref<{
  ip: string;
  mask: string;
  networkAddress: string;
  hostsCount: number;
} | null>(null);

// --- Вычисляемые свойства (Computed) ---

// Проверка валидности IP для блокировки кнопки
const isFormValid = computed(() => {
  return isIpValid(ipAddress.value);
});

// --- Методы (Handlers) ---

const handleCalculate = () => {
  // Дополнительная защита, если вызов произошел через Enter при невалидном IP
  if (!isFormValid.value) return;

  // В задании сказано, что в селекте варианты типа "24/255.255.255.0".
  // Для функций расчета нам нужна только часть с маской (255.255.255.0).
  // Разделяем строку по слэшу и берем вторую часть.
  const maskPart = selectedMaskOption.value.split('/')[1];

  // Если вдруг формат опций другой, можно добавить проверку, но следуем ТЗ.
  if (!maskPart) {
    console.error('Некорректный формат маски в опциях');
    return;
  }

  // Выполняем расчеты используя импортированные функции
  const network = getNetworkAddress(ipAddress.value, maskPart);
  const count = getAddressesCount(maskPart);

  // Записываем результат для отображения
  result.value = {
    ip: ipAddress.value,
    mask: selectedMaskOption.value, // "24/255.255.255.0"
    networkAddress: network,
    hostsCount: count,
  };
};
</script>

<template>
  <div class="calculator-container">
    <h2 class="calculator-title">Калькулятор подсетей</h2>

    <form @submit.prevent="handleCalculate" class="calculator-form">
      
      <UiField label="IP-адрес">
        <UiInput
          v-model="ipAddress"
          placeholder="192.168.1.150"
          :is-disabled="false"
        />
      </UiField>

      <UiField label="Маска сети">
        <UiSelect
          v-model="selectedMaskOption"
          :options="options"
          :is-disabled="false"
        />
      </UiField>

      <div class="button-wrapper">
        <UiButton
          layout="primary"
          type="submit"
          :is-disabled="!isFormValid"
        >
          Рассчитать
        </UiButton>
      </div>
    </form>

    <div v-if="result" class="results-container">
      <div class="result-item">
        <span class="result-label">IP:</span> {{ result.ip }}
      </div>
      <div class="result-item">
        <span class="result-label">Маска:</span> {{ result.mask }}
      </div>
      <div class="result-item">
        <span class="result-label">Адрес сети:</span> 
        <span class="result-value">{{ result.networkAddress }}</span>
      </div>
      <div class="result-item">
        <span class="result-label">Количество хостов:</span> 
        <span class="result-value">{{ result.hostsCount }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* Используем CSS переменные согласно заданию 2.
  Предполагается, что переменные типа --primary-color, --text-color 
  определены в глобальном colors.scss или :root 
*/

.calculator-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  background-color: var(--bg-surface, #ffffff); /* фоллбэк цвет */
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-family: sans-serif;
}

.calculator-title {
  margin-bottom: 1.5rem;
  color: var(--text-primary, #333);
  text-align: center;
}

.calculator-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem; /* Отступы между полями */
}

.button-wrapper {
  margin-top: 0.5rem;
  display: flex;
  justify-content: flex-end;
}

.results-container {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color, #eee);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.result-item {
  font-size: 1rem;
  color: var(--text-secondary, #555);
}

.result-label {
  font-weight: 600;
  color: var(--text-primary, #333);
  margin-right: 0.5rem;
}

.result-value {
  color: var(--primary-color, #007bff);
  font-weight: bold;
}
</style>